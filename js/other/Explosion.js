import { POS, RESOURCE_IMAGE } from "../const/IMAGE.js"
import { EXPLOSION_TYPE, FPS } from "../const/WORLD.js"
import { calculateCenter } from "../utils/geometry.js"

let id = 0

export default class Explosion {
  constructor(context, type) {
    this.ctx = context
    const { size, ticks, duration } = EXPLOSION_TYPE[type]
    this.type = type
    this.ticks = ticks
    this.size = size
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
    this.slowTimes = 3
    this.id = `explosion-${id}`
    id++
    this.frames = 0
    this.durationFrames = duration * FPS
  }

  create(x, y) {
    this.x = x
    this.y = y
    explosionManager.add(this)
  }

  afterDraw(tick) {
    if (this.frames >= this.durationFrames && tick === 0) {
      explosionManager.delete(this.id)
    }
  }

  draw() {
    const index = Math.floor(this.frames / this.slowTimes) % this.ticks
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

/**
 * 创建💥
 * @param {'bulletBomb' | 'tankBomb'} type 
 */
export function createExplosion(type, ctx, x, y, width, height) {
  const { size } = EXPLOSION_TYPE[type]
  const explosion = new Explosion(ctx, type)
  const [cx, cy] = calculateCenter(x, y, width, height)
  const halfSize = size / 2
  explosion.create(cx - halfSize, cy - halfSize)
}