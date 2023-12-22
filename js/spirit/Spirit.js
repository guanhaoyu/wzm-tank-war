import { DIRECTION } from '../const/WORLD.js'

// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
// 从源图像的(sx,sy)位置裁剪sWidth x sHeight的区域,并在canvas的(dx, dy)位置绘制它,缩放到dWidth x dHeight的大小

const { UP, DOWN, RIGHT, LEFT } = DIRECTION

let id = 0

/**
 * 默认都是刚体
 */
export default class Spirit {
  constructor(context, type) {
    this.ctx = context
    this.type = type
    // 速度
    this.speed = 0
    this.x = 0
    this.y = 0
    // 大小
    this.size = 0
    // 运动方向
    this.direction = UP

    this.isDestroyed = false
    this.id = `spirit-${id}`
    id++
  }
  // 销毁
  destroy() {
    this.isDestroyed = true
  }
}