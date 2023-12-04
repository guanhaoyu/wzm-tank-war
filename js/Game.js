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
  constructor() {
    this.level = 1
    this.isPause = false
    // gameState = GAME_STATE_MENU
    this.gameState = GAME_STATE_INIT
    this.prepare()
    this.handleKeyboardEvent()

    this.enemyArr = []
    this.restEnemy = 20 // 剩余敌方坦克数量
    this.appearEnemy = 0 // 正在显示的敌方坦克数量
    this.maxAppearEnemy = 5 // 屏幕上最多显示几个敌方坦克

    this.mainframe = 0 // 用于计时
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
            this.scoreboard.init(this.level, this.restEnemy)
            this.player1.draw()
            this.gameState = GAME_STATE_START
          })
          break
        case GAME_STATE_START:
          this.curtain.unfold()
          if (this.appearEnemy < this.restEnemy) {
            if (this.mainframe % 100 == 0) {
              this.addEnemyTank()
              this.mainframe = 0
            }
            this.mainframe++
          }
          // drawEnemyTanks();
          break
      }
    }
    requestAnimationFrame(this.run.bind(this))
  }

  addEnemyTank() {
    if (this.enemyArr.length > this.maxAppearEnemy || this.restEnemy === 0) {
      return
    }
    this.appearEnemy++
    const willAppearEnemy = parseInt(Math.random() * 3)
    console.log(`增加${willAppearEnemy + 1}个敌方坦克`)
    // var obj = null
    // if (willAppearEnemy == 0) {
    //   obj = new EnemyOne(tankCtx)
    // } else if (willAppearEnemy == 1) {
    //   obj = new EnemyTwo(tankCtx)
    // } else if (willAppearEnemy == 2) {
    //   obj = new EnemyThree(tankCtx)
    // }
    // obj.x = ENEMY_LOCATION[parseInt(Math.random() * 3)] + map.offsetX
    // obj.y = map.offsetY
    // obj.dir = DOWN
    this.enemyArr.push(...new Array(willAppearEnemy).fill(null))
    this.appearEnemy += willAppearEnemy
    this.restEnemy = this.restEnemy - willAppearEnemy
    //更新地图右侧坦克数
    this.scoreboard.drawEnemyCount(this.restEnemy, this.appearEnemy)
  }

  pause() {
    this.isPause = true
  }

  resume() {
    this.isPause = false
  }
}
