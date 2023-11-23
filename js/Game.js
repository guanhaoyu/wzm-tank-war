import Curtain from './layer/Curtain.js'
import {
  GAME_STATE_MENU,
  GAME_STATE_INIT,
  GAME_STATE_START,
  GAME_STATE_OVER,
  GAME_STATE_WIN,
} from './const/GAMESTATE.js'
import KEYBOARD from './const/KEYBOARD.js'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './const/SCREEN.js'
import { DIRECTION } from './const/WORLD.js'
import Menu from './layer/Menu.js'
import BattleField from './BattleField.js'
import Scoreboard from './Scoreboard.js'
import PlayerTank from './tank/PlayerTank.js'

/**
 * 设置元素宽高尺寸
 * @param {Element[]} elements
 * @param {{ width: number; height: number }}
 */
function setCanvasSize(elements, { width, height }) {
  elements.forEach(element => {
    element.width = width
    element.height = height
  })
}

/**
 * 调度
 * 键入监听
 */
export default class Game {
  gameState = GAME_STATE_INIT
  // gameState = GAME_STATE_MENU

  isPause = false

  level = 1

  constructor() {
    this.prepare()
    this.handleKeyboardEvent()
  }

  prepare() {
    const container = document.querySelector('.container')
    container.style.width = `${SCREEN_WIDTH}px`
    container.style.height = `${SCREEN_HEIGHT}px`

    const stageCanvas = document.querySelector('#stageCanvas')
    const wallCanvas = document.querySelector('#wallCanvas')
    const grassCanvas = document.querySelector('#grassCanvas')
    const tankCanvas = document.querySelector('#tankCanvas')
    const overCanvas = document.querySelector('#overCanvas')
    setCanvasSize([stageCanvas, wallCanvas, grassCanvas, tankCanvas, overCanvas], {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    })
    const stageCtx = stageCanvas.getContext('2d')
    const wallCtx = wallCanvas.getContext('2d')
    const grassCtx = grassCanvas.getContext('2d')
    const tankCtx = tankCanvas.getContext('2d')
    const overCtx = overCanvas.getContext('2d')
    this.menu = new Menu(stageCtx)
    this.curtain = new Curtain(stageCtx)
    this.battleField = new BattleField(wallCtx, grassCtx)
    this.scoreboard = new Scoreboard(wallCtx)
    this.player1 = new PlayerTank(tankCtx)
  }

  handleKeydownOnMenu(code) {
    if (code == KEYBOARD.ENTER) {
      this.gameState = GAME_STATE_INIT
      //只有一个玩家
      if (this.menu.numberOfPlayers == 1) {
      }
    } else {
      this.menu.next(code)
    }
  }

  handleKeyboardEvent() {
    const codes = new Set()
    document.addEventListener('keydown', ({ code }) => {
      codes.add(code)
      switch (this.gameState) {
        case GAME_STATE_MENU:
          this.handleKeydownOnMenu(code)
          break
      }
    })
    document.addEventListener('keyup', ({ code }) => {
      codes.delete(code)
    })
  }

  run() {
    if (!this.isPause) {
      switch (this.gameState) {
        case GAME_STATE_MENU:
          this.menu.draw()
          break
        case GAME_STATE_INIT:
          this.curtain.fold(this.level, () => {
            this.battleField.draw(this.level)
            this.scoreboard.init(this.level)
            this.gameState = GAME_STATE_START
          })
          break
        case GAME_STATE_START:
          this.curtain.unfold()
          this.player1.draw()
          break
      }
    }
    requestAnimationFrame(this.run.bind(this))
  }

  pause() {
    this.isPause = true
  }

  resume() {
    this.isPause = false
  }
}
