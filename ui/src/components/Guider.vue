<template>
  <el-container class="chart" v-show="show">
    <canvas ref="canvas" :height="height" :width="width"></canvas>
    <p class="status">Guider RA: {{ driftRA }} DE: {{ driftDE }} RMS: {{ state.rms }}</p>
  </el-container>
</template>

<script>
import SocketUi from '@/services/websocket.js'

export default {
  name: 'Guider',
  components: {
  },
  data() {
    return {
      state : {
        drift_ra: 0,
        drift_de: 0,
        rarms :0,
        derms: 0,
        rms: 0
      },
      history: []
    }
  },
  props: ['width','height', 'show'],
  watch: {
    show(newValue) {
      if (newValue) {
        this.$nextTick(function () {
          this.drawGrid()
        })
      }
    }
  },
  computed: {
    driftRA() {
      return this.formatDrift(this.state.drift_ra)
    },
    driftDE() {
      return this.formatDrift(this.state.drift_de)
    },
    rmsRA() {
      return this.formatDrift(this.state.rarms)
    },
    rmsDE() {
      return this.formatDrift(this.state.derms)
    }
  },
  methods: {
    formatDrift(value) {
      return Math.round(value * 1000) / 100
    },
    onEvent(message) {
      if (message != undefined) {
        this.parse(message)
      }
    },
    parse(message) {
      this.state = Object.assign(this.state, message.payload)
      console.log("Guider state=", this.state)
      if (this.history.length > 10) {
        this.history.shift()
        this.history.push(Object.assign({}, this.state))
      } else {
        this.history.push(Object.assign({}, this.state))
      }
      this.drawGrid()
    },
    drawGrid() {
      const canvasSize = this.canvas.parentNode
      this.ctx.canvas.width = canvasSize.clientWidth
      this.ctx.canvas.height = canvasSize.clientHeight
      console.log("width=",this.ctx.canvas.width, " height=",this.ctx.canvas.height)
      // draw middle
      const offsetX = 25
      const offsetY = 12
      const height = 150
      const width = 350
      const steps = 6
      const stepHeight = height / steps
      const middleHeight = height / 2
      this.ctx.beginPath()
      this.ctx.moveTo(offsetX, offsetY + middleHeight)
      this.ctx.lineTo(offsetX + width, offsetY + middleHeight)
      this.ctx.moveTo(offsetX, offsetY -5)
      this.ctx.lineTo(offsetX, offsetY + 5 + height)
      this.ctx.lineWidth = 3
      // set line color
      this.ctx.strokeStyle = '#ffffff'
      this.ctx.stroke()
      // small lines
      for (let i = 0; i <= steps ; i++) {
        this.ctx.beginPath()
        this.ctx.moveTo(offsetX - 5, offsetY + stepHeight * i)
        this.ctx.lineTo(offsetX + width, offsetY + stepHeight * i)
        this.ctx.lineWidth = 1
        // set line color
        this.ctx.strokeStyle = '#ffffff'
        this.ctx.stroke()
        this.ctx.font = '11px serif'
        this.ctx.fillStyle = '#ffffff'
        this.ctx.fillText(steps - i - steps / 2, offsetX - 15, offsetY + stepHeight * i)
      }
      // draw curve
      const stepWidth = width / this.history.length
      let pos = 0
      if (this.history.length > 0) {
        this.ctx.beginPath()
        this.ctx.moveTo(offsetX, offsetY + stepHeight * (steps / 2) + this.history[0].drift_de)
        this.ctx.strokeStyle = '#ff0000'
        this.ctx.lineWidth = 2
        this.history.forEach(point => {
          this.ctx.lineTo(offsetX + stepWidth * pos, offsetY + stepHeight * (steps / 2) + point.drift_de)
          pos += 1
        })
        pos = 0
        this.ctx.stroke()
        this.ctx.beginPath()
        this.ctx.moveTo(offsetX, offsetY + stepHeight * (steps / 2) + this.history[0].drift_ra)
        this.ctx.strokeStyle = '#0000ff'
        this.ctx.lineWidth = 2
        this.history.forEach(point => {
          this.ctx.lineTo(offsetX + stepWidth * pos, offsetY + stepHeight * (steps / 2) + point.drift_ra)
          pos += 1
        })
        this.ctx.stroke()
      }
    }

  },
  created() {
    const ws = SocketUi.getInstance({host:'127.0.0.1', port: '3000'})
    ws.registerEvent(['new_guide_state'], this.onEvent)
  },

  mounted() {
    this.canvas = this.$refs.canvas
    this.ctx = this.canvas.getContext("2d")
    this.drawGrid()
  }


}
</script>

<style  scoped>
  .chart {
    position: absolute;
    bottom: 100px;
    left: 200px;
    display: flex;
    height: 200px;
    width: 400px;
    border: white solid 2px;
    border-radius: 25px;
    border-color: white;
    background-color: black;
    opacity: 0.7;
  }
  .status {
    position: absolute;
    background: transparent;
    left: 25%;
    bottom: 0px;
    font-size: 0.8em;
    text-align: center;
    color: white;
  }
</style>
