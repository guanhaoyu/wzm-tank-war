import { step } from '../action/movement.js'
import Bullet from '../bullet/Bullet.js'
import { TANK_DESTROY_AUDIO } from '../const/AUDIO.js'
import { RESOURCE_IMAGE } from '../const/IMAGE.js'
import { BRICK_SIZE } from '../const/SCREEN.js'
import { FPS, PLANCK_LENGTH } from '../const/WORLD.js'
import { createExplosion } from '../spark/Explosion.js'
import Spirit from '../spirit/Spirit.js'
import interactiveManager from '../utils/InteractiveManager.js'
import { isCollided } from '../utils/collision.js'
import { calculateCenter } from '../utils/geometry.js'

export default class Tank extends Spirit {
  constructor(context, type) {
    super(context, type)
    // 阵营
    this.camp = null
    // 是否自动
    this.isAI = false
    // 避免多次调用destroy方法
    this.isDestroyed = false
    this.speed = 1

    this.coolDownTime = 1.5
    this.coolDownFrames = 0
    // 是否可以射击
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
    interactiveManager.add(this)
  }

  destroy(duration = TANK_DESTROY_AUDIO.duration) {
    if (!this.isDestroyed) {
      this.isDestroyed = true
      const explosion = createExplosion(this.ctx, 'tankBomb', this.x, this.y, this.width, this.height, duration)
      this.playDestroySound()
      this.embraceExplosion(explosion)
    }
  }

  embraceExplosion() {}

  playDestroySound() {
    TANK_DESTROY_AUDIO.play()
  }

  underAttack() {}

  isShooted(bullet) {
    if (bullet && !this.bullets.has(bullet)) {
      this.bullets.add(bullet)
      this.underAttack()
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
    let voyage
    for (voyage = 0; voyage < this.speed; voyage += PLANCK_LENGTH) {
      const [x, y] = step(this.direction, PLANCK_LENGTH, [this.x, this.y])
      const result = isCollided(
        { id: this.id, type: this.type, x, y, width: this.width, height: this.height },
        interactiveManager.getAllWithoutBullet()
      )
      if (result) {
        this.collide()
        break
      } else {
        this.x = x
        this.y = y
      }
    }
    if (voyage === this.speed) {
      this.pass()
    }
  }

  directMove() {
    // 下一帧的位置
    const [x, y] = step(this.direction, this.speed, [this.x, this.y])
    const result = isCollided(
      // width和height得重新设置一下，因为声明了一个新对象，其上没有读取器
      { ...this, x, y, width: this.width, height: this.height },
      interactiveManager.getAllWithoutBullet()
    )
    if (result) {
      this.collide()
    } else {
      this.x = x
      this.y = y
      this.pass()
    }
  }

  pass() {}

  collide() {}

  // 射击
  shoot() {
    if (this.shootable) {
      this.bullet = new Bullet(this.ctx, this.camp)
      this.bullet.create(calculateCenter(this.x, this.y, this.width, this.height), this.direction, [
        this.width,
        this.height,
      ])
      this.playAttackSound()
      this.shootable = false
    }
  }

  playAttackSound() {}
}
