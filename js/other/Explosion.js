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
  enemyBefore: {
    size: 32,
    seriesLength: 7
  }
}

let id = 0

export default class Explosion {
  constructor(context, type) {
    this.ctx = context
    const { size, seriesLength } = explosionType[type]
    this.type = type
    this.seriesLength = seriesLength
    this.size = size
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
    this.slowTimes = 3
    this.id = `explosion-${id}`
    id++
    this.frames = 0
  }

  create(x, y) {
    this.x = x
    this.y = y
    explosionManager.add(this)
  }

  draw() {
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
      explosionManager.delete(this.id)
    }
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
