import { POS, RESOURCE_IMAGE } from '../const/IMAGE.js'
import { BRICK_SIZE } from '../const/SCREEN.js'
import { BATTLE_FIELD, CAMP, DIRECTION, FPS } from '../const/WORLD.js'
import Blink from '../spark/Blink.js'
import Tank from './Tank.js'

const { DOWN, LEFT, RIGHT } = DIRECTION

class EnemyTank extends Tank {
  constructor(context, type) {
    super(context, type)
    this.isAppear = false
    this.frames = 0
    this.isAI = true
    // 射击的概率
    this.probabilityOfShoot = 0.6
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
    this.blink = new Blink(context)
    this.camp = CAMP.ENEMY
  }

  create(x, y, direction = DOWN) {
    super.create()
    this.x = x
    this.y = y
    this.direction = direction
    // BATTLE_FIELD.OFFSET_Y是16，BATTLE_FIELD.OFFSET_X是32，值不一样，所以计算方式也不一样
    this.blink.create(
      Math.round(this.x / BRICK_SIZE) * BRICK_SIZE,
      Math.round(this.y / BRICK_SIZE) * BRICK_SIZE - BATTLE_FIELD.OFFSET_Y
    )
  }

  shoot() {
    if (Math.random() < this.probabilityOfShoot) {
      super.shoot()
    }
  }

  draw() {
    if (this.isAppear) {
      this.drawImage()
      this.move()
      this.shoot()
      this.coolDown()
    } else {
      this.isAppear = this.blink.isOver
    }
    this.frames++
  }

  onAccess() {
    if (this.frames % (FPS * 5) === 0) {
      this.changeDirection()
    }
  }

  onCollision() {
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
