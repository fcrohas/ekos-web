<template>
  <el-container>
    <el-card class="box-card" v-if="states['new_mount_state'] !== undefined">
      <template #header>
        <div class="card-header">
          <span>{{ states['new_mount_state'].name }}</span>
          <p>{{ states['new_mount_state'].status }}</p>
        </div>
      </template>
      <div>
        <div>at {{ states['new_mount_state'].at }}</div>
        <div>az {{ states['new_mount_state'].az }}</div>
        <div>de {{ states['new_mount_state'].de }}</div>
        <div>ha {{ states['new_mount_state'].ha }}</div>
        <div>ra {{ states['new_mount_state'].ra }}</div>
      </div>
    </el-card>
    <el-card class="box-card" v-if="states['new_camera_state'] !== undefined">
      <template #header>
        <div class="card-header">
          <span>{{ states['new_camera_state'].name }}</span>
          <p>{{ states['new_camera_state'].status }}</p>
        </div>
      </template>
      <div>
        <div>Temperature {{ states['new_camera_state'].temperature }}</div>
        <div>Gain {{ states['new_camera_state'].gain }}</div>
      </div>
    </el-card>
    <el-card class="box-card" v-if="states['new_polar_state'] !== undefined">
      <template #header>
        <div class="card-header">
          <span>Polar Align</span>
          <p v-if="states['new_polar_state'].stage !== undefined">{{ states['new_polar_state'].stage }}</p>
        </div>
      </template>
      <div>
        <div v-if="states['new_polar_state'].stage !== undefined">{{ states['new_polar_state'].message }}</div>
        <div v-if="states['new_polar_state'].stage !== undefined">To be done</div>
      </div>
    </el-card>
    <el-card class="box-card" v-if="states['new_guide_state'] !== undefined">
      <template #header>
        <div class="card-header">
          <span>Guider</span>
          <p>{{ states['new_guide_state'].status }}</p>
        </div>
      </template>
      <div>
        <div>{{ prettyfy(states['new_guide_state']) }}</div>
      </div>
    </el-card>
    <el-card class="box-card" v-if="states['new_capture_state'] !== undefined">
      <template #header>
        <div class="card-header">
          <span>Capture</span>
          <p>{{ states['new_capture_state'].status }}</p>
        </div>
      </template>
      <div>
        <div>{{ prettyfy(states['new_capture_state']) }}</div>
      </div>
    </el-card>
    <el-card class="box-card" v-if="states['new_focus_state'] !== undefined">
      <template #header>
        <div class="card-header">
          <span>Focuser</span>
          <p>{{ states['new_focus_state'].status }}</p>
        </div>
      </template>
      <div>
        <div>{{ prettyfy(states['new_focus_state']) }}</div>
      </div>
    </el-card>
    <el-card class="box-card" v-if="states['new_align_state'] !== undefined">
      <template #header>
        <div class="card-header">
          <span>PlateSolver</span>
          <p>{{ states['new_align_state'].status }}</p>
        </div>
      </template>
      <div>
        <div>{{ prettyfy(states['new_align_state']) }}</div>
      </div>
    </el-card>
  </el-container>
</template>

<script>
import SocketUi from '@/services/websocket.js'

export default {
  name: 'State',
  components: {
  },
  data() {
    return {
      states : []
    }
  },
  methods: {
    onEvent(message) {
      if (message != undefined) {
        this.parse(message)
      }
    },
    parse(message) {
      if (message.type != 'new_connection_state') {
        if (this.states[message.type] == undefined) {
          this.states[message.type] = {}
        }
        this.states[message.type] = Object.assign(this.states[message.type], message.payload)
      }
    },
    prettyfy: function(value) {
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
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .box-card {
    opacity: 0."";
    width: 250px;
  }
</style>
