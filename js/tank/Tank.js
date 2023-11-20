import { UP } from '../const/WORLD.js'
import Spirits from '../spirit/Spirit.js'

// 坦克的大小 ? 不同型号的size应该不一样

export default class Tank extends Spirits {
  constructor(context, type = 'player', x = 0, y = 0, size = 32, speed = 1, direction = UP) {
    super(context, type, x, y, size, speed, direction)
    // 敌方坦克切换方向的时间？
    this.frame = 0

    // 是否碰到坦克或者墙
    this.hit = false
    // 是否自动
    this.isAI = false
    // 子弹是否正在运行中 ? 是否用冷却时间更好
    this.isShooting = false
    // 子弹
    this.bullet = null
    // 射击的概率
    this.probabilityOfShoot = 0.6
  }

  getSourcePosition() {
    const [x, y] = POS[this.type]
    return [x + this.direction * this.size, y, this.size, this.size]
  }

  // 是否被击中
  isShotted() {

  }

  // 射击
  shoot() {

  }

  destroy() {}
}
