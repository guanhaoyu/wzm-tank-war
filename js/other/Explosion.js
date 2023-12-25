import { POS, RESOURCE_IMAGE } from "../const/IMAGE.js"
import { FPS } from "../const/WORLD.js"

const HALF = 0.5

const explosionType = {
  bulletBomb: {
    size: 32,
    seriesLength: 3,
    duration: 0.5
  },
  tankBomb: {
    size: 66,
    seriesLength: 4,
    duration: 1
  },
  enemyBefore: {
    size: 32,
    seriesLength: 7,
    duration: 2
  }
}

let id = 0

export default class Explosion {
  constructor(context, type) {
    this.ctx = context
    const { size, seriesLength, duration } = explosionType[type]
    this.type = type
    this.seriesLength = seriesLength
    this.size = size
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
    this.slowTimes = 3
    this.id = `explosion-${id}`
    id++
    this.frames = 0
    this.durationFrames = duration * FPS
  }

  create(x, y, width, height) {
    this.x = x + width * HALF - this.size * HALF
    this.y = y + height * HALF - this.size * HALF
    explosionManager.add(this)
  }

  afterDraw(tick) {
    if (this.frames >= this.durationFrames && tick === 0) {
      explosionManager.delete(this.id)
    }
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
    this.afterDraw(index)
    this.frames++
  }
}

class ExplosionManager {
  constructor() {
    this.explosions = []
  }

  add(...args) {
    args.forEach(arg => {
      if (!this.explosions.find(explosion => explosion.id === arg.id)) {
        this.explosions.push(arg)
      }
    })
  }

  delete(...ids) {
    ids.forEach(id => {
      const index = this.explosions.findIndex(explosion => explosion.id === id)
      this.explosions.splice(index, 1)
    })
  }

  clear() {
    this.explosions = []
  }

  draw() {
    this.explosions.forEach(explosion => {
      explosion.draw()
    })
  }
}

export const explosionManager = new ExplosionManager()
