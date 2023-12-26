import { POS, RESOURCE_IMAGE } from '../const/IMAGE.js'

export default class Digital {
  constructor(context) {
    this.ctx = context
    // 文字大小
    this.size = 14
    // 在图片中的位置
    this.type = 'num'
  }

  /**
   *
   * @param {Integer} num
   * @param {number} x
   * @param {number} y
   */
  draw(num, x, y) {
    let n = num
    const type = this.type
    const size = this.size
    const arr = []
    if (n === 0) {
      arr.push(0)
    } else {
      while (n > 0) {
        arr.push(n % 10)
        n = parseInt(n / 10)
      }
    }
    for (let i = arr.length - 1; i >= 0; i--) {
      this.ctx.drawImage(
        RESOURCE_IMAGE,
        POS[type][0] + arr[i] * size,
        POS[type][1],
        size,
        size,
        x + (arr.length - i - 1) * size,
        y,
        size,
        size
      )
    }
  }
}
