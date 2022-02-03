<template>
  <div class="horizontal-info">
  <div class="vertical-button">
    <div class="spacer"></div>
    <el-button @click="pah.setZoom(1.5)" :size="15" :icon="ZoomIn" class="big-icon"></el-button>
    <p class="text">Zoom in</p>
    <el-button @click="pah.setZoom(0.5)" :size="15" :icon="ZoomOut" class="big-icon"></el-button>
    <p class="text">Zoom out</p>
    <el-button @click="pah.refresh(1.0)" :size="15" :icon="Refresh" class="big-icon"></el-button>
    <p class="text">Refresh</p>
    <el-button @click="togglePolarAlign()" :size="15" :icon="Aim" class="big-icon"></el-button>
    <p class="text">Polar</p>
  </div>
  <div class="info" v-if="isPolarAlign">
    <h3 class="title">{{ state.stage }}</h3>
    <p>{{ state.message }}</p>
    <el-button @click="nextStage()">Next</el-button>
    <el-button @click="pah.resetView()">Stop</el-button>
  </div>
  </div>
</template>

<script setup>
/* eslint-disable vue/no-unused-components */
import {
  ZoomIn,
  ZoomOut,
    Refresh,
  Aim
} from '@element-plus/icons'
</script>

<script>
import SocketUi from '@/services/websocket.js'
import States from '@/services/states.js'
import PolarAlignApi from '@/services/polar-align-api'

export default {
  name: 'PolarAlign',
  components: {
  },
  data() {
    return {
      pah: PolarAlignApi,
      states: States.getInstance(),
      state : {},
      isPolarAlign: false
    }
  },
  methods: {
    onEvent(message) {
      if (message != undefined) {
        this.parse(message)
      }
    },
    parse(message) {
      this.state = Object.assign(this.state, message.payload)
    },
    togglePolarAlign() {
      this.isPolarAlign = !this.isPolarAlign
    },
    nextStage() {
      switch (this.state.stage) {
        case 'Idle':
        case  undefined:
          this.pah.start()
          break;
        default:
          console.log("stage=", this.state.stage)
      }
    }
  },
  created() {
    const ws = SocketUi.getInstance({host:'127.0.0.1', port: '3000'})
    ws.registerEvent(['new_polar_state'], this.onEvent)
  }


}
</script>

<style  scoped>
.horizontal-info {
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction: row;
  height: 100%;
}

.vertical-button {
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction: column;
  height: 100%;
}

.spacer {
  height: 0%;
}

.big-icon {
  background-color: transparent;
  color: white;
  border: none;
  font-size: 3em;
  border: none;
}

.big-icon:hover {
  color: white;
  background-color: transparent;
}

.text {
  color: white;
  font-size: 1em;
}
.info {
  color: white;
  width: 200px;
  margin: 20px;
  height: 300px;
}

.title {
  text-underline: white;
  border-bottom: solid 1px;
}
</style>
