import { POS, RESOURCE_IMAGE } from '../const/IMAGE.js'
import { BRICK_SIZE } from '../const/SCREEN.js'
import { FPS } from '../const/WORLD.js'
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
    // enemy2 截图起点x与其他坦克不一样
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
  }
}
