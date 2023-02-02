<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import heatmap from './components/heatmap.vue'

export default {
  name: 'App',
  components: {
    heatmap
  }
}
</script>

<style>
#app {
  /* height: 100vh; */
}
body{
  margin: 0;
}
</style>
