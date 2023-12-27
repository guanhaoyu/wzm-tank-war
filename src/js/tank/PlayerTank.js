import { POS } from '../const/IMAGE.js'
import KEYBOARD, { keyDirectionMap } from '../const/KEYBOARD.js'
import { BATTLE_FIELD, CAMP, DIRECTION, FPS, SPARK_TYPE } from '../const/WORLD.js'
import Invincible from '../spark/Invincible.js'
import Tank from './Tank.js'

export default class PlayerTank extends Tank {
  constructor(context) {
    super(context, 'player')
    this.lives = 3
    this.speed = 2
    this.protectedTime = 2
    this.protectedFrames = 0
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
    this.camp = CAMP.PLAYER
    this.invincible = new Invincible(context)
    
    this.rebirth()
  }

  get protectedFramesLimit() {
    return this.protectedTime * FPS
  }

  rebirth() {
    this.isProtected = true
    this.x = 129 + BATTLE_FIELD.OFFSET_X
    this.y = 389 + BATTLE_FIELD.OFFSET_Y
    this.direction = DIRECTION.UP
  }

  create() {
    super.create()
    this.invincible.create()
  }

  // 绘制
  draw(codes) {
    this.drawImage()
    this.protect()
    this.move(codes)
    this.shoot(codes)
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
      this.invincible.setLocation(this.x, this.y, this.width, this.height)
    }
    this.protectedFrames++
    if (this.protectedFrames > this.protectedFramesLimit) {
      this.isProtected = false
      this.protectedFrames = 0
    }
  }

  isShooted(bullet) {
    if (!this.isProtected) {
      super.isShooted(bullet)
    }
  }

  underAttack() {
    this.lives--
    if (this.lives === 0) {
      this.destroy()
    } else {
      this.rebirth()
    }
  }
}
