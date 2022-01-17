<template>
  <div class="vertical-button">
    <el-button @click="capture.preview()" :size="15" :icon="View" class="big-icon"></el-button><br>
    <el-button @click="capture.start()" :size="15" :icon="VideoPlay" class="big-icon"></el-button><br>
    <el-button @click="capture.stop()" :size="15" :icon="VideoPause" class="big-icon"></el-button>
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
import CaptureApi from "@/services/capture-api"

export default {
  name: 'Capture',
  components: {
  },
  data() {
    return {
      capture: CaptureApi
    }
  },
  methods: {


  },
  created() {
  }


}
</script>

<style  scoped>
.vertical-button {
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction: column;
}

.big-icon {
  background: transparent;
  color: white;
  border: none;
  font-size: 3em;
}
</style>
