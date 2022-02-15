<template>
  <div class="container-box open">
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
      <div v-show="mode=='focus'">
        <p class="title">Focus Settings</p>
        <div v-for="(value, setting) in states['focus_set_settings']" v-bind:key="setting">
          <el-form-item :label="setting">
            <el-input v-model="states['focus_set_settings'][setting]"></el-input>
          </el-form-item>
        </div>
      </div>
      <div v-show="mode=='align'">
        <p class="title">Align Settings</p>
        <div v-for="(value, setting) in states['align_set_settings']" v-bind:key="setting">
          <el-form-item :label="setting">
            <el-input v-model="states['align_set_settings'][setting]"></el-input>
          </el-form-item>
        </div>
      </div>
      <div v-show="mode=='capture'">
        <p class="title">Capture Settings</p>
        <div v-for="(value, setting) in states['capture_set_settings']" v-bind:key="setting">
          <el-form-item :label="setting">
            <el-input v-model="states['capture_set_settings'][setting]"></el-input>
          </el-form-item>
        </div>
      </div>
      <div v-show="mode=='guide'">
        <p class="title">Guide Settings</p>
        <div v-for="(value, setting) in states['guide_set_settings']" v-bind:key="setting">
          <el-form-item :label="setting">
            <el-input v-model="states['guide_set_settings'][setting]"></el-input>
          </el-form-item>
        </div>
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
import DeviceApi from "@/services/device-api";

export default {
  name: 'Settings',
  components: {
  },
  props: ["mode", "load"],
  watch: {
    load(value) {
      switch(this.mode) {
        case 'focus':
        case 'align':
        case 'capture':
        case 'guide':
          DeviceApi.cameras()
          break
      }
      console.log("value=", value)
    }
  },
  data() {
    return {
      states : {
        'new_focus_state': {},
        'new_guide_state': {},
        'new_capture_state': {},
        'new_align_state': {},
        'focus_set_settings': {},
        'focus_set_primary_settings': {},
        'focus_set_process_settings': {},
        'focus_set_mechanics_settings': {},
        'capture_set_settings': {},
        'align_set_settings': {},
        'guide_set_settings': {}
      },
      menu: 'general',
      guide: {
        focal: 178,
        camera: 'ASI120'
      }
    }
  },
  computed: {
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
    ws.registerEvent(['new_', 'focus_set_', 'capture_set_settings', 'align_set_settings', 'guide_set_settings'], this.onEvent)
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
  top: 0px;
  width: 0%;
  height: 100%;
  color: white;
  background-color: black;
  opacity: 1.0;
  -webkit-transition: width 1s linear 500ms;
  -moz-transition: width 1s linear 500ms;
  transition: width 1s linear 500ms;
}

.container-box.open {
  display: block;
  position: absolute;
  width: 100%;
  height: 100%;
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
