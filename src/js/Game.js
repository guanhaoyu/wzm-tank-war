import {
  GAME_STATE_MENU,
  GAME_STATE_INIT,
  GAME_STATE_START,
  GAME_STATE_OVER,
  GAME_STATE_WIN,
} from './const/GAMESTATE.js'
import KEYBOARD from './const/KEYBOARD.js'
import { BRICK_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH } from './const/SCREEN.js'
import { BATTLE_FIELD, ENEMY_LOCATION, FPS } from './const/WORLD.js'
import Menu from './layer/Menu.js'
import BattleField from './BattleField.js'
import Scoreboard from './Scoreboard.js'
import PlayerTank from './tank/PlayerTank.js'
import { Enemy1, Enemy2, Enemy3 } from './tank/EnemyTank.js'
import { isCollision } from './utils/collision.js'
import obstacleManager from './utils/ObstacleManager.js'
import { sparkManager } from './spark/Spark.js'

const gameStateToKeyboardEventMap = {
  [GAME_STATE_MENU](code) {
    if (code == KEYBOARD.ENTER) {
      this.gameState = GAME_STATE_INIT
      // fixme 只有一个玩家
      if (this.menu.numberOfPlayers == 1) {
      }
    } else {
      this.menu.next(code)
    }
  },
  [GAME_STATE_START](code) {
    if (code == KEYBOARD.P) {
      this.pause()
    }
  }
}

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

// 2s产生一个敌坦克
const ADD_ENEMY_INTERVAL = 2 * FPS

// 每一关的敌方坦克总数
const TOTAL_ENEMY = 20

/**
 * 调度
 * 键入监听
 */
export default class Game {
  constructor() {
    this.level = 1
    this.isPause = false
    this.gameState = GAME_STATE_MENU
    // this.gameState = GAME_STATE_INIT
    // this.gameState = GAME_STATE_START

    this.restEnemy = TOTAL_ENEMY // 剩余敌方坦克数量
    this.appearEnemy = 0 // 正在显示的敌方坦克数量
    this.maxAppearEnemy = 5 // 屏幕上最多显示几个敌方坦克

    this.addEnemyFrames = 0 // 用于添加敌方坦克的计时

    this.enemyTankStack = []
    this.codes = new Set()
    this.prepare()
    this.handleKeyboardEvent()
    this.prepareEnemyTanks()
  }

  get enemyArr() {
    return obstacleManager.getTanks('enemy')
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
    this.tankCtx = tankCanvas.getContext('2d')
    const overCtx = overCanvas.getContext('2d')
    this.menu = new Menu(stageCtx)
    this.battleField = new BattleField(wallCtx, grassCtx)
    this.scoreboard = new Scoreboard(wallCtx)
    this.player1 = new PlayerTank(this.tankCtx)
    this.player1.create()
  }

  prepareEnemyTanks() {
    Array.from({ length: TOTAL_ENEMY }, () => {
      const EnemyClass = this.getEnemyClass()
      this.enemyTankStack.push(new EnemyClass(this.tankCtx))
    })
  }

  handleKeydownOnMenu(code) {
    if (code == KEYBOARD.ENTER) {
      this.gameState = GAME_STATE_INIT
      // fixme 只有一个玩家
      if (this.menu.numberOfPlayers == 1) {
      }
    } else {
      this.menu.next(code)
    }
  }

  handleKeyboardEvent() {
    document.addEventListener('keydown', ({ code }) => {
      this.codes.add(code)
      gameStateToKeyboardEventMap[this.gameState]?.call(this, code)
    })
    document.addEventListener('keyup', ({ code }) => {
      this.codes.delete(code)
    })
  }

  drawAll() {
    this.tankCtx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    obstacleManager.drawSpirits(Array.from(this.codes))
    sparkManager.draw()
  }

  run() {
    if (!this.isPause) {
      switch (this.gameState) {
        case GAME_STATE_MENU:
          this.menu.draw()
          break
        case GAME_STATE_INIT:
          this.menu.drawLevel(this.level, () => {
            this.battleField.setLevel(this.level)
            this.battleField.draw()
            this.scoreboard.init(this.level, this.restEnemy)
            this.gameState = GAME_STATE_START
          })
          break
        case GAME_STATE_START:
          if (this.menu.isClearable) {
            this.menu.clear()
          } else {
            this.battleField.draw()
            this.addEnemyTank()
            this.drawAll()
          }
          break
      }
    }
    requestAnimationFrame(this.run.bind(this))
  }

  getEnemyClass() {
    // 目前有3个敌坦克类
    const random = Math.ceil(Math.random() * 3)
    let EnemyClass = null
    if (random === 1) {
      EnemyClass = Enemy1
    } else if (random === 2) {
      EnemyClass = Enemy2
    } else {
      EnemyClass = Enemy3
    }
    return EnemyClass
  }

  addEnemyTank() {
    const enemyArrLen = this.enemyArr.length
    if (enemyArrLen > this.maxAppearEnemy || this.restEnemy === 0) {
      return
    }
    if (this.addEnemyFrames % ADD_ENEMY_INTERVAL === 0) {
      const enemyLocationLen = ENEMY_LOCATION.length
      const willAppearEnemy = Math.min(
        Math.ceil(Math.random() * enemyLocationLen),
        this.restEnemy,
        this.maxAppearEnemy - enemyArrLen
      )
      let willNotAppearEnemy = 0
      for (let i = 0; i < willAppearEnemy; i++) {
        const willAppearEnemyLocationX =
          ENEMY_LOCATION[Math.floor(Math.random() * enemyLocationLen)] + BRICK_SIZE
        const isCollisionResult = isCollision(
          {
            x: willAppearEnemyLocationX,
            y: BATTLE_FIELD.OFFSET_Y,
            width: BRICK_SIZE,
            height: BRICK_SIZE,
          },
          obstacleManager.getTanks()
        )
        if (isCollisionResult) {
          willNotAppearEnemy++
        } else {
          const enemy = this.enemyTankStack.pop()
          enemy.create(
            willAppearEnemyLocationX + (BRICK_SIZE - enemy.width) / 2,
            BATTLE_FIELD.OFFSET_Y
          )
        }
      }
      this.appearEnemy = this.appearEnemy + willAppearEnemy - willNotAppearEnemy
      this.restEnemy = TOTAL_ENEMY - this.appearEnemy

      //更新地图右侧坦克数
      this.scoreboard.drawEnemyCount(this.restEnemy, this.appearEnemy)
      this.addEnemyFrames = 0
    }
    this.addEnemyFrames++
  }

  pause() {
    this.isPause = !this.isPause
  }
}
