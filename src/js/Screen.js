import { SCREEN_HEIGHT, SCREEN_WIDTH } from './const/SCREEN.js'

export default class Screen {
  constructor(context, { width, height } = {}) {
    this.ctx = context
    this.width = width || SCREEN_WIDTH
    this.height = height || SCREEN_HEIGHT
  }

  // 清空
  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  draw() {
    
  }
}
