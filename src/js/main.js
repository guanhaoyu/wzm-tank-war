import { SCREEN_HEIGHT, SCREEN_WIDTH } from './const/SCREEN.js'
import Menu from './layer/Menu.js'
import { GAME_STATE_INIT, GAME_STATE_MENU } from './const/GAMESTATE.js'
import KEYBOARD from './const/KEYBOARD.js'
import Game from './Game.js'
import { RESOURCE_IMAGE } from './const/IMAGE.js'

document.addEventListener('DOMContentLoaded', function () {
  const game = new Game()
  RESOURCE_IMAGE.onload = game.run.bind(game)
})
