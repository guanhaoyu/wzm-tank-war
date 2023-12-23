import { POS, RESOURCE_IMAGE } from '../const/IMAGE.js'
import { BATTLE_FIELD } from '../const/WORLD.js'
import Tank from './Tank.js'

export default class PlayerTank extends Tank {
  constructor(context) {
    super(context, 'player')
    this.lives = 3
    this.isProtected = true //是否受保护
    this.protectedTime = 500 //保护时间 ? 这500是秒？接近9分钟啊离谱
    this.speed = 2 //坦克的速度
    this.x = 129 + BATTLE_FIELD.OFFSET_X
    this.y = 385 + BATTLE_FIELD.OFFSET_Y

    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
  }

  // 绘制
  draw() {
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      this.posX + this.direction * this.size,
      this.posY,
      this.size,
      this.size,
      this.x,
      this.y,
      this.size,
      this.size
    )
  }
}
