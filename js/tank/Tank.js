import { step } from '../action/movement.js'
import { DIRECTION } from '../const/WORLD.js'
import Spirit from '../spirit/Spirit.js'
import obstacleManager from '../utils/RigidManager.js'
import { isCollision } from '../utils/collision.js'

const { UP, DOWN, RIGHT, LEFT } = DIRECTION

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

  // todo
  get collisionSize() {
    return this.size
  }

  move() {
    for (let i = 0; i < this.speed; i = i + 0.5) {
      const [x, y] = step(this.direction, 0.5, [this.x, this.y])
      const isCollisionResult = isCollision(
        { x, y, width: this.collisionSize, height: this.collisionSize, id: this.id },
        obstacleManager.getObstacles()
      )
      if (!isCollisionResult) {
        this.x = x
        this.y = y
      }
    }
  }

  // 是否被击中
  isShotted() {}

  // 射击
  shoot() {}

  destroy() {}
}
