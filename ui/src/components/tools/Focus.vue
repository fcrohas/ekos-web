<template>
  <div class="vertical-button">
    <el-button @click="focus.preview()" :size="15" :icon="View" class="big-icon"></el-button><br>
    <el-button @click="focus.start()" :size="15" :icon="VideoPlay" class="big-icon"></el-button><br>
    <el-button @click="focus.stop()" :size="15" :icon="VideoPause" class="big-icon"></el-button>
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

export default {
  name: 'Capture',
  components: {
  },
  data() {
    return {
      focus: FocusApi
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
