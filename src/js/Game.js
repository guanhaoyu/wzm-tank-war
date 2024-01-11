import {
  GAME_STATE_MENU,
  GAME_STATE_INIT,
  GAME_STATE_START,
  GAME_STATE_OVER,
  GAME_STATE_WIN,
} from './const/GAMESTATE.js'
import KEYBOARD from './const/KEYBOARD.js'
import { BRICK_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH } from './const/SCREEN.js'
import { FPS, TILE_TYPE } from './const/WORLD.js'
import Menu from './layer/Menu.js'
import BattleField, { BATTLE_FIELD, updateCurrentMap } from './BattleField.js'
import Scoreboard from './Scoreboard.js'
import { Player1, Player2 } from './tank/PlayerTank.js'
import { ENEMY_LOCATION, Enemy1, Enemy2, Enemy3 } from './tank/EnemyTank.js'
import { isCollided } from './utils/collision.js'
import interactiveManager from './utils/InteractiveManager.js'
import { sparkManager } from './spark/Spark.js'
import { rewardManager } from './spark/Reward.js'
import levels from './const/LEVEL.js'
import GameOver from './layer/GameOver.js'
import Base from './tank/Base.js'
import { MOVE_AUDIO, PLAYER_DESTROY_AUDIO, START_AUDIO } from './const/AUDIO.js'

