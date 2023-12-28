import Game from './js/Game.js'
import { MENU_IMAGE, RESOURCE_IMAGE } from './js/const/IMAGE.js'
import './css/index.css'

const IMAGES = [RESOURCE_IMAGE, MENU_IMAGE]

document.addEventListener('DOMContentLoaded', function () {
  let progress = 0
  IMAGES.forEach(el => {
    el.onload = () => {
      progress++
      if (progress === IMAGES.length) {
        const game = new Game()
        game.run()
      }
    }
  })
})
