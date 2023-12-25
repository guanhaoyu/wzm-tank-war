import { move, step } from '../action/movement.js'
import { DIRECTION, PLANCK_DISTANCE } from '../const/WORLD.js'
import Spirit from '../spirit/Spirit.js'
import obstacleManager from '../utils/ObstacleManager.js'
import { isCollision } from '../utils/collision.js'

export default class Tank extends Spirit {
  constructor(context, type) {
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

    this.width = 26
    this.height = 26
    this.speed = 1

    this.className = 'Tank'
  }

  create() {
    this.direction = DIRECTION.UP
    obstacleManager.add(this)
  }

  move() {
    let voyage = 0
    for (let i = 0; i < this.speed; i = i + PLANCK_DISTANCE) {
      const [x, y] = step(this.direction, PLANCK_DISTANCE, [this.x, this.y])
      const isCollisionResult = isCollision(
        { x, y, width: this.width, height: this.height, id: this.id },
        obstacleManager.getObstacles().filter(obstacle => obstacle.type !== 'bullet')
      )
      if (!isCollisionResult) {
        this.x = x
        this.y = y
        voyage += PLANCK_DISTANCE
      } else {
        this.onCollision()
      }
    }
    if (voyage === this.speed) {
      this.onAccess()
    }
  }

  // move() {
  //   move.call(this, this.onAccess.bind(this), this.onCollision.bind(this))
  // }

  onAccess() {}

  onCollision() {}

  // 射击
  shoot() {}

  destroy() {
    obstacleManager.delete(this.id)
  }
}
