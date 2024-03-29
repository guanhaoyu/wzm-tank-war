import { RESOURCE_IMAGE } from '../const/IMAGE'
import { DIRECTION } from '../const/WORLD'
import { step } from '../utils/geometry'
import Tank from './Tank'

const { UP, DOWN, RIGHT, LEFT } = DIRECTION

// 菜单选择坦克
export default class SelectTank extends Tank {
  constructor(context, y1 = 250, y2 = 281) {
    super(context, 'selectTank')
    this.x = 140
    this.size = 27
    this.y = y1
    this.y1 = y1
    this.y2 = y2
    this.speed = y2 - y1
    this.direction = RIGHT
    this.frames = 0
    this.slowTimes = 2
    this.ticks = 2
  }
  draw() {
    this.frames++
    const index = Math.floor(this.frames / this.slowTimes) % this.ticks
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      ...[this.posX, this.posY + this.size * index, this.size, this.size],
      ...[this.x, this.y, this.size, this.size]
    )
  }
  move(direction) {
    const [_, y] = step(direction, this.speed, [this.x, this.y])
    // 只改变y坐标
    this.y = Math.min(y, this.y2)
    this.y = Math.max(this.y, this.y1)
  }
}
