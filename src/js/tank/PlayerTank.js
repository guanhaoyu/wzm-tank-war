import { POS } from '../const/IMAGE.js'
import KEYBOARD, { keyDirectionMap } from '../const/KEYBOARD.js'
import { BATTLE_FIELD, CAMP, DIRECTION, FPS } from '../const/WORLD.js'
import { createExplosion } from '../spark/Explosion.js'
import Invincible from '../spark/Invincible.js'
import interactiveManager from '../utils/InteractiveManager.js'
import { isCollided } from '../utils/collision.js'
import Tank from './Tank.js'

const BIRTH_COORDINATE = [
  129 + BATTLE_FIELD.OFFSET_X,
  389 + BATTLE_FIELD.OFFSET_Y
]
export default class PlayerTank extends Tank {
  constructor(context) {
    super(context, 'player')
    this.lives = 30
    this.protectedTime = 20
    this.camp = CAMP.PLAYER
    this.invincible = new Invincible(context)
  }

  get protectedFramesLimit() {
    return this.protectedTime * FPS
  }

  birth() {
    this.isDestroyed = false
    this.isProtected = true
    this.protectedFrames = 0
    this.shootable = true
    this.coolDownFrames = 0
    this.coolDownTime = 1
    this.x = BIRTH_COORDINATE[0]
    this.y = BIRTH_COORDINATE[1]
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
    if (!this.isDestroyed) {
      this.drawImage()
      this.protect()
      this.move(codes)
      this.shoot(codes)
      this.coolDown()
    }
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
    this.invincible.isAppeared = this.isProtected
    if (this.isProtected) {
      this.invincible.setLocation(this.x, this.y, this.width, this.height)
      this.protectedFrames++
      if (this.protectedFrames >= this.protectedFramesLimit) {
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
      this.destroy()
      if (this.lives > 0) {
        const result = interactiveManager.getTanks().some(tank => isCollided(tank, [{
          x: BIRTH_COORDINATE[0],
          y: BIRTH_COORDINATE[1],
          width: this.width,
          height: this.height
        }]))
        if (result) {
          requestAnimationFrame(this.birth.bind(this))
        } else {
          this.birth()
        }
      }
    }
  }

  upgrade() {
    this.coolDownTime = 0.9
    this.speed = 2.2
  }
}
