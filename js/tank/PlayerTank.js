import { POS, RESOURCE_IMAGE } from '../const/IMAGE.js'
import { keyDirectionMap } from '../const/KEYBOARD.js'
import { BRICK_SIZE } from '../const/SCREEN.js'
import { BATTLE_FIELD } from '../const/WORLD.js'
import Tank from './Tank.js'

export default class PlayerTank extends Tank {
  constructor(context) {
    super(context, 'player')
    this.lives = 3
    this.isProtected = true //是否受保护
    this.protectedTime = 500 //保护时间 ? 这500是秒？接近9分钟啊离谱
    this.speed = 2
    this.x = 129 + BATTLE_FIELD.OFFSET_X
    this.y = 385 + BATTLE_FIELD.OFFSET_Y + 4
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
  }

  // 绘制
  draw(codes) {
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      this.posX + this.direction * BRICK_SIZE,
      this.posY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    )
    this.move(Array.from(codes))
  }

  move(codes = []) {
    for (let i = codes.length - 1; i >= 0; i--) {
      const code = codes[i]
      const direction = keyDirectionMap.get(code)
      if (direction !== undefined) {
        this.direction = direction
        super.move()
        break
      }
    }
  }
}
