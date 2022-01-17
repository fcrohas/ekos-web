<template>
  <el-container class="chart">
    <canvas ref="canvas" :height="height" :width="width"></canvas>
    <p class="status">Guider RA/DE</p>
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
      states : []
    }
  },
  props: ['width','height', 'mode'],
  methods: {
    onEvent(message) {
      if (message != undefined) {
        this.parse(message)
      }
    },
    parse(message) {
      console.log("guider message", message)
      this.drawGrid()
    },
    drawGrid() {
      // draw middle
      const offsetX = 25
      const offsetY = 12
      const height = 150
      const steps = 6
      const stepHeight = height / steps
      const middleHeight = height / 2
      this.ctx.beginPath()
      this.ctx.moveTo(offsetX, offsetY + middleHeight)
      this.ctx.lineTo(offsetX + 350, offsetY + middleHeight)
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
        this.ctx.lineTo(offsetX + 350, offsetY + stepHeight * i)
        this.ctx.lineWidth = 1
        // set line color
        this.ctx.strokeStyle = '#ffffff'
        this.ctx.stroke()
        this.ctx.font = '11px serif'
        this.ctx.fillStyle = '#ffffff'
        this.ctx.fillText(i - steps / 2, offsetX - 15, offsetY + stepHeight * i)
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
    const canvasSize = this.canvas.parentNode
    this.ctx.canvas.width = canvasSize.clientWidth
    this.ctx.canvas.height = canvasSize.clientHeight
    this.drawGrid()
  }


}
</script>

<style  scoped>
  .chart {
    position: absolute;
    bottom: 200px;
    left: 300px;
    display: flex;
    height: 200px;
    width: 400px;
    border: white solid 2px;
    border-radius: 25px;
    border-color: white;
  }
  .status {
    position: absolute;
    background: transparent;
    left: 150px;
    bottom: 0px;
    text-align: center;
    color: white;
  }
</style>
