import { BATTLE_FIELD } from '../BattleField'
import { POS, RESOURCE_IMAGE } from '../const/IMAGE'
import { BRICK_SIZE } from '../const/SCREEN'
import { CAMP, DIRECTION, FPS } from '../const/WORLD'
import Blink from '../spark/Blink'
import Tank from './Tank'

const { DOWN, LEFT, RIGHT } = DIRECTION
const DIRECTION_LENGTH = Object.keys(DIRECTION).length

const appearDirections = [DOWN, LEFT, RIGHT]

export const ENEMY_LOCATION = [192, 0, 384] //相对于主游戏区

class EnemyTank extends Tank {
  constructor(context, type) {
    super(context, type)
    this.isAppeared = false
    this.direction = appearDirections[Math.floor(Math.random() * appearDirections.length)]
    this.isAI = true
    this.isStop = false
    // 射击的概率
    this.probabilityOfShoot = 0.6
    this.blink = new Blink(context)
    this.camp = CAMP.ENEMY
    this.changeDirectionTime = 5
    this.frames = 0
  }

  get changeDirectionFrames() {
    return this.changeDirectionTime * FPS
  }

  create(x, y) {
    super.create()
    this.x = x
    this.y = y
    if (!this.isAppeared) {
      // BATTLE_FIELD.OFFSET_Y是16，BATTLE_FIELD.OFFSET_X是32，值不一样，所以计算方式也不一样
      this.blink.create(
        Math.round(this.x / BRICK_SIZE) * BRICK_SIZE,
        Math.round(this.y / BRICK_SIZE) * BRICK_SIZE - BATTLE_FIELD.OFFSET_Y
      )
    }
  }

  shoot() {
    if (Math.random() < this.probabilityOfShoot) {
      super.shoot()
    }
  }

  draw() {
    if (!this.isDestroyed) {
      if (this.isAppeared) {
        this.drawImage()
        if (!this.isStop) {
          this.move()
          this.shoot()
        }
        this.coolDown()
      } else {
        this.isAppeared = !this.blink.isAppeared
      }
      this.frames++
    }
  }

  pass() {
    if (this.frames % this.changeDirectionFrames === 0) {
      this.changeDirection()
    }
  }

  collide() {
    this.changeDirection()
  }

  changeDirection() {
    this.direction =
      DIRECTION[
        Object.keys(DIRECTION).filter(key => DIRECTION[key] !== this.direction)[
          Math.floor(Math.random() * 3)
        ]
      ]
  }

  underAttack() {
    if (this.isAppeared) {
      this.lives--
      if (this.lives === 0) {
        this.destroy()
      }
    }
  }
}

export class Enemy1 extends EnemyTank {
  constructor(context) {
    super(context, 'enemy1')
    this.lives = 1
    this.speed = 1.5
  }
}

export class Enemy2 extends EnemyTank {
  constructor(context) {
    super(context, 'enemy2')
    this.lives = 2
    this.speed = 1
    this.probabilityOfShoot = 0.65
  }

  get width() {
    if ([LEFT, RIGHT].includes(this.direction)) {
      return 28
    }
    return 24
  }

  get height() {
    if ([LEFT, RIGHT].includes(this.direction)) {
      return 24
    }
    return 28
  }

  drawImage() {
    let offsetX = 0
    let offsetY = 0
    if ([LEFT, RIGHT].includes(this.direction)) {
      offsetX = 2
      offsetY = 2
    }

    this.ctx.drawImage(
      RESOURCE_IMAGE,
      this.posX + this.direction * BRICK_SIZE - offsetX,
      this.posY + offsetY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
}

export class Enemy3 extends EnemyTank {
  constructor(context) {
    super(context, 'enemy3')
    this.originalLives = 3
    this.lives = 3
    this.speed = 0.5
    this.probabilityOfShoot = 0.7
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
  }

  get width() {
    if ([LEFT, RIGHT].includes(this.direction)) {
      return 28
    }
    return 26
  }

  get height() {
    if ([LEFT, RIGHT].includes(this.direction)) {
      return 26
    }
    return 28
  }

  drawImage() {
    let offsetX = 0
    let offsetY = 0
    if ([LEFT, RIGHT].includes(this.direction)) {
      offsetX = 1
      offsetY = 1
    }
    const posX = this.posX + (this.originalLives - this.lives) * BRICK_SIZE * DIRECTION_LENGTH
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      posX + this.direction * BRICK_SIZE - offsetX,
      this.posY + offsetY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    )
  }
}
