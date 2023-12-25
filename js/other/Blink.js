import { POS, RESOURCE_IMAGE } from '../const/IMAGE.js'
import { FPS } from '../const/WORLD.js'

export default class Blink {
  constructor(context, size = 32) {
    this.ctx = context
    this.size = size
    this.posX = POS['enemyBefore'][0]
    this.posY = POS['enemyBefore'][1]
    // 原图中闪烁的帧数
    this.seriesLength = 7
    this.slowTimes = 5
    const BEFORE_APPEAR_TIME = 2
    this.durationFrames = FPS * BEFORE_APPEAR_TIME
    this.isOver = false
    this.frames = 0
  }

  create(x, y) {
    this.x = x
    this.y = y
  }
  draw() {
    const index = Math.floor(this.frames / this.slowTimes) % this.seriesLength
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      this.posX + index * this.size,
      this.posY,
      this.size,
      this.size,
      this.x,
      this.y,
      this.size,
      this.size
    )
    if (this.durationFrames <= this.frames && (index === 0 || index === this.seriesLength - 1)) {
      this.isOver = true
    }
    this.frames++
  }
}
