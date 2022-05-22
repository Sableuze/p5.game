<template>
  <div id="app">

    <VueCanvas @onGameOver="onGameOver" :key="key"/>
  </div>
</template>

<script>
import VueCanvas from "./components/canvas.component";
export default {
  name: "App",
  components: {
    VueCanvas
  },
  data() {
    return {
      stage: 0,
      key: 0
    }
  },
  methods: {
    onGameOver() {
      window.location.reload()
    },

  },
};
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
}

#app {
  margin-top: 60px;
  color: #2c3e50;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
