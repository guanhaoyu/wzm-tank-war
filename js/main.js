import { SCREEN_HEIGHT, SCREEN_WIDTH } from './const/SCREEN.js'
import Menu from './layer/Menu.js'
import { GAME_STATE_INIT, GAME_STATE_MENU } from './const/GAMESTATE.js'
import KEYBOARD from './const/KEYBOARD.js'
import Game from './Game.js'

document.addEventListener('DOMContentLoaded', function () {
  const game = new Game()
  game.run()
})