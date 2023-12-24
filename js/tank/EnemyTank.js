import { POS, RESOURCE_IMAGE } from '../const/IMAGE.js'
import { BRICK_SIZE } from '../const/SCREEN.js'
import { DIRECTION, FPS } from '../const/WORLD.js'
import Blink from '../other/Blink.js'
import Tank from './Tank.js'

class EnemyTank extends Tank {
  constructor(context, type, x, y, direction) {
    super(context, type)
    this.isAppear = false
    this.frames = 0
    this.isAI = true
    this.x = x
    this.y = y
    this.direction = direction
    const BEFORE_APPEAR_TIME = 2
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
    this.beforeAppearFrames = FPS * BEFORE_APPEAR_TIME
    this.blink = new Blink(context, x, y, BRICK_SIZE)
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

  draw() {
    if (this.isAppear) {
      this.drawImage()
      this.move()
    } else {
      this.blink.draw(this.frames)
      if (this.frames === this.beforeAppearFrames) {
        this.isAppear = true
        this.frames = 0
      }
    }
    this.frames++
  }
}

export class Enemy1 extends EnemyTank {
  constructor(context, x, y, direction) {
    super(context, 'enemy1', x, y, direction)
    this.lives = 1
    this.speed = 1.5
  }
}

export class Enemy2 extends EnemyTank {
  constructor(context, x, y, direction) {
    super(context, 'enemy2', x, y, direction)
    this.height = 28
    this.width = 28
    this.lives = 2
    this.speed = 1
  }

  drawImage() {
    const offsetX = Math.floor(this.direction / 2) * 2
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      this.posX + this.direction * BRICK_SIZE - offsetX,
      this.posY,
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
  constructor(context, x, y, direction) {
    super(context, 'enemy3', x, y, direction)
    this.lives = 3
    this.speed = 0.5

    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
    this.height = 28
    this.width = 26
  }

  drawImage() {
    let offsetX = 0
    let offsetY = 0
    if ([DIRECTION.LEFT, DIRECTION.RIGHT].includes(this.direction)) {
      offsetX = 1
      offsetY = 1
      this.width = 28
      this.height = 26
    } else {
      this.width = 26
      this.height = 28
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
