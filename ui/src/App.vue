<template>
  <v-main>
    <Main/>
  </v-main>
</template>

<script>
import Main from './components/Main.vue'

export default {
  name: 'App',
  components: {
    Main
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.el-main {
  padding: 0px !important;
}

.menu-settings {
  top: 4em !important;
  right: 10em !important;
  height: 90% !important;
}

</style>
