<template>
  <div id="app">
    <p id="preloaderText">Жди жди жди жди</p>
    <div id="game">
    <VueCanvas @onGameOver="onGameOver" />
    </div>
  </div>
</template>

<script>
import VueCanvas from "./components/canvas.component";
import {gsap} from "gsap";
export default {
  name: "App",
  components: {
    VueCanvas
  },
  mounted() {
    gsap.to('#game', {visibility: 'hidden'})
    gsap.fromTo('#game', {opacity: 0}, {opacity: 1, duration: 3, onComplete: () => {
      gsap.to('#preloaderText', {visibility: 'hidden'})
        gsap.to('#game', {visibility: 'visible'})

      }} )
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
