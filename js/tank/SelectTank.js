import Tank from './Tank.js'
import { DIRECTION } from '../const/WORLD.js'
import { POS } from '../const/IMAGE.js'

const { UP, DOWN, RIGHT, LEFT } = DIRECTION

// 菜单选择坦克
export default class SelectTank extends Tank {
  constructor(context, y1 = 250, y2 = 281) {
    super(context, 'selectTank', 140, y1, 27, y2 - y1, RIGHT)
    this.y1 = y1
    this.y2 = y2
    // 多画几帧，不然看不出来
    this.deltaYs = [0, 0, 27, 27]
    this.current = 0
  }
  get sourcePosition() {
    const [x, y] = POS[this.type]
    return [x, y + this.deltaY, this.size, this.size]
  }
  get deltaY() {
    this.current = (this.current + 1) % this.deltaYs.length
    return this.deltaYs[this.current]
  }
  move(direction) {
    super.move(direction)
    // 只改变y坐标
    this.y = Math.min(this.y, this.y2)
    this.y = Math.max(this.y, this.y1)
  }
}
