import { BATTLE_FIELD } from '../BattleField.js'
import { ATTACK_AUDIO, MOVE_AUDIO, PLAYER_DESTROY_AUDIO } from '../const/AUDIO.js'
import KEYBOARD, { keyDirectionMap } from '../const/KEYBOARD.js'
import { CAMP, DIRECTION, FPS } from '../const/WORLD.js'
import Invincible from '../spark/Invincible.js'
import interactiveManager from '../utils/InteractiveManager.js'
import { isCollided } from '../utils/collision.js'
import Tank from './Tank.js'

const BIRTH_COORDINATE = [129 + BATTLE_FIELD.OFFSET_X, 389 + BATTLE_FIELD.OFFSET_Y]
export default class PlayerTank extends Tank {
  constructor(context) {
    super(context, 'player')
    this.protectedTime = 25
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
    this.explosion = null
  }

  create() {
    super.create()
    this.birth()
    this.invincible.create()
    this.lives = this.lives || 3
  }

  draw(codes) {
    if (this.isDestroyed) {
      this.rebirth()
    } else {
      this.drawImage()
      this.protect()
      this.move(codes)
      this.shoot(codes)
      this.coolDown()
    }
  }

  rebirth() {
    if (this.lives > 0 && this.explosion && !this.explosion.isAppeared) {
      const result = interactiveManager.getTanks().some(tank =>
        isCollided(tank, [
          {
            x: BIRTH_COORDINATE[0],
            y: BIRTH_COORDINATE[1],
            width: this.width,
            height: this.height,
          },
        ])
      )
      if (!result) {
        this.birth()
      }
    }
  }

  move(codes = []) {
    let isStop = true
    for (let i = codes.length - 1; i >= 0; i--) {
      const code = codes[i]
      const direction = keyDirectionMap.get(code)
      if (direction !== undefined) {
        this.direction = direction
        MOVE_AUDIO.play()
        super.move()
        isStop = false
        break
      }
    }
    if (isStop) {
      MOVE_AUDIO.pause()
    }
  }

  shoot(codes = []) {
    if (codes.includes(KEYBOARD.SPACE)) {
      super.shoot()
    }
  }

  playAttackSound() {
    ATTACK_AUDIO.play()
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

  destroy() {
    this.isProtected = false
    this.protectedFrames = 0
    this.invincible.isAppeared = this.isProtected
    super.destroy(PLAYER_DESTROY_AUDIO.duration)
  }

  playDestroySound() {
    PLAYER_DESTROY_AUDIO.play()
  }

  embraceExplosion(explosion) {
    this.explosion = explosion
  }

  underAttack() {
    if (!this.isProtected) {
      this.lives--
      this.destroy(explosion => (this.explosion = explosion))
    }
  }

  upgrade() {
    this.coolDownTime = 0.9
    this.speed = 2.2
  }
}
