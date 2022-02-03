<template>
  <div class="control-bar">
    <div class="spacer"></div>
    <el-container>
      <el-button-group>
        <el-button class="big-button" :icon="SwitchButton" @click="profileApi.stop()"></el-button>
      </el-button-group>
      <el-button-group>
        <el-button class="big-button" :class="{ selected: currentMode ==='capture' }" :icon="CameraFilled" @click="changeMode('capture')"></el-button>
        <el-button class="big-button" :class="{ selected: currentMode ==='record' }" :icon="VideoCameraFilled" @click="changeMode('record')"></el-button>
        <el-button class="big-button" :class="{ selected: currentMode ==='guide' }" :icon="Promotion" @click="changeMode('guide')"></el-button>
        <el-button class="big-button" :class="{ selected: currentMode ==='focus' }" :icon="Search" @click="changeMode('focus')"></el-button>
        <el-button class="big-button" :class="{ selected: currentMode ==='align' }" :icon="Rank" @click="changeMode('align')"></el-button>
        <el-button class="big-button" :class="{ selected: currentMode ==='settings' }" :icon="Tools" @click="changeMode('settings')"></el-button>
      </el-button-group>
    </el-container>
    <div class="spacer"></div>
  </div>
</template>
<script setup>
/* eslint-disable vue/no-unused-components */
import {
  SwitchButton,
  CameraFilled,
  VideoCameraFilled,
  Promotion,
  Search,
  Rank,
  Tools } from '@element-plus/icons'
</script>

<script>
import SocketUi from '@/services/websocket.js'
import ProfileApi from "@/services/profile-api.js";

export default {
  name: 'NavBar',
  components: {
    SwitchButton,
    CameraFilled,
    VideoCameraFilled,
    Promotion,
    Search,
    Rank,
    Tools
  },
  emits: {
    changeMode: null
  },
  data() {
    return {
      states : [],
      powered : false,
      currentMode : 'none',
      profileApi: ProfileApi
    }
  },
  methods: {
    onEvent(message) {
      if (message !== undefined) {
        this.parse(message)
      }
    },
    parse(message) {
      if (message.type === 'new_connection_state')
      {
        this.online = message.payload.online
        if (this.online === true) {
          this.changeMode('capture')
        } else {
          this.changeMode('none')
        }
      } else {
        if (this.states[message.type] === undefined) {
          this.states[message.type] = {}
        }
        this.states[message.type] = Object.assign(this.states[message.type], message.payload)
      }
    },
    changeMode(mode) {
      this.currentMode = mode
      this.$emit('changeMode', mode)
    }
  },
  mounted() {
    const ws = SocketUi.getInstance({host:'127.0.0.1', port: '3000'})
    ws.registerEvent(['new_'], this.onEvent)
    this.changeMode('capture')
  }


}
</script>

<style  scoped>
.control-bar {
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  background-color: black;
  opacity: 0.8;
  text-align: center;
  display: inline-flex;
  justify-content: space-around;
  align-content: space-around;
  flex-wrap: wrap;
  flex-direction: column;
}
.big-button, .big-button:focus {
  background: transparent;
  border: none;
  font-size: 3em;
}

.big-button:hover {
  color: white;
  background-color: transparent;
}

.selected {
  color: #1ef14c;
}

.spacer {

}
</style>
