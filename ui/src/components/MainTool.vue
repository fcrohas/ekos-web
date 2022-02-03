<template>
  <div class="right-control">
    <el-button :size="'15'" :icon="Camera" class="medium-icon" @click="togglePreview()"></el-button>
    <div class="text">Preview</div>
    <div class="spacer"></div>
    <el-button :size="'15'" :icon="VideoPlay" v-show="!isCapture" class="big-icon" @click="toggleCapture()"></el-button>
    <el-button :size="'15'" :icon="VideoPause" v-show="isCapture" class="big-icon" @click="toggleCapture()"></el-button>
    <div class="spacer"></div>
    <el-button :size="'15'" :icon="Eleme" class="medium-icon" @click="toggleExposure()"></el-button>
    <div class="text">{{ properties.exposure }} s</div>
  </div>
</template>
<script setup>
/* eslint-disable vue/no-unused-components */
import {
  Camera,
  Eleme,
  VideoPlay,
  VideoPause
} from '@element-plus/icons'
</script>
<script>
import CaptureApi from "@/services/capture-api.js"
import PolarAlignApi from "@/services/polar-align-api.js"
import FocusApi from "@/services/focus-api";
import AlignApi from "@/services/align-api";

export default {
  name: 'MainTool',
  components: {
  },
  props: ['mode'],
  data() {
    return {
      capture: CaptureApi,
      pah: PolarAlignApi,
      focus: FocusApi,
      align: AlignApi,
      exposures: [ 1, 5, 10, 20, 30, 40, 50, 60, 120, 180, 240, 300 ],
      gains: [ 50, 100, 150, 200, 250 ],
      properties: {
        exposure: 5,
        gain: 100
      },
      isCapture: false
    }
  },
  methods: {
    toggleExposure() {
      // get next exposure
      if (this.exposures.indexOf(this.properties.exposure) === this.exposures.length - 1) {
        this.properties.exposure = this.exposures[0]
      } else {
        this.properties.exposure = this.exposures[this.exposures.indexOf(this.properties.exposure) + 1]
      }
    },
    toggleGain() {
      // get next exposure
      if (this.gains.indexOf(this.properties.gain) === this.gains.length - 1) {
        this.properties.gain = this.exposures[0]
      } else {
        this.properties.gain = this.gains[this.gains.indexOf(this.properties.gain) + 1]
      }
    },
    togglePreview() {
      let device = null;
      switch(this.mode) {
        case 'capture':
          device = this.capture
          break;
        case 'focus':
          device = this.focus
          break;
        case 'align':
          device = this.align
          break;
        default:
          console.log("Not implemented mode ", this.mode)
      }
      if (device !== null) {
        device.capture()
      }
    },
    toggleCapture() {
      let device = null;
      switch(this.mode) {
        case 'capture':
          device = this.capture
          break;
        case 'polar-align':
          device = this.pah
          break;
        case 'focus':
          device = this.focus
          break;
        case 'align':
          device = this.align
          break;
        default:
          console.log("Not implemented mode ", this.mode)
      }
      if (device != null) {
        this.isCapture ? device.stop() : device.start()
        this.isCapture = !this.isCapture
      }
    }
  },
  created() {
  }


}
</script>

<style scoped>

.right-control {
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction: column;
  height: 100%;
  position: absolute;
  width: 10em;
  top: 0px;
  right: 0px;
  background-color: black;
}

.spacer {
  height: 0%;
}

.horizontal-spacer {
  width: 100%;
}

.big-icon, .big-icon:focus {
  background: transparent;
  color: white;
  font-size: 5em;
  border-radius: 60px;
  border-color: white;
  border: solid;
}

.big-icon:hover {
  color: white;
  background-color: transparent;
}

.medium-icon, .medium-icon:focus {
  background: transparent;
  color: white;
  font-size: 4em;
  border: none;
}

.medium-icon:hover {
  color: white;
  background-color: transparent;
}

.selected {
  color: green;
}

.spacer {
  height: 5%;
}

.text {
  color: white;
  font-size: 1em;
}
</style>
