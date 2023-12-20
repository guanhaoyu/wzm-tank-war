import { POS, RESOURCE_IMAGE } from "../const/IMAGE.js"

export default class Blink {
  constructor(context, x, y, size) {
    this.ctx = context
    this.x = x
    this.y = y
    this.size = size
    this.posX = POS['enemyBefore'][0]
    this.posY = POS['enemyBefore'][1]
    this.sourceSize = 32
    this.seriesLength = 7
    this.slowTimes = 5
  }
  draw(frames) {
    const index = parseInt(frames / this.slowTimes) % this.seriesLength
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      this.posX + index * this.sourceSize,
      this.posY,
      this.sourceSize,
      this.sourceSize,
      this.x,
      this.y,
      this.size,
      this.size
    )
  }
}
