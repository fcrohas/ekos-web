<template>
  <el-container>
    <canvas class="chart"
            ref="canvas"
            :height="height"
            :width="width"></canvas>
    <div class="overlay">{{ imageProperties.resolution }} - Gain: {{ imageProperties.gain }} - Exposure: {{ imageProperties.exposure}} s</div>
    <div class="capture" v-if="mode=='capture'">
      <el-progress type="circle" :percentage="progressCapture" :stroke-width="15" :color="'#aaaaaa'"/>
      <el-progress v-if="progressSequence!=-1" type="circle" :indeterminate="isIndeterminate" :stroke-width="15" :percentage="progressSequence" :color="'#aaaaaa'">
        <template #default="{ percentage }">
          <span class="percentage-value">{{ percentage }}%</span>
          <span class="percentage-label" v-if="percentage<100">En cours</span>
          <span class="percentage-label" v-if="percentage==100">Fin</span>
        </template>
      </el-progress>
      <div class="low-text">{{ getSequenceText }}</div>
    </div>
    <div class="mount-info" v-if="mode=='capture' && isMountConnected">
      <div class="low-text">RA : {{ getMountRA }}</div>
      <div class="low-text">DE : {{ getMountDE }}</div>
    </div>
  </el-container>
</template>

<script>
import SocketUi from '@/services/websocket.js'

export default {
  name: 'Viewer',
  components: {
  },
  props: ['mode'],
  data() {
    return {
      states : {},
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
  computed: {
    isMountConnected() {
      return this.states['new_mount_state'] !== undefined
    },
    getMountRA() {
      return this.states['new_mount_state'].ra
    },
    getMountDE() {
      return this.states['new_mount_state'].de
    },
    isIndeterminate() {
      const capture = this.states['new_capture_state'];
      return capture.seqr === undefined
    },
    getSequenceText() {
      const capture = this.states['new_capture_state'];
      if (capture !== undefined && capture.seqv !== undefined && capture.seqr !== undefined) {
        return capture.seql
      } else {
        return "None"
      }
    },
    progressCapture() {
      const capture = this.states['new_capture_state'];
      if (capture !== undefined && capture.expv !== undefined) {
        return 100 - Math.round(capture.expv * 100 / capture.expr)
      } else {
        return 0
      }
    },
    progressSequence() {
      const capture = this.states['new_capture_state'];
      if (capture !== undefined && capture.seqv !== undefined && capture.seqr !== undefined) {
        return 100 - Math.round(capture.seqv * 100 / capture.seqr)
      } else {
        return -1
      }
    }
  },
  methods: {
    onEvent(message) {
      if (message != undefined) {
        this.parse(message)
      }
    },
    onMessageEvent(message) {
      if (message != undefined) {
        if (this.states[message.type] === undefined) {
          this.states[message.type] = {}
        }
        this.states[message.type] = Object.assign(this.states[message.type], message.payload)
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
      const properties = JSON.parse(Buffer.from(dataArr.subarray(0, pos)).toString('utf-8'))
      if (properties.uuid.startsWith('+') && this.toMode(this.mode) === properties.uuid || this.mode === 'capture' && !properties.uuid.startsWith('+')) {
        this.imageProperties = properties
        const resolution = this.imageProperties.resolution.split('x')
        this.resolution.width = resolution[0]
        this.resolution.height = resolution[1]
        this.draw(dataArr.subarray(METADATA_PACKET))
        this.lastImage = dataArr.subarray(METADATA_PACKET)
      }
    },
    toMode(mode) {
      switch(mode) {
        case 'guide':
          return '+G'
        case 'focus':
          return '+F'
        case 'align':
          return '+A'
        default:
          return ''
      }
    },
    draw(raw) {
      const blob = new Blob([raw], {type: 'image/jpeg'})
      const url = URL.createObjectURL(blob)
      const img = new Image()
      const context = this.ctx
      const vm = this;
      // once image is loaded
      img.onload = function() {
        // clear rectangle before draw
        context.clearRect(0, 0, vm.width, vm.height);
        // draw it then release object
        // Center object
        context.drawImage(this, vm.width / 2 - img.width / 2, vm.height / 2 - img.height / 2) //, vm.resolution.width, vm.resolution.height)
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
    ws.registerEvent(['new_mount_state','new_capture_state', 'new_mount_state'], this.onMessageEvent)
  },
  mounted() {
    // Instantiate
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.height = window.innerHeight - this.margin;
    this.width = window.innerWidth - this.margin;
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
    background-color: #000e;
  }
  .overlay {
    position: absolute;
    opacity: 0.5;
    left: 0px;
    bottom: 0px;
    height: 50px;
    width: 100%;
    font-size: 2em;
    color: white;
    background-color: black;
  }
  .mount-info {
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction: column;
    position: absolute;
    padding: 10px;
    left: 1em;
    top: 1em;
    height: 30%;
    width: 20%;
    font-size: 2em;
    color: white;
  }
  .capture {
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction: column;
    position: absolute;
    padding: 10px;
    right: 5em;
    top: 2em;
    height: 30%;
    width: 20%;
    font-size: 2em;
    color: white;
  }
  .el-progress__text {
    color: white;
  }
  .el-progress--circle {
    margin: 20px 0px 0px 0px;
  }
  .percentage-value {
    display: block;
    margin-top: 10px;
    font-size: 28px;
  }
  .percentage-label {
    display: block;
    margin-top: 10px;
    font-size: 12px;
  }
  .low-text {
    font-size: 0.5em;
    margin: 20px 0px 0px 0px;
  }
</style>
