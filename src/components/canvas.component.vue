<template>
  <div>
    <button id="startGame" v-show="gameStatus ? !gameStatus.started : true">Начать</button>
    <div id="vue-canvas"></div>
    <p id="security-error" class="absolute-center">ВНИМАНИЕ! БЕЗОПАСНОСТЬ НАРУШЕНА</p>
    <p id="second-scene-text" class="absolute-center">ОБНАРУЖЕН ВЗЛОМ</p>
  </div>
</template>

<script>
import {mushroomImg, sshImg, kursliteImg, vmwareImg} from "@/assets/images";
import {stillMusicAsset} from "@/assets/sounds";
import 'p5/lib/addons/p5.sound';
import {alarmAsset, evilLaughtSoundAsset, worriedMusicAsset} from "../assets/sounds";
import {gsap} from "gsap";
import {backTimer} from "../timer";
let gameStatus = {
  started: false,
  over: false,
  success: null,
  scene: 0
}
let refresh = {
  ok: false
}

const script = (p5) => {
  class turrent {
    constructor() {
    }

    display() {
      p5.push()
      p5.stroke(230, 255, 0);
      p5.fill(230, 255, 0);
      p5.ellipse(turPosX, turPosY, 30);
      p5.pop();
    }

    move() {
      if ((p5.keyIsDown(65) || p5.keyIsDown(p5.LEFT_ARROW)) && turPosX > 5) {
        turPosX -= 10;
      }
      if ((p5.keyIsDown(68) || p5.keyIsDown(p5.RIGHT_ARROW)) && turPosX < w - 5) {
        turPosX += 10;
      }
      if ((p5.keyIsDown(87) || p5.keyIsDown(p5.UP_ARROW)) && turPosY > 5) {
        turPosY -= 10;
      }
      if ((p5.keyIsDown(83) || p5.keyIsDown(p5.DOWN_ARROW)) && turPosY < h - 5) {
        turPosY += 10;
      }
    }

    hitScan() {
      for (let i = 0; i < targetBalloons.length; i++) {
        let collideOrNot = checkObjectsCollision(turPosX, turPosY, 30, 30, targetBalloons[i].myX(), targetBalloons[i].myY(), targetBalloons[i].myR(), targetBalloons[i].myR())
        if (collideOrNot) {
          return true;
        }
      }
      return false;
    }
  }

  class balloon {
    constructor() {
      this.side = p5.int(p5.random(4));
      switch (this.side) {
        case 0:
          this.x = 0;
          this.y = p5.int(p5.random(h));
          break;
        case 1:
          this.x = p5.int(p5.random(w));
          this.y = 0;
          break;
        case 2:
          this.x = w;
          this.y = p5.int(p5.random(h));
          break;
        case 3:
          this.x = p5.int(p5.random(w));
          this.y = h;
          break;
      }
      this.targetX = turPosX;
      this.targetY = turPosY;
      this.targetDir = p5.createVector(this.targetX - this.x, this.targetY - this.y);
      this.targetDir.normalize();
      this.xSpd = this.targetDir.x * balloonSpawnMultiplier;
      this.ySpd = this.targetDir.y * balloonSpawnMultiplier;
      this.r = 12 * balloonSizeMultiplier;

    }

    display() {
      p5.push();
      p5.noStroke();
      p5.fill(255, 0, 0);
      p5.ellipse(this.x, this.y, this.r);
      p5.pop();
    }

    update() {

      this.x += this.xSpd;
      this.y += this.ySpd;
    }

    outOfBounds() {
      return (this.x > w + 10 || this.x < -10 || this.y > w + 10 || this.y < -10);
    }

    myX() {
      return this.x;
    }

    myY() {
      return this.y;
    }

    myR() {
      return this.r;
    }


  }

  let numSegments = 10;
  let stage = 0;
  let isSecondStageSet = false
  let drawText
  const showTextStageOne = 'Очки'
  const showTextStageTwo = 'УРОВЕНЬ БЕЗОПАСНОСТИ'
  const showTextSceneTwo = 'ОСТАЛОСЬ'
  let maxStages = 5
  let targetTime = 144000000
  let timerId
  let direction = 'right';

  const xStart = 0; //starting x coordinate for snake
  const yStart = 250; //starting y coordinate for snake
  const diff = 10;

  let xCor = [];
  let yCor = [];

  let xFruit = 100;
  let yFruit = 50;

  const w = 500
  const h = 500
  const wFruit = 30
  const hFruit = 30

  let mushroomImage
  let sshImage
  let kursliteImage
  let vmwareImage

  let stillSound
  let alarmSound
  let worriedSound
  let evilLaughtSound


  let targetBalloons = [];
  let turPosX = 300;
  let turPosY = 300;
  let targetTimer = 0;
  let balloonSpawnMultiplier = 10;
  let balloonSizeMultiplier = 2;

  let mainTurrent = new turrent(300, 300)


  document.getElementById('startGame').addEventListener('click', startGame)

  function startGame() {
    gameStatus.started = true
    playMusic(stillSound)
  }

  p5.setup = () => {
    drawText = showTextStageOne
    p5.angleMode(p5.DEGREES);

    const canvas = p5.createCanvas(w, h);
    canvas.parent('vue-canvas')
    p5.frameRate(15);
    p5.stroke(255);
    p5.strokeWeight(10);
    p5.textSize(18)


    initImages()
    initMusic()
    updateFruitCoordinates();

    p5.image(getFruitImage(stage), xFruit, yFruit, wFruit, hFruit);
    for (let i = 0; i < numSegments; i++) {
      xCor.push(xStart + i * diff);
      yCor.push(yStart);
    }


  }


  p5.draw = () => {
    p5.background(0);
    if (gameStatus.started && gameStatus.scene === 0) {
      for (let i = 0; i < numSegments - 1; i++) {
        p5.line(xCor[i], yCor[i], xCor[i + 1], yCor[i + 1]);
      }
      updateSnakeCoordinates();
      checkGameStatus();
      checkForFruit();
      redrawFruit(stage)
      const {hours, minutes, seconds} = backTimer(targetTime)
      p5.text(`${drawText} : ${stage}`, 10, 30)
      p5.fill(50)

    } else if (gameStatus.started && gameStatus.scene === 1) {

      const {hours, minutes, seconds} = backTimer(targetTime)
      p5.text(`Осталось ${hours} часов ${minutes} минут ${seconds} секунд`, 10, 30)
      p5.fill(50)
      //----------------------------------------BALLOONS-SPAWN--------------------------------------
      targetTimer += 1;
      let spawnInterval = p5.int(100 / balloonSpawnMultiplier);
      //print(spawnInterval)
      if (targetTimer % spawnInterval == 0) {
        let newBalloon = new balloon();
        targetBalloons.push(newBalloon);
      }

      //-------------------------------------------EVIL-BALLOONS----------------------------------------
      for (let i = 0; i < targetBalloons.length; i++) {
        targetBalloons[i].display();
        targetBalloons[i].update();
        if (targetBalloons[i].outOfBounds()) {
          targetBalloons.splice(i, 1);
        }
      }

      balloonSpawnMultiplier += 0.001;
      if (balloonSizeMultiplier < 5) {
        balloonSizeMultiplier += 0.001;
      }

      //------------------------------------------HERO-AND-HERO-DED---------------------------------------a
      mainTurrent.display();
      mainTurrent.move();
      if (mainTurrent.hitScan()) {
        refresh.ok = true
      }
    }
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

  function playMusic(music) {
    music.play()
  }

  function stopMusic(music) {
    music.stop()
  }

  /*
   I always check the snake's head position xCor[xCor.length - 1] and
   yCor[yCor.length - 1] to see if it touches the game's boundaries
   or if the snake hits itself.
  */
  function checkGameStatus() {
    if (stage === 3 && !isSecondStageSet) {
      setSecondStage()
    }
    if (
        xCor[xCor.length - 1] > p5.width ||
        xCor[xCor.length - 1] < 0 ||
        yCor[yCor.length - 1] > p5.height ||
        yCor[yCor.length - 1] < 0 ||
        checkSnakeCollision()
    ) {
      p5.noLoop();
      refresh.ok = true
    } else if (stage > maxStages) {
      setSecondScene()
    }

  }

  async function setSecondStage() {
    isSecondStageSet = true
    p5.noLoop()
    stopMusic(stillSound)
    playMusic(alarmSound)
    await gsap.fromTo('#security-error', {opacity: 1}, {opacity: 0, duration: 1, repeat: 3})
    stopMusic(alarmSound)
    playMusic(worriedSound)
    drawText = showTextStageTwo
    p5.loop()
  }

  async function setSecondScene() {
    gameStatus.scene = 1
    p5.noLoop()
    stopMusic(stillSound)
    stopMusic(worriedSound)
    playMusic(evilLaughtSound)
    await gsap.fromTo('body', {opacity: 0}, {opacity: 1, duration: .5, repeat: 3})
    await gsap.fromTo('#second-scene-text', {opacity: 0}, {
      opacity: 1, duration: 1, repeat: 3, onComplete: () => {
      gsap.to('#second-scene-text', {opacity: 0})
      }
    })
    stopMusic(evilLaughtSound)
    playMusic(worriedSound)
    drawText = showTextSceneTwo
    p5.loop()
    timerId = setInterval( () => targetTime -= 1000, 1000);

  }

  function checkSnakeCollision() {
    const snakeHeadX = xCor[xCor.length - 1];
    const snakeHeadY = yCor[yCor.length - 1];
    for (let i = 0; i < xCor.length - 1; i++) {
      if (xCor[i] === snakeHeadX && yCor[i] === snakeHeadY) {
        return true;
      }
    }
  }

  function checkObjectsCollision(obj1X, obj1Y, obj1W, obj1H, obj2X, obj2Y, obj2W, obj2H) {

    let XColl = false;
    let YColl = false
    if ((obj1X + obj1W >= obj2X) && (obj1X <= obj2X + obj2W)) XColl = true;
    if ((obj1Y + obj1H >= obj2Y) && (obj1Y <= obj2Y + obj2H)) YColl = true;

    if (XColl && YColl) {
      return true;
    }
    return false
  }


  function checkForFruit() {
    const xSnake = xCor[xCor.length - 1]
    const ySnake = yCor[yCor.length - 1]
    // p5.point(xFruit, yFruit);
    if (checkObjectsCollision(xSnake, ySnake, 1, 1, xFruit, yFruit, wFruit, hFruit)) {
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
      case 1:
      case 2:
        return mushroomImage
      case 3:
        return sshImage
      case 4:
        return kursliteImage
      case 5:
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
    mushroomImage = p5.loadImage(mushroomImg)
    sshImage = p5.loadImage(sshImg)
    kursliteImage = p5.loadImage(kursliteImg)
    vmwareImage = p5.loadImage(vmwareImg)
  }

  function initMusic() {
    stillSound = p5.loadSound(stillMusicAsset)
    alarmSound = p5.loadSound(alarmAsset)
    worriedSound = p5.loadSound(worriedMusicAsset)
    evilLaughtSound = p5.loadSound(evilLaughtSoundAsset)
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
export default {
  name: "VueCanvas",
  mounted() {
    const P5 = require("p5");
    new P5(script);
    this.gameStatus = gameStatus
    this.refresh = refresh
  },
  data() {
    return {
      stage: 0,
      instance: null,
      gameStatus: null,
      refresh: refresh,
    }
  },
  computed: {},

  watch: {
    refresh: {
      handler() {
        this.$emit('onGameOver')
      },
      deep: true,
    }
  }

};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#startGame{
  background: #2196f3;
  color: #fff;
  padding: 12px;
  border-radius: 3px;
  border: 0px;
  margin-bottom: 20px;
}
#vue-canvas {
  display: block;
  margin: 0 auto;
  padding: 0;
  width: 500px;
  height: 500px;
  border-radius: 20px;
  overflow: hidden;
}
.absolute-center{
  position: absolute;
  top: 34%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#security-error {
  font-size: 18px;
  opacity: 0;
  z-index: 99999;
  color: red;
  font-weight: 700;
}
#second-scene-text{
  font-size: 18px;
  opacity: 0;
  z-index: 99999;
  color: red;
  font-weight: 700;
}
</style>
