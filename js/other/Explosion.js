import { POS, RESOURCE_IMAGE } from "../const/IMAGE"
import { FPS } from "../const/WORLD"

const duration = 2

const durationFrames = duration * FPS

const explosionType = {
  bulletBomb: {
    size: 32,
    seriesLength: 3,
  },
  tankBomb: {
    size: 66,
    seriesLength: 4,
  },
}

export default class Explosion {
  constructor(context, type) {
    this.ctx = context
    const { size, seriesLength } = explosionType[type]
    this.type = type
    this.seriesLength = seriesLength
    this.size = size
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
    this.isOver = false
    this.slowTimes = 3
  }

  create(x, y) {
    this.x = x
    this.y = y
  }

  draw(frames) {
    const index = Math.floor(frames / this.slowTimes) % this.seriesLength
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
    if (frames >= durationFrames && index === 0) {
      this.isOver = true
    }
  }
}
