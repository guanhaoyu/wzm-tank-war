import { RESOURCE_IMAGE, POS } from '../const/IMAGE.js'
import { step } from '../action/movement.js'
import { UP } from '../const/WORLD.js'

// drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
// 从源图像的(sx,sy)位置裁剪sWidth x sHeight的区域,并在canvas的(dx, dy)位置绘制它,缩放到dWidth x dHeight的大小

/**
 * 默认都是刚体
 */
export default class Spirit {
  constructor(
    context,
    type,
    x = 0,
    y = 0,
    size = 0,
    speed = 0,
    direction = UP
  ) {
    this.ctx = context
    this.type = type
    // 速度
    this.speed = speed
    this.x = x
    this.y = y
    // 大小
    this.size = size
    // 运动方向
    this.direction = direction

    this.isDestroyed = false
  }
  // 当前位置
  get position() {
    return [this.x, this.y, this.size, this.size]
  }
  get sourcePosition() {
    const [x, y] = POS[this.type]
    return [x + this.direction * this.size, y, this.size, this.size]
  }
  // 绘制
  draw() {
    this.ctx.drawImage(RESOURCE_IMAGE, ...this.sourcePosition, ...this.position)
  }
  // 移动
  move(direction) {
    this.direction = direction
    const [x, y] = step(this.direction, this.speed, [this.x, this.y])
    // 碰撞和边界检测
    this.x = x
    this.y = y
  }
  // 销毁
  destroy() {
    this.isDestroyed = true
  }
}
