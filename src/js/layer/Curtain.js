import Digital from '../other/Digital.js'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../const/SCREEN.js'
import Label from '../other/Label.js'
import { FPS } from '../const/WORLD.js'

export default class Curtain {
  constructor(context) {
    this.ctx = context
    this.ctx.fillStyle = '#7f7f7f'
    this.step = 16
    this.alreadyDrawHeight = 0
    const STAY_TIME = 0.2
    // 停留的帧数
    this.stayFrames = FPS * STAY_TIME
    // 已停留的帧数
    this.frames = 0
  }

  fold(level, cb) {
    if (this.alreadyDrawHeight === SCREEN_HEIGHT) {
      // 停留
      if (this.frames < this.stayFrames) {
        this.frames ++
        const label = new Label(this.ctx)
        label.draw()
        const digital = new Digital(this.ctx)
        digital.draw(level, 308, 208)
      } else {
        cb()
        this.frames = 0
      }
    } else {
      this.alreadyDrawHeight += this.step
      this.ctx.fillRect(0, 0, SCREEN_WIDTH, this.alreadyDrawHeight)
      this.ctx.fillRect(
        0,
        SCREEN_HEIGHT - this.alreadyDrawHeight,
        SCREEN_WIDTH,
        this.alreadyDrawHeight
      )
    }
  }

  unfold() {
    if (this.alreadyDrawHeight > 0) {
      this.alreadyDrawHeight -= this.step
      this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
      this.ctx.fillRect(0, 0, SCREEN_WIDTH, this.alreadyDrawHeight)
      this.ctx.fillRect(
        0,
        SCREEN_HEIGHT - this.alreadyDrawHeight,
        SCREEN_WIDTH,
        this.alreadyDrawHeight
      )
    }
  }
}
