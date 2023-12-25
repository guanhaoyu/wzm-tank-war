import { move, step } from '../action/movement.js'
import Bullet from '../bullet/Bullet.js'
import { RESOURCE_IMAGE } from '../const/IMAGE.js'
import { BRICK_SIZE } from '../const/SCREEN.js'
import { DIRECTION, FPS, PLANCK_DISTANCE } from '../const/WORLD.js'
import Spirit from '../spirit/Spirit.js'
import obstacleManager from '../utils/ObstacleManager.js'
import { isCollision } from '../utils/collision.js'
import { calculateCenter } from '../utils/geometry.js'

export default class Tank extends Spirit {
  constructor(context, type) {
    super(context, type)
    // 敌方坦克切换方向的时间？
    this.frame = 0
    this.camp = null
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

    this.coolDownTime = 1

    this.coolDownFrames = 0

    this.shootable = true
  }

  get coolDownFramesLimit() {
    return this.coolDownTime * FPS
  }

  create() {
    this.direction = DIRECTION.UP
    obstacleManager.add(this)
  }

  drawImage() {
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      this.posX + this.direction * BRICK_SIZE,
      this.posY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }

  coolDown() {
    if (!this.shootable) {
      this.coolDownFrames++
      if (this.coolDownFrames >= this.coolDownFramesLimit) {
        this.shootable = true
        this.coolDownFrames = 0
      }
    }
  }

  move() {
    let voyage = 0
    for (let i = 0; i < this.speed; i = i + PLANCK_DISTANCE) {
      const [x, y] = step(this.direction, PLANCK_DISTANCE, [this.x, this.y])
      const isCollisionResult = isCollision(
        { x, y, width: this.width, height: this.height, id: this.id },
        obstacleManager.getAll().filter(obstacle => obstacle.type !== 'bullet')
      )
      if (isCollisionResult) {
        this.onCollision()
        break
      } else {
        this.x = x
        this.y = y
        voyage += PLANCK_DISTANCE
      }
    }
    if (voyage === this.speed) {
      this.onAccess()
    }
  }

  onAccess() {}

  onCollision() {}

  // 射击
  shoot() {
    if (this.shootable) {
      this.bullet = new Bullet(this.ctx, this.camp)
      this.bullet.create(calculateCenter(this.x, this.y, this.width, this.height), this.direction, [
        this.width,
        this.height,
      ])
      this.shootable = false
    }
  }

  destroy() {
    obstacleManager.delete(this.id)
  }
}
