import Game from './js/Game.js'
import { RESOURCE_IMAGE } from './js/const/IMAGE.js'
import './css/index.css'

document.addEventListener('DOMContentLoaded', function () {
  const game = new Game()
  RESOURCE_IMAGE.onload = game.run.bind(game)
})
