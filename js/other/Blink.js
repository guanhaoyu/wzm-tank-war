import { POS, RESOURCE_IMAGE } from "../const/IMAGE.js"

export default class Blink {
  constructor(context, size = 32) {
    this.ctx = context
    this.size = size
    this.posX = POS['enemyBefore'][0]
    this.posY = POS['enemyBefore'][1]
    this.seriesLength = 7
    this.slowTimes = 5
  }
  draw(x, y, frames) {
    const index = parseInt(frames / this.slowTimes) % this.seriesLength
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      this.posX + index * this.size,
      this.posY,
      this.size,
      this.size,
      x,
      y,
      this.size,
      this.size
    )
  }
}
