<template>
  <div class="vertical-button">
    <div class="spacer"></div>
    <el-button @click="focus.capture()" :size="15" :icon="View" class="big-icon"></el-button>
    <p class="text">Capture</p>
    <el-button @click="focus.start()" :size="15" :icon="VideoPlay" class="big-icon"></el-button>
    <p class="text">Start</p>
    <el-button @click="focus.stop()" :size="15" :icon="VideoPause" class="big-icon"></el-button>
    <p class="text">Stop</p>
  </div>
</template>

<script setup>
/* eslint-disable vue/no-unused-components */
import {
  View,
  VideoPlay,
  VideoPause } from '@element-plus/icons'
</script>

<script>
import FocusApi from '@/services/focus-api'
import SocketUi from "@/services/websocket";

export default {
  name: 'Focus',
  components: {
  },
  data() {
    return {
      focus: FocusApi,
      state : {}
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
    }
  },
  created() {
    const ws = SocketUi.getInstance({host:'127.0.0.1', port: '3000'})
    ws.registerEvent(['new_focus_state'], this.onEvent)
  },


}
</script>

<style  scoped>
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
  background: transparent;
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
</style>
