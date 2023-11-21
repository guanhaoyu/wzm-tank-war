import { POS, RESOURCE_IMAGE } from '../const/IMAGE.js'

// 在图片中的位置
const TYPE = 'num'
// 文字大小
const SIZE = 14

export default class Digital {
  constructor(context, level) {
    this.ctx = context
    this.level = level
  }

  /**
   * 
   * @param {number} x 
   * @param {number} y 
   */
  draw(x, y) {
    let l = this.level
    const arr = []
    if (l === 0) {
      arr.push(0)
    } else {
      while (l > 0) {
        arr.push(l % 10)
        l = parseInt(l / 10)
      }
    }
    for (let i = arr.length - 1; i >= 0; i--) {
      this.ctx.drawImage(
        RESOURCE_IMAGE,
        POS[TYPE][0] + arr[i] * SIZE,
        POS[TYPE][1],
        SIZE,
        SIZE,
        x + (arr.length - i - 1) * SIZE,
        y,
        SIZE,
        SIZE
      )
    }
  }
}
