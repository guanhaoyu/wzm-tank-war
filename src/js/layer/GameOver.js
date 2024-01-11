import { BATTLE_FIELD } from '../BattleField.js'
import { POS, RESOURCE_IMAGE } from '../const/IMAGE.js'
import { BRICK_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH } from '../const/SCREEN.js'
import { sub } from '../utils/decimal.js'

const type = 'over'
export default class GameOver {
  constructor(context) {
    this.ctx = context
    this.x = 176
    this.finalY = sub(SCREEN_HEIGHT / 2, BRICK_SIZE / 2)
    this.posX = POS[type][0]
    this.posY = POS[type][1]
    this.enterSpeed = 4
    this.init()
  }

  get isOver() {
    return this.y === this.finalY
  }

  init() {
    this.y = SCREEN_HEIGHT
    this.clear()
  }

  enter() {
    // 从下往上飞入动效
    if (this.y <= this.finalY) {
      this.y = this.finalY
    } else {
      this.y -= this.enterSpeed
    }
  }

  draw() {
    this.clear()
    this.enter()
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      this.posX,
      this.posY,
      BRICK_SIZE * 2,
      BRICK_SIZE,
      this.x + BATTLE_FIELD.OFFSET_X,
      this.y,
      BRICK_SIZE * 2,
      BRICK_SIZE
    )
  }

  clear() {
    this.ctx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
  }
}
