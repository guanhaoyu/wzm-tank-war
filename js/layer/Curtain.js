import Digital from '../other/Digital.js'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../const/SCREEN.js'
import Label from '../other/Label.js'

const INSIDE = 1
const OUTSIDE = 0

export default class Curtain {
  ctx = null

  // 幕布运动方向：朝画布外或朝画布内
  trend = INSIDE

  step = 16

  alreadyDrawHeight = 0

  // 停留的帧数
  stayFrames = 60 * 3

  // 已停留的帧数
  frame = 0

  constructor(context) {
    this.ctx = context
    this.ctx.fillStyle = '#7f7f7f'
  }

  draw(level) {
    if (this.trend === INSIDE) {
      if (this.alreadyDrawHeight === SCREEN_HEIGHT) {
        const label = new Label(this.ctx)
        label.draw()
        const digital = new Digital(this.ctx, level)
        digital.draw(308, 208)
        if (this.frame < this.stayFrames) {
          this.frame ++
        } else {
          this.trend = OUTSIDE
          this.frame = 0
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
    } else {
      if (this.alreadyDrawHeight === 0) {
        this.trend = INSIDE
      } else {
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
}
