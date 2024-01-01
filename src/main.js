import Game from './js/Game.js'
import { MENU_IMAGE, RESOURCE_IMAGE } from './js/const/IMAGE.js'
import './css/index.css'
import {
  ATTACK_AUDIO,
  BULLET_DESTROY_AUDIO,
  MOVE_AUDIO,
  PLAYER_DESTROY_AUDIO,
  START_AUDIO,
  TANK_DESTROY_AUDIO,
} from './js/const/AUDIO.js'
import { SPARK_TYPE } from './js/const/WORLD.js'

const IMAGES = [RESOURCE_IMAGE, MENU_IMAGE]
const AUDIO = [
  TANK_DESTROY_AUDIO,
  BULLET_DESTROY_AUDIO,
  START_AUDIO,
  PLAYER_DESTROY_AUDIO,
  MOVE_AUDIO,
  ATTACK_AUDIO,
  RESOURCE_IMAGE,
  MENU_IMAGE,
]

document.addEventListener('DOMContentLoaded', function () {
  let progress = 0
  function loadResource() {
    progress++
    if (progress === IMAGES.length) {
      SPARK_TYPE.tankBomb.duration = TANK_DESTROY_AUDIO.duration
      SPARK_TYPE.bulletBomb.duration = BULLET_DESTROY_AUDIO.duration
      const game = new Game()
      game.run()
    }
  }
  IMAGES.forEach(el => {
    el.onload = loadResource
  })
  AUDIO.forEach(el => {
    el.addEventListener('canplay', loadResource)
  })
})
