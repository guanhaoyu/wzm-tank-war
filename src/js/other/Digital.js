import { POS, RESOURCE_IMAGE } from '../const/IMAGE'

export default class Digital {
  constructor(context) {
    this.ctx = context
    // 文字大小
    this.size = 14
    // 在图片中的位置
    this.type = 'num'
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
  }

  /**
   *
   * @param {Integer} num
   * @param {number} x
   * @param {number} y
   */
  draw(num, x, y) {
    let n = num
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
        this.posX + arr[i] * this.size,
        this.posY,
        this.size,
        this.size,
        x + (arr.length - i - 1) * this.size,
        y,
        this.size,
        this.size
      )
    }
  }
}
