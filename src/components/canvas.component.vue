<template>
  <div id="vue-canvas"></div>
</template>

<script>
import {mashroomImg, sshImg, kursliteImg, vmwareImg} from "@/assets/images";
import 'p5/lib/addons/p5.sound';

let gameStatus = {
  over: false,
  success: null
}
const script = (p5) => {
  let numSegments = 10;
  let stage = 0;
  let maxStages = 3
  let direction = 'right';

  const xStart = 0; //starting x coordinate for snake
  const yStart = 250; //starting y coordinate for snake
  const diff = 10;

  let xCor = [];
  let yCor = [];

  let xFruit = 100;
  let yFruit = 50;

  let scoreElem;
  const w = 500
  const h = 500
  const wFruit = 30
  const hFruit = 30

  let mashroomImage
  let sshImage
  let kursliteImage
  let vmwareImage
  p5.setup = () => {
    scoreElem = p5.createDiv(`${gameTitle} = 0`);
    scoreElem.position(20, 20);
    scoreElem.id = 'score';
    scoreElem.style('color', 'red');
    p5.createCanvas(w, h);
    p5.frameRate(15);
    p5.stroke(255);
    p5.strokeWeight(10);

    initImages()
    updateFruitCoordinates();

    p5.image(getFruitImage(stage), xFruit, yFruit, wFruit, hFruit);

    for (let i = 0; i < numSegments; i++) {
      xCor.push(xStart + i * diff);
      yCor.push(yStart);
    }
  }

  p5.draw = () => {
    p5.background(0);
    for (let i = 0; i < numSegments - 1; i++) {
      p5.line(xCor[i], yCor[i], xCor[i + 1], yCor[i + 1]);
    }
    updateSnakeCoordinates();
    checkGameStatus();
    checkForFruit();
    redrawFruit(stage)
  }

  function updateSnakeCoordinates() {
    for (let i = 0; i < numSegments - 1; i++) {
      xCor[i] = xCor[i + 1];
      yCor[i] = yCor[i + 1];
    }
    switch (direction) {
      case 'right':
        xCor[numSegments - 1] = xCor[numSegments - 2] + diff;
        yCor[numSegments - 1] = yCor[numSegments - 2];
        break;
      case 'up':
        xCor[numSegments - 1] = xCor[numSegments - 2];
        yCor[numSegments - 1] = yCor[numSegments - 2] - diff;
        break;
      case 'left':
        xCor[numSegments - 1] = xCor[numSegments - 2] - diff;
        yCor[numSegments - 1] = yCor[numSegments - 2];
        break;
      case 'down':
        xCor[numSegments - 1] = xCor[numSegments - 2];
        yCor[numSegments - 1] = yCor[numSegments - 2] + diff;
        break;
    }
  }

  /*
   I always check the snake's head position xCor[xCor.length - 1] and
   yCor[yCor.length - 1] to see if it touches the game's boundaries
   or if the snake hits itself.
  */
  function checkGameStatus() {
    if (
        xCor[xCor.length - 1] > p5.width ||
        xCor[xCor.length - 1] < 0 ||
        yCor[yCor.length - 1] > p5.height ||
        yCor[yCor.length - 1] < 0 ||
        checkSnakeCollision()
    ) {
      p5.noLoop();
      const scoreVal = parseInt(scoreElem.html().substring(8));
      scoreElem.html('Game ended! Your score was : ' + scoreVal);
    } else if (stage > maxStages) {
      p5.noLoop()
      gameStatus.over = true
      gameStatus.success = true
    }
  }

  /*
   If the snake hits itself, that means the snake head's (x,y) coordinate
   has to be the same as one of its own segment's (x,y) coordinate.
  */
  function checkSnakeCollision() {
    const snakeHeadX = xCor[xCor.length - 1];
    const snakeHeadY = yCor[yCor.length - 1];
    for (let i = 0; i < xCor.length - 1; i++) {
      if (xCor[i] === snakeHeadX && yCor[i] === snakeHeadY) {
        return true;
      }
    }
  }

  function checkFruitAndSnakeCollision(snakeX, snakeY, fruitX, fruitY, fruitW, fruitH) {
    if (snakeX === fruitX && snakeY === fruitY) {

    }
    let XColl = false;
    let YColl = false
    if ((snakeX >= fruitX) && (snakeX <= fruitX + fruitW)) XColl = true;
    if ((snakeY >= fruitY) && (snakeY <= fruitY + fruitH)) YColl = true;

    if (XColl && YColl) {
      return true;
    }
    return false
  }


  function checkForFruit() {

    const xSnake = xCor[xCor.length - 1]
    const ySnake = yCor[yCor.length - 1]
    // p5.point(xFruit, yFruit);
    if (checkFruitAndSnakeCollision(xSnake, ySnake, xFruit, yFruit, wFruit, hFruit)) {
      const prevScore = parseInt(scoreElem.html().substring(8));
      scoreElem.html('Score = ' + (prevScore + 1));
      xCor.unshift(xCor[0]);
      yCor.unshift(yCor[0]);
      numSegments++;
      stage++
      updateFruitCoordinates();
      redrawFruit(getFruitImage(stage))
    }
  }

  function getFruitImage(stage) {
    switch (stage) {
      case 0:
        return mashroomImage
      case 1:
        return sshImage
      case 2:
        return kursliteImage
      case 3:
        return vmwareImage
      default:
        return vmwareImage
    }
  }

  function redrawFruit(stage) {
    const img = getFruitImage(stage)
    p5.image(img, xFruit, yFruit, wFruit, hFruit);
  }

  function updateFruitCoordinates() {
    xFruit = p5.floor(p5.random(10, (p5.width - 100) / 10)) * 10;
    yFruit = p5.floor(p5.random(10, (p5.height - 100) / 10)) * 10;
  }

  function initImages() {
    mashroomImage = p5.loadImage(mashroomImg)
    sshImage = p5.loadImage(sshImg)
    kursliteImage = p5.loadImage(kursliteImg)
    vmwareImage = p5.loadImage(vmwareImg)
  }

  p5.keyPressed = (e) => {
    const {keyCode} = e
    switch (keyCode) {
      case 65:
        if (direction !== 'right') {
          direction = 'left';
        }
        break;
      case 68:
        if (direction !== 'left') {
          direction = 'right';
        }
        break;
      case 87:
        if (direction !== 'down') {
          direction = 'up';
        }
        break;
      case 83 :
        if (direction !== 'up') {
          direction = 'down';
        }
        break;
    }
  }

}
const gameTitle = 'УРОВЕНЬ БЕЗОПАСНОСТИ'
export default {
  name: "VueCanvas",
  mounted() {
    const P5 = require("p5");
    new P5(script);
    this.gameStatus = gameStatus
  },
  data() {
    return {
      stage: 0,
      instance: null,
      gameStatus: null
    }
  },
  computed: {},
  watch: {
    gameStatus: {
      handler() {
        this.$emit('onGameOver', this.gameStatus.success)
      },
      deep: true,
    }
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#vue-canvas {
  display: block;
  margin: 0 auto;
  padding: 0;
  width: 500px;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
}
</style>
