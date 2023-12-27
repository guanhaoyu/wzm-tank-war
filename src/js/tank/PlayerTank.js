import { POS } from '../const/IMAGE.js'
import KEYBOARD, { keyDirectionMap } from '../const/KEYBOARD.js'
import { BATTLE_FIELD, CAMP, DIRECTION, FPS } from '../const/WORLD.js'
import Invincible from '../spark/Invincible.js'
import Tank from './Tank.js'

export default class PlayerTank extends Tank {
  constructor(context) {
    super(context, 'player')
    this.lives = 3
    this.isProtected = true //是否受保护
    this.protectedTime = 25
    this.protectedFrames = 0
    this.speed = 2
    this.x = 129 + BATTLE_FIELD.OFFSET_X
    this.y = 385 + BATTLE_FIELD.OFFSET_Y + 4
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
    this.camp = CAMP.PLAYER
    this.invincible = new Invincible(context)
  }

  get protectedFramesLimit() {
    return this.protectedTime * FPS
  }

  create() {
    super.create()
    this.invincible.create()
    this.direction = DIRECTION.UP
  }

  // 绘制
  draw(codes) {
    const codesArr = Array.from(codes)
    this.drawImage()
    this.protect()
    this.move(codesArr)
    this.shoot(codesArr)
    this.coolDown()
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

  shoot(codes = []) {
    if (codes.includes(KEYBOARD.SPACE)) {
      super.shoot()
    }
  }

  protect() {
    this.invincible.isOver = !this.isProtected
    if (this.isProtected) {
      // x,y可能需要修正一下，坦克不是32*32的正方形
      this.invincible.x = this.x - 5
      this.invincible.y = this.y
    }
    this.protectedFrames++
    if (this.protectedFrames > this.protectedFramesLimit) {
      this.isProtected = false
      this.protectedFrames = 0
    }
  }
}
