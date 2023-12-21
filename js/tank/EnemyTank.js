import { POS, RESOURCE_IMAGE } from '../const/IMAGE.js'
import { FPS } from '../const/WORLD.js'
import Blink from '../other/Blink.js'
import Tank from './Tank.js'

class EnemyTank extends Tank {
  constructor(context, type, x, y, direction) {
    super(context, type)
    this.isAppear = false
    // 画了几次，用于计时
    this.frames = 0
    this.isAI = true
    this.x = x
    this.y = y
    this.direction = direction
    const BEFORE_APPEAR_TIME = 2
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
    this.beforeAppearFrames = FPS * BEFORE_APPEAR_TIME
    this.blink = new Blink(context, x, y, this.size)
  }
  draw() {
    this.frames++
    if (this.isAppear) {
      this.ctx.drawImage(
        RESOURCE_IMAGE,
        this.posX + this.direction * this.size,
        this.posY,
        this.size,
        this.size,
        this.x,
        this.y,
        this.size,
        this.size
      )
      this.move()
    } else {
      this.blink.draw(this.frames)
      if (this.frames === this.beforeAppearFrames) {
        this.isAppear = true
        this.frames = 0
      }
    }
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
    this.lives = 2
    this.speed = 1
  }
}

export class Enemy3 extends EnemyTank {
  constructor(context, x, y, direction) {
    super(context, 'enemy3', x, y, direction)
    this.lives = 3
    this.speed = 0.5
  }
}
