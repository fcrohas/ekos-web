<template>
  <div class="container-box" :class="{open: isOpen}">
    <div class="main-menu">
      <el-icon @click="select('guide')">
        <promotion></promotion>
      </el-icon>
      <el-icon @click="select('general')">
        <tools></tools>
      </el-icon>
      <el-icon @click="select('focus')">
        <rank></rank>
      </el-icon>
    </div>
    <div class="content">
      <div v-show="menu='guide'">
        <p class="title">Guide Settings</p>
        <el-form-item label="Camera">
          <el-input v-model="guide.camera"></el-input>
        </el-form-item>
        <el-form-item label="Focal length">
          <el-input v-model="guide.focal"></el-input>
        </el-form-item>
      </div>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable vue/no-unused-components */
import {
  Promotion,
  Rank,
  Tools } from '@element-plus/icons'
</script>
<script>
import SocketUi from "@/services/websocket";

export default {
  name: 'Settings',
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
      menu: 'general',
      guide: {
        focal: 178,
        camera: 'ASI120'
      }
    }
  },
  computed: {
    isOpen() {
      return this.mode === "settings"
    }
  },
  methods: {
    select(menu) {
      this.menu = menu
    },
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
    }
  },
  created() {
    const ws = SocketUi.getInstance({host:'127.0.0.1', port: '3000'})
    ws.registerEvent(['new_'], this.onEvent)
  }
}
</script>

<style  scoped>
.main-menu {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  height: 100%;
  position: absolute;
  width: 4em;
  top: 0px;
  left: 0px;
  border-style: solid;
  border-right-width: 1px;
  border-top-width: 0px;
  border-bottom-width: 0px;
  border-left-width: 0px;
  background-color: black;
  flex-wrap: wrap;
  align-content: space-around;
}

.container-box {
  display: none;
  position: absolute;
  right:0px;
  top: 7%;
  width: 0%;
  height: 70%;
  color: white;
  background-color: black;
  opacity: 0.7;
  -webkit-transition: width 1s linear 500ms;
  -moz-transition: width 1s linear 500ms;
  transition: width 1s linear 500ms;
}

.container-box.open {
  display: block;
  position: absolute;
  width: 70%;
  height: 70%;
  color: white;
}

.el-icon {
  font-size: 2em;
  margin: 5px 0px 5px 0px;
}

.title {
  border-style: solid;
  border-bottom-width: 1px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
}

.content {
  position: relative;
  left: 5em;
}

.item {
  text-align: left;
  border-bottom-width: 1px;
  border-top-width: 0px;
  border-left-width: 0px;
  border-right-width: 0px;
}

@keyframes slidein {
  from {
    width:0%
  }

  to {
    width:70%;
  }
}

</style>
