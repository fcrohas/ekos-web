<template>
  <div class="container-box" :class="{open: isOpen}">
    <!-- v-if="mode!='none'"-->
    <el-icon @click="open()" :size="20">
      <tools/>
    </el-icon>
    <!--p>{{ states['new_mount_state'].name }} - {{ states['new_camera_state'].status }}</p-->
    <!--p>{{ states['new_camera_state'].name }} - {{ states['new_camera_state'].status }}</p-->
    <div v-if="isOpen">
      <p>Focuser - {{ states['new_focus_state'].status }}</p>
      <p>Guider - {{ states['new_guide_state'].status }} </p>
      <p>Capture - {{ states['new_capture_state'].status }}</p>
      <p>Plate solver - {{ states['new_align_state'].status }}</p>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable vue/no-unused-components */
import {
  Tools
} from '@element-plus/icons'
</script><script>
import SocketUi from "@/services/websocket";

export default {
  name: 'Information',
  components: {
  },
  props: ["mode"],
  data() {
    return {
      states : {
        'new_focus_state': {},
        'new_guide_state': {},
        'new_capture_state': {},
        'new_align_state': {}
      },
      isOpen : false
    }
  },
  methods: {
    onEvent(message) {
      if (message !== undefined) {
        this.parse(message)
      }
    },
    parse(message) {
      if (message.type !== 'new_connection_state') {
        if (this.states[message.type] === undefined) {
          this.states[message.type] = {}
        }
        this.states[message.type] = Object.assign(this.states[message.type], message.payload)
      }
    },
    prettyfy(value) {
      return JSON.stringify(value, null, 2);
    },
    open() {
      this.isOpen =! this.isOpen
    }
  },
  created() {
    const ws = SocketUi.getInstance({host:'127.0.0.1', port: '3000'})
    ws.registerEvent(['new_'], this.onEvent)
  }
}
</script>

<style  scoped>
.container-box {
  position: absolute;
  right: 0px;
  top: 25%;
  width: 0px;
  height: 300px;
  color: white;
  border: white solid 2px;
  border-radius: 25px;
  border-color: white;
  background-color: black;
  opacity: 0.7;
}

.container-box.open {
  position: absolute;
  right: 0px;
  top: 25%;
  width: 250px;
  height: 300px;
  color: white;
  border: white solid 2px;
  border-radius: 25px;
  border-bottom-right-radius: 0px;
  border-top-right-radius: 0px;
  border-color: white;
}

.el-icon {
  position: absolute;
  left: -37px;
  top:  100px;
  font-size: 2em;
  border: white solid 2px;
  border-radius: 25px;
  border-bottom-right-radius: 0px;
  border-top-right-radius: 0px;
  border-right-color: black;
  border-color: white;
}
</style>
