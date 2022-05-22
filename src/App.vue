<template>
  <div id="app">
    <VueCanvas @onGameOver="onGameOver"/>
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
      stage: ''
    }
  },
  methods: {
    onGameOver(success) {
      console.log(success)
      alert(success)
    }
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
