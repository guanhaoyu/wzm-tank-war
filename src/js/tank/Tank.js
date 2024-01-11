import { step } from '../action/movement.js'
import Bullet from '../bullet/Bullet.js'
import { TANK_DESTROY_AUDIO } from '../const/AUDIO.js'
import { RESOURCE_IMAGE } from '../const/IMAGE.js'
import { BRICK_SIZE } from '../const/SCREEN.js'
import { ALLOW_COLLISION_LENGTH, DIRECTION, FPS, PLANCK_LENGTH } from '../const/WORLD.js'
import { createExplosion } from '../spark/Explosion.js'
import Spirit from '../spirit/Spirit.js'
import interactiveManager from '../utils/InteractiveManager.js'
import { checkCollision, isCollided, overlap } from '../utils/collision.js'
import { add } from '../utils/decimal.js'
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
    for (voyage = 0; voyage < this.speed; voyage = add(voyage, PLANCK_LENGTH)) {
      const [x, y] = step(this.direction, PLANCK_LENGTH, [this.x, this.y])
      const interactiveList = interactiveManager.getAllWithoutBullet()
      const collisionTargets = checkCollision(
        { ...this, x, y, width: this.width, height: this.height },
        interactiveList
      )
      const collisionCount = collisionTargets.length
      if (collisionCount > 1) {
        this.collide()
        break
      } else if (collisionCount === 1) {
        const collisionTarget = collisionTargets[0]
        if ([DIRECTION.DOWN, DIRECTION.UP].includes(this.direction)) {
          const x1 = x + this.width
          const cx = collisionTarget.x
          const cx1 = cx + collisionTarget.width
          if (overlap(x, x1, cx, cx1) < ALLOW_COLLISION_LENGTH) {
            let nextX = null
            // 判断左右关系，坦克在右
            if (x < cx1 && x1 > cx1) {
              nextX = cx1
            } else if (x < cx && x1 > cx) {
              nextX = cx - this.width
            } else {
              this.collide()
              break
            }
            if (nextX !== null) {
              const collisionTargets = checkCollision(
                { ...this, x: nextX, y, width: this.width, height: this.height },
                interactiveList
              )
              if (collisionTargets.length === 0) {
                this.x = nextX
                this.y = y
              } else {
                this.collide()
                break
              }
            }
          } else {
            this.collide()
            break
          }
        } else {
          const y1 = y + this.height
          const cy = collisionTarget.y
          const cy1 = cy + collisionTarget.height
          if (overlap(y, y1, cy, cy1) < ALLOW_COLLISION_LENGTH) {
            let nextY = null
            if (y < cy1 && y1 > cy1) {
              nextY = cy1
            } else if (y < cy && y1 > cy) {
              nextY = cy - this.height
            } else {
              this.collide()
              break
            }
            if (nextY !== null) {
              const collisionTargets = checkCollision(
                { ...this, x, y: nextY, width: this.width, height: this.height },
                interactiveList
              )
              if (collisionTargets.length === 0) {
                this.x = x
                this.y = nextY
              } else {
                this.collide()
                break
              }
            }
          } else {
            this.collide()
            break
          }
        }
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
