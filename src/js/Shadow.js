import { RESOURCE_IMAGE } from './const/IMAGE'
import { BRICK_SIZE } from './const/SCREEN'
import shadowManager from './helper/ShadowManager'
import Spirit from './spirit/Spirit'

export default class Shadow extends Spirit {
  constructor(context, type, x, y, width, height, direction) {
    super(context, type)
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.direction = direction
    this.globalAlpha = 0.6
    this.time = Date.now()
    // 衰减时间
    this.decayTime = 16
  }

  draw() {
    this.drawImage();
  }

  drawImage() {
    if (this.globalAlpha <= 0) {
      this.destroy()
      return
    }
    this.ctx.save()
    this.ctx.globalAlpha = this.globalAlpha
    if (Date.now() - this.time > this.decayTime) {
      this.globalAlpha = this.globalAlpha - 0.03
      this.time = Date.now()
    }
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
    this.ctx.restore()
  }

  destroy() {
    shadowManager.remove(this)
  }
}