const TOTAL_LEVEL = levels.length

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

    this.restEnemy = TOTAL_ENEMY // 剩余敌方坦克数量
    this.appearedEnemy = 0 // 已上过战场的敌方坦克数量
    this.maxExistEnemy = 5 // 屏幕上最多显示几个敌方坦克

    this.addEnemyInterval = 2 // 2s产生一个敌坦克
    this.addEnemyFrames = -1 // 用于添加敌方坦克的计时

    this.enemyStack = []
    this.codes = new Set()
    this.prepare()
    this.handleKeyboardEvent()

    this.isWinAlerted = false
  }

  get addEnemyFramesLimit() {
    return this.addEnemyInterval * FPS
  }

  get enemyArr() {
    return interactiveManager.getTanks('enemy')
  }

  get hasPlayer2 () {
    return this.menu.numberOfPlayers > 1
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
    this.grassCtx = grassCanvas.getContext('2d')
    const overCtx = overCanvas.getContext('2d')
    this.tankCtx = tankCanvas.getContext('2d')
    this.menu = new Menu(stageCtx)
    this.battleField = new BattleField(wallCtx, this.grassCtx)
    this.scoreboard = new Scoreboard(wallCtx)
    this.player1 = new Player1(this.tankCtx)
    this.player2 = new Player2(this.tankCtx)
    this.base = new Base(this.tankCtx, this.loseHome.bind(this))
    this.gameOver = new GameOver(overCtx)

    this.gameStateToKeyboardEventMap = {
      [GAME_STATE_MENU]: code => {
        if (code == KEYBOARD.ENTER || code == KEYBOARD.SPACE) {
          this.gameState = GAME_STATE_INIT
          START_AUDIO.play()
        } else {
          this.menu.next(code)
        }
      },
      [GAME_STATE_START]: code => {
        if (code == KEYBOARD.P) {
          this.pause()
        } else if (code == KEYBOARD.T) {
          // trick 按T定住敌人
          interactiveManager.stopEnemy(60)
        } else if (code == KEYBOARD.BACKSPACE) {
          // trick 按退格全灭敌人
          interactiveManager.destroyAppearedEnemy()
        } else if (code == KEYBOARD.B) {
          // trick 按B无敌
          this.player1.isProtected = true
          this.player1.protectedFrames = 0
          this.player2.isProtected = true
          this.player2.protectedFrames = 0
        } else if (code === KEYBOARD.EQUAL) {
          this.nextLevel()
        } else if (code === KEYBOARD.MINUS) {
          this.previousLevel()
        } else if (code === KEYBOARD.H) {
          // trick 按H保护基地
          rewardManager.consume('protectHome')
        }
      },
      [GAME_STATE_OVER]: () => {
        if (this.gameOver.isOver) {
          this.gameState = GAME_STATE_MENU
        }
      },
      [GAME_STATE_WIN]: () => {
        this.gameState = GAME_STATE_MENU
      },
    }
  }

  prepareEnemyTanks() {
    this.enemyStack = []
    Array.from({ length: TOTAL_ENEMY }, () => {
      const EnemyClass = this.getEnemyClass()
      this.enemyStack.push(new EnemyClass(this.tankCtx))
    })
  }

  handleKeyboardEvent() {
    document.addEventListener('keydown', ({ code }) => {
      this.codes.add(code)
      this.gameStateToKeyboardEventMap[this.gameState]?.(code)
    })
    document.addEventListener('keyup', ({ code }) => {
      this.codes.delete(code)
    })
  }

  loseHome() {
    this.fail()
    MOVE_AUDIO.pause()
    PLAYER_DESTROY_AUDIO.play()
    updateCurrentMap([24, 12], TILE_TYPE.FLAG)
  }

  fail() {
    this.player1.destroy()
    this.player1.lives = 0
    if (this.hasPlayer2) {
      this.player2.destroy()
      this.player2.lives = 0
    }
    this.gameState = GAME_STATE_OVER
  }

  nextLevel() {
    if (this.level < TOTAL_LEVEL) {
      this.level++
      this.gameState = GAME_STATE_INIT
    } else {
      this.gameState = GAME_STATE_WIN
    }
  }

  previousLevel() {
    if (this.level > 1) {
      this.level--
      this.gameState = GAME_STATE_INIT
    } else {
      this.fail()
    }
  }

  drawLives() {
    this.scoreboard.drawLives(this.player1.lives, 1)
    this.scoreboard.drawLives(this.player2.lives, 2)
  }

  drawLevel() {
    this.battleField.setLevel(this.level)
    this.scoreboard.init(this.level)
  }

  drawAll(isAdded) {
    // 调用顺序不能变，因为涉及清空画布的操作
    this.battleField.draw()
    if (isAdded) {
      this.scoreboard.drawEnemyCount(this.restEnemy, this.appearedEnemy)
    }
    this.drawLives()
    this.tankCtx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    interactiveManager.drawSpirits(Array.from(this.codes))
    sparkManager.draw()
  }

  runBetweenInitAndStart() {
    this.gameState = GAME_STATE_START
    this.addEnemyFrames = -1
    this.prepareEnemyTanks()
    rewardManager.addRewardFrames = 0
    interactiveManager.clear()
    sparkManager.clear()
    this.player1.create()
    if (this.hasPlayer2) {
      this.player2.create()
    }
    this.base.create()
    this.restEnemy = TOTAL_ENEMY
    this.appearedEnemy = 0
    this.drawLevel()
    this.drawAll(true)
  }

  runAfterStart() {
    if (this.gameState === GAME_STATE_WIN && !this.isWinAlerted) {
      this.isWinAlerted = true
      alert('💐恭喜您赢得了胜利✌🏻')
    }

    if (this.gameState !== GAME_STATE_OVER) {
      if (this.hasPlayer2 && this.player1.lives === 0 && this.player2.lives === 0) {
        this.fail()
      } else {
        if (this.player1.lives === 0) {
          this.fail()
        }
      }
    }

    const enemyArrLen = this.enemyArr.length
    if (this.restEnemy === 0 && enemyArrLen === 0) {
      this.nextLevel()
    } else {
      const isAdded = this.addEnemyTank()
      rewardManager.addReward(this.grassCtx)
      this.drawAll(isAdded)
    }
  }

  run() {
    if (!this.isPause) {
      switch (this.gameState) {
        case GAME_STATE_MENU:
          this.isWinAlerted = false
          this.gameOver.init()
          this.menu.draw()
          break
        case GAME_STATE_INIT:
          this.menu.drawLevel(this.level, this.runBetweenInitAndStart.bind(this))
          break
        case GAME_STATE_START:
          if (this.menu.isClearable) {
            this.menu.clear()
          } else {
            this.runAfterStart()
          }
          break
        case GAME_STATE_OVER:
          this.gameOver.draw()
          this.runAfterStart()
          break
        default:
          this.runAfterStart()
      }
    }
    // 不同显示器的帧率不一样，不一定都是60
    // requestAnimationFrame(this.run.bind(this))
    setTimeout(this.run.bind(this), 1000 / FPS)
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
    if (enemyArrLen > this.maxExistEnemy || this.restEnemy === 0) {
      return false
    }
    this.addEnemyFrames++
    if (this.addEnemyFrames % this.addEnemyFramesLimit === 0) {
      this.addEnemyFrames = 0
      const enemyLocationLen = ENEMY_LOCATION.length
      const willAppearEnemy = Math.min(
        Math.ceil(Math.random() * enemyLocationLen),
        this.restEnemy,
        this.maxExistEnemy - enemyArrLen
      )
      let willNotAppearEnemy = 0
      for (let i = 0; i < willAppearEnemy; i++) {
        const willAppearEnemyLocationX =
          ENEMY_LOCATION[Math.floor(Math.random() * enemyLocationLen)] + BRICK_SIZE
        const willAppearEnemyLocationY = BATTLE_FIELD.OFFSET_Y
        const result = isCollided(
          {
            x: willAppearEnemyLocationX,
            y: willAppearEnemyLocationY,
            width: BRICK_SIZE,
            height: BRICK_SIZE,
          },
          interactiveManager.getAllWithoutBullet()
        )
        if (result) {
          willNotAppearEnemy++
        } else {
          const enemy = this.enemyStack.pop()
          enemy.create(
            willAppearEnemyLocationX + (BRICK_SIZE - enemy.width) / 2,
            willAppearEnemyLocationY
          )
        }
      }
      let prevAppearEnemy = this.appearedEnemy
      this.appearedEnemy = this.appearedEnemy + willAppearEnemy - willNotAppearEnemy
      this.restEnemy = TOTAL_ENEMY - this.appearedEnemy
      return prevAppearEnemy < this.appearedEnemy
    }
    return false
  }

  pause() {
    this.isPause = !this.isPause
  }
}
