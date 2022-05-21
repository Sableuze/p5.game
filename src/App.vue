<template>
  <div id="app">
    <VueCanvas @onStageChange="updateStage" @onGameOver="updateStage(0)"/>
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
    updateStage(stage) {
      this.stage = stage
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
