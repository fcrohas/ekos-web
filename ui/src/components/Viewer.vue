<template>
  <el-container>
    <canvas class="chart"
            ref="canvas"
            :height="height"
            :width="width"></canvas>
    <div class="overlay">{{ imageProperties.resolution }} - {{ imageProperties.gain }} - {{ imageProperties.temperature}} °C</div>
  </el-container>
</template>

<script>
import SocketUi from '@/services/websocket.js'

export default {
  name: 'Viewer',
  components: {
  },
  data() {
    return {
      states : [],
      imageProperties: {},
      lastImage : null,
      width : 800,
      height : 600,
      margin : 20,
      resolution : {
        width: 0,
        height: 0
      }
    }
  },
  methods: {
    onEvent(message) {
      if (message != undefined) {
        this.parse(message)
      }
    },
    parse(message) {
      const METADATA_PACKET = 512
      const dataArr = new Uint8Array(Buffer.from(message))
      let pos = -1
      // detect end of METADATA, maximum is 512
      dataArr.find((element, index) => {
        pos = index
        return element == 0x0
      })
      // is 0x0 found upper than METADATA_PACKET limit then header is full
      if (pos > METADATA_PACKET) pos = METADATA_PACKET
      this.imageProperties = JSON.parse(Buffer.from(dataArr.subarray(0,pos)).toString('utf-8'))
      const resolution = this.imageProperties.resolution.split('x')
      this.resolution.width = resolution[0]
      this.resolution.height = resolution[2]
      this.draw(dataArr.subarray(METADATA_PACKET))
      this.lastImage = dataArr.subarray(METADATA_PACKET)
    },
    draw(raw) {
      const blob = new Blob([raw], {type: 'image/jpeg'})
      const url = URL.createObjectURL(blob)
      const img = new Image()
      const context = this.ctx
      //const vm = this;
      // once image is loaded
      img.onload = function() {
          // draw it then release object
          context.drawImage(this, 700,200) //, vm.resolution.width, vm.resolution.height)
          URL.revokeObjectURL(url)
      }
      img.onerror = function() {
        console.log('Error loading image from websocket')
      }
      img.src = url
    },
    prettyfy(value) {
      return JSON.stringify(value, null, 2);
    },
    handleResize() {
      // Calculate new canvas size based on window
      // const canvasSize = this.canvas.parentNode
      // this.ctx.canvas.width = canvasSize.clientWidth
      // this.ctx.canvas.height = canvasSize.clientHeight
      this.height = window.innerHeight - this.margin;
      this.width = window.innerWidth - this.margin;
      if (this.lastImage !== null) {
        this.draw(this.lastImage);      
      }
    }
  },
  created() {
    const ws = SocketUi.getInstance({})
    ws.registerDataEvent(this.onEvent)
  },
  mounted() {
    // Instantiate
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    // Bind canvas resize
    window.addEventListener('resize', this.handleResize);
    this.handleResize();    
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }


}
</script>

<style  scoped>
  .chart {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
    width: 100%;
    background-color: #000;
  }
  .overlay {
    position: absolute;
    left: 400px;
    bottom: 0px;
    font-size: 1em;
    color: white;
  }
</style>
