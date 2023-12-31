import { POS } from "../const/IMAGE"

// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
// 从源图像的(sx,sy)位置裁剪sWidth x sHeight的区域,并在canvas的(dx, dy)位置绘制它,缩放到dWidth x dHeight的大小

let id = 0

/**
 * 默认都是刚体
 */
export default class Spirit {
  constructor(context, type) {
    this.ctx = context
    this.type = type
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
    // 速度
    this.speed = 0
    this.x = 0
    this.y = 0

    this.id = `spirit-${id}`
    id++
  }
}
