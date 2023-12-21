import { step } from '../action/movement.js'
import { DIRECTION } from '../const/WORLD.js'
import Spirit from '../spirit/Spirit.js'
import { isCollision, rigidbodies } from '../utils/collision.js'

const { UP, DOWN, RIGHT, LEFT } = DIRECTION

// 坦克的大小 ? 不同型号的size应该不一样

export default class Tank extends Spirit {
  constructor(context, type = 'player') {
    super(context, type)
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

    this.size = 32
    this.speed = 1
  }

  get width() {
    return this.size
  }

  get height() {
    return this.size
  }

  getSourcePosition() {
    const [x, y] = POS[this.type]
    return [x + this.direction * this.size, y, this.size, this.size]
  }

  move() {
    const [x, y] = step(this.direction, this.speed, [this.x, this.y])
    const isCollisionResult = isCollision(
      { x, y, width: this.size, height: this.size, id: this.id },
      rigidbodies
    )
    if (!isCollisionResult) {
      this.x = x
      this.y = y
    }
  }

  // 是否被击中
  isShotted() {}

  // 射击
  shoot() {}

  destroy() {}
}
