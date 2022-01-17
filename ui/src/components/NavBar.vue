<template>
  <el-container class="control-bar">
    <el-button-group>
      <el-button class="big-button" :icon="SwitchButton" @click="toggle('Simulators')"></el-button>
    </el-button-group>
    <el-button-group v-if="online==true">
      <el-button class="big-button" :icon="CameraFilled" @click="changeMode('capture')"></el-button>
      <el-button class="big-button" :icon="VideoCameraFilled" @click="changeMode('record')"></el-button>
      <el-button class="big-button" :icon="Promotion" @click="changeMode('guide')"></el-button>
      <el-button class="big-button" :icon="Search" @click="changeMode('focus')"></el-button>
      <el-button class="big-button" :icon="Rank" @click="changeMode('polar-align')"></el-button>
      <el-button class="big-button" :icon="Tools" @click="changeMode('settings')"></el-button>
    </el-button-group>
  </el-container>
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
      online: false,
      states : [],
      powered : false
    }
  },
  methods: {
    onEvent(message) {
      if (message != undefined) {
        this.parse(message)
      }
    },
    parse(message) {
      if (message.type == 'new_connection_state')
      {
        this.online = message.payload.online
        if (this.online == true) {
          this.changeMode('capture')
        } else {
          this.changeMode('none')
        }
      } else {
        if (this.states[message.type] == undefined) {
          this.states[message.type] = {}
        }
        this.states[message.type] = Object.assign(this.states[message.type], message.payload)
      }
    },
    toggle(profile) {
      this.powered = !this.powered
      if (this.powered) {
        ProfileApi.start(profile)
      } else {
        ProfileApi.stop(profile)
      }
    },
    changeMode(mode) {
      this.$emit('changeMode', mode);
    }
  },
  mounted() {
    const ws = SocketUi.getInstance({host:'127.0.0.1', port: '3000'})
    ws.registerEvent(['new_'], this.onEvent)
  }


}
</script>

<style  scoped>
.control-bar {
  position: absolute;
  top: 0px;
  left: 400px;
}
.big-button {
  width: 150px;
  height: 150px;
  background: transparent;
  color: white;
  border: none;
  font-size: 3em;
}

.big-button:hover {
  color: #1ef14c;
  background-color: transparent;
}
</style>
