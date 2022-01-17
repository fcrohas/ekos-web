<template>
  <div class="container-box">
    <Focus v-if="mode=='focus'"></Focus>
    <Capture v-if="mode=='capture'"></Capture>
  </div>
</template>

<script>
import Capture from "@/components/tools/Capture.vue"
import Focus from "@/components/tools/Focus.vue"

export default {
  name: 'Toolbar',
  components: {
    Capture,
    Focus
  },
  props: ['mode'],
  data() {
    return {
      states : []
    }
  },
  methods: {
  },
  created() {
  }
}
</script>

<style  scoped>
.container-box {
  position: absolute;
  left: 150px;
  top: 300px;
  width: 200px;
  height: 400px;
}
</style>
