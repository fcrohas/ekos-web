<template>
  <div class="container-box">
    <Focus v-if="mode=='focus'"></Focus>
    <Capture v-if="mode=='capture'" @show-guider="onShowGuider"></Capture>
    <PolarAlign v-if="mode=='align'"></PolarAlign>
  </div>
</template>

<script>
import Capture from "@/components/tools/Capture.vue"
import Focus from "@/components/tools/Focus.vue"
import PolarAlign from "@/components/tools/PolarAlign";

export default {
  name: 'Toolbar',
  components: {
    Capture,
    Focus,
    PolarAlign
  },
  emits: {
    showGuider: null
  },
  props: ['mode'],
  data() {
    return {
      states : []
    }
  },
  methods: {
    onShowGuider(visible) {
      this.$emit("showGuider", visible)
    }
  },
  created() {
  }
}
</script>

<style scoped>
.container-box {
  position: absolute;
  left: 0px;
  top: 0px;
  height: 100%;
  opacity: 0.5;
}
</style>
