import { step } from '../action/movement.js'
import Bullet from '../bullet/Bullet.js'
import { RESOURCE_IMAGE } from '../const/IMAGE.js'
import { BRICK_SIZE } from '../const/SCREEN.js'
import { FPS, PLANCK_DISTANCE } from '../const/WORLD.js'
import { createExplosion } from '../other/Explosion.js'
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
    this.isDestroyed = false
    this.speed = 1

    this.coolDownTime = 1
    this.coolDownFrames = 0
    this.shootable = true
    // 击中坦克的子弹
    this.bullets = new Set()
  }

  get coolDownFramesLimit() {
    return this.coolDownTime * FPS
  }

  get width() {
    return 26
  }

  get height() {
    return 26
  }

  create() {
    obstacleManager.add(this)
  }

  destroy() {
    if (!this.isDestroyed) {
      this.isDestroyed = true
      obstacleManager.delete(this.id)
      createExplosion('tankBomb', this.ctx, this.x, this.y, this.width, this.height)
    }
  }

  isShooted(bullet) {
    if (bullet && !this.bullets.has(bullet)) {
      this.bullets.add(bullet)
      if (this.isAppear || !this.isAI) {
        this.lives--
        if (this.lives === 0) {
          this.destroy()
        }
      }
    }
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
        { ...this, x, y, width: this.width, height: this.height },
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

  move1() {
    // 下一帧的位置
    const [x, y] = step(this.direction, this.speed, [this.x, this.y])
    const isCollisionResult = isCollision(
      // width和height得重新设置一下，因为声明了一个新对象，其上没有读取器
      { ...this, x, y, width: this.width, height: this.height },
      obstacleManager.getAll().filter(obstacle => obstacle.type !== 'bullet')
    )
    if (isCollisionResult) {
      this.onCollision()
    } else {
      this.x = x
      this.y = y
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
}
