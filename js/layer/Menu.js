import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../const/SCREEN.js'
import { MENU_IMAGE } from '../const/IMAGE.js'
import SelectTank from '../tank/SelectTank.js'
import KEYBOARD, { keyDirectionMap } from '../const/KEYBOARD.js'
import { GAME_STATE_MENU } from '../const/GAMESTATE.js'

// 游戏开始菜单
export default class Menu {
  constructor(context) {
    this.ctx = context
    this.x = 0
    this.y = SCREEN_HEIGHT
    this.selectTank = new SelectTank(context)
    // 选择游戏人数
    this.numberOfPlayers = 1
  }

  /**
   * 
   * @param {Set<string>} keys 
   */
  subscribe(keys) {
    this.keys = keys
  }

  // 画菜单
  draw() {
    // 从下往上飞入动效
    if (this.y <= 0) {
      this.y = 0
    } else {
      this.y -= 5
    }

    this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    //画背景
    this.ctx.drawImage(MENU_IMAGE, this.x, this.y)

    if (this.y === 0) {
      this.selectTank.draw()
    }

    if (this.keys.has(KEYBOARD.DOWN)) {
      this.next(KEYBOARD.DOWN)
    }

    if (this.keys.has(KEYBOARD.UP)) {
      this.next(KEYBOARD.UP)
    }
  }

  /**
   * 选择坦克上下移动
   * @param {number} keyCode
   */
  next(keyCode) {
    if (keyCode === KEYBOARD.DOWN) {
      this.numberOfPlayers = 1
    } else {
      this.numberOfPlayers = 2
    }
    this.selectTank.move(keyDirectionMap.get(keyCode))
  }
}
