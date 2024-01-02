import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../const/SCREEN.js'
import { MENU_IMAGE } from '../const/IMAGE.js'
import SelectTank from '../tank/SelectTank.js'
import KEYBOARD from '../const/KEYBOARD.js'
import Curtain from './Curtain.js'
import { DIRECTION } from '../const/WORLD.js'


// 按键到方向的映射
export const keyDirectionMap = new Map()
keyDirectionMap.set(KEYBOARD.UP, DIRECTION.UP)
keyDirectionMap.set(KEYBOARD.W, DIRECTION.UP)
keyDirectionMap.set(KEYBOARD.DOWN, DIRECTION.DOWN)
keyDirectionMap.set(KEYBOARD.S, DIRECTION.DOWN)
keyDirectionMap.set(KEYBOARD.LEFT, DIRECTION.LEFT)
keyDirectionMap.set(KEYBOARD.A, DIRECTION.LEFT)
keyDirectionMap.set(KEYBOARD.RIGHT, DIRECTION.RIGHT)
keyDirectionMap.set(KEYBOARD.D, DIRECTION.RIGHT)

// 游戏开始菜单
export default class Menu {
  constructor(context) {
    this.ctx = context
    this.x = 0
    this.selectTank = new SelectTank(context)
    // 选择游戏人数
    this.numberOfPlayers = 1
    this.enterSpeed = 10
    this.curtain = new Curtain(context)
    this.init()
  }

  get isClearable() {
    return this.curtain.alreadyDrawHeight > 0
  }

  init() {
    this.y = SCREEN_HEIGHT
  }

  enter() {
    // 从下往上飞入动效
    if (this.y <= 0) {
      this.y = 0
    } else {
      this.y -= this.enterSpeed
    }
  }

  // 画菜单
  draw() {
    this.enter()
    this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    this.ctx.drawImage(MENU_IMAGE, this.x, this.y)
    if (this.y === 0) {
      this.selectTank.draw()
    }
  }

  /**
   * 选择坦克上下移动
   * @param {number} keyCode
   */
  next(keyCode) {
    if ([KEYBOARD.DOWN, KEYBOARD.S].includes(keyCode)) {
      this.numberOfPlayers = 2
    } else if ([KEYBOARD.UP, KEYBOARD.W].includes(keyCode)) {
      this.numberOfPlayers = 1
    }
    this.selectTank.move(keyDirectionMap.get(keyCode))
  }

  drawLevel(level, onFinished) {
    this.curtain.fold(level, onFinished)
  }

  clear() {
    this.curtain.unfold()
    this.init()
  }
}
