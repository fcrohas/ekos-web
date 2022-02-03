<template>
  <div class="left-control">
    <el-button @click="toggleGuider()" :class="{selected: guiderState}" :size="'15'" :icon="Promotion" class="big-icon"></el-button>
    <div class="text">Guider</div>
  </div>
</template>
<script setup>
/* eslint-disable vue/no-unused-components */
import {
  Promotion
} from '@element-plus/icons'
</script>
<script>

export default {
  name: 'Capture',
  components: {
  },
  emits: {
    showGuider: null
  },
  data() {
    return {
      guiderState: false
    }
  },
  methods: {
    toggleGuider() {
      this.guiderState = !this.guiderState
      console.log("Show guider emit", this.guiderState)
      this.$emit('showGuider', this.guiderState)
    }

  },
  created() {
  }


}
</script>

<style scoped>
.left-control {
  display:flex;
  justify-content:center;
  align-items:center;
  flex-direction: column;
  height: 100%;
  position: absolute;
  top: 0px;
  left: 0px;
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
  border: none;
  font-size: 3em;
  border: none;
}

.big-icon:hover {
  color: white;
  background-color: transparent;
}

.selected {
  color: green;
}

.text {
  color: white;
  font-size: 1em;
}
</style>
