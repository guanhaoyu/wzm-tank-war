import { SCREEN_HEIGHT, SCREEN_WIDTH } from './const/SCREEN.js'
import { MENU_IMAGE } from './const/IMAGE.js'
import SelectTank from './tank/SelectTank.js'
import KEYBOARD, { keyDirectionMap } from './const/KEYBOARD.js'

// 游戏开始菜单
export default class Menu {
  constructor(context) {
    // super(context)
    this.ctx = context
    this.x = 0
    this.y = SCREEN_HEIGHT
    this.selectTank = new SelectTank(context)
    // 选择游戏人数
    this.numberOfPlayers = 1
    // ?
    this.times = 0
  }

  // 画菜单
  draw() {
    this.times ++ ;
		var temp = 0;
		if( parseInt(this.times / 6) % 2 == 0){
			temp = 0;
		}else{
			temp = this.selectTank.size;
		}

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
