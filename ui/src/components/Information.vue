<template>
  <div class="container-box" v-if="mode!='none'">
    <!--p>{{ states['new_mount_state'].name }} - {{ states['new_camera_state'].status }}</p-->
    <!--p>{{ states['new_camera_state'].name }} - {{ states['new_camera_state'].status }}</p-->
    <p>Focuser - {{ states['new_focus_state'].status }}</p>
    <p>Guider - {{ states['new_guide_state'].status }} </p>
    <p>Capture - {{ states['new_capture_state'].status }}</p>
    <p>Plate solver - {{ states['new_align_state'].status }}</p>
  </div>
</template>

<script>
import SocketUi from "@/services/websocket";

export default {
  name: 'Information',
  components: {
  },
  props: ["mode"],
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
.container-box {
  position: absolute;
  right: 150px;
  top: 300px;
  width: 180px;
  height: 300px;
  color:white;
  border: white solid 2px;
  border-radius: 25px;
  border-color: white;
}
</style>
