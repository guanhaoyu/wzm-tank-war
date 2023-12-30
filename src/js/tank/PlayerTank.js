import { POS } from '../const/IMAGE.js'
import KEYBOARD, { keyDirectionMap } from '../const/KEYBOARD.js'
import { BATTLE_FIELD, CAMP, DIRECTION, FPS } from '../const/WORLD.js'
import { createExplosion } from '../spark/Explosion.js'
import Invincible from '../spark/Invincible.js'
import Tank from './Tank.js'

const type = 'player'
export default class PlayerTank extends Tank {
  constructor(context) {
    super(context, type)
    this.lives = 30
    this.protectedTime = 20
    this.posX = POS[type][0]
    this.posY = POS[type][1]
    this.camp = CAMP.PLAYER
    this.invincible = new Invincible(context)
  }

  get protectedFramesLimit() {
    return this.protectedTime * FPS
  }

  birth() {
    this.isProtected = true
    this.protectedFrames = 0
    this.shootable = true
    this.coolDownFrames = 0
    this.coolDownTime = 1
    this.x = 129 + BATTLE_FIELD.OFFSET_X
    this.y = 389 + BATTLE_FIELD.OFFSET_Y
    this.direction = DIRECTION.UP
    this.speed = 2
  }

  create() {
    if (this.lives) {
      super.create()
      this.birth()
      this.invincible.create()
    }
  }

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
      this.protectedFrames++
      if (this.protectedFrames > this.protectedFramesLimit) {
        this.isProtected = false
        this.protectedFrames = 0
      }
    }
  }

  isShooted(bullet) {
    if (!this.isProtected) {
      super.isShooted(bullet)
    }
  }

  underAttack() {
    if (!this.isProtected) {
      this.lives--
      if (this.lives === 0) {
        this.destroy()
      } else {
        createExplosion(this.ctx, 'tankBomb', this.x, this.y, this.width, this.height)
        this.birth()
      }
    }
  }

  upgrade() {
    this.coolDownTime = 0.9
    this.speed = 2.2
  }
}
