import { ATTACK_AUDIO, MOVE_AUDIO, PLAYER_DESTROY_AUDIO } from '../const/AUDIO'
import KEYBOARD from '../const/KEYBOARD'
import { CAMP, DIRECTION, FPS } from '../const/WORLD'
import Invincible from '../spark/Invincible'
import interactiveManager from '../helper/InteractiveManager'
import { getCollisions } from '../utils/collision'
import Tank from './Tank'

export default class PlayerTank extends Tank {
  constructor(context, type = 'player1') {
    super(context, type)
    this.lives = 0
    this.protectedTime = 25
    this.camp = CAMP.PLAYER
    this.invincible = new Invincible(context)
    this.keyDirectionMap = {}
    this.fireKey = null
    this.birth_coordinate = []
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
    this.x = this.birth_coordinate[0]
    this.y = this.birth_coordinate[1]
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
      const isTankHere = interactiveManager.getTanks().some(
        tank =>
          getCollisions(tank, [
            {
              x: this.birth_coordinate[0],
              y: this.birth_coordinate[1],
              width: this.width,
              height: this.height,
            },
          ]).length
      )
      if (!isTankHere) {
        this.birth()
      }
    }
  }

  move(codes = []) {
    let isStop = true
    for (let i = codes.length - 1; i >= 0; i--) {
      const code = codes[i]
      const direction = this.keyDirectionMap[code]
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
    if (codes.includes(this.fireKey)) {
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
      this.destroy()
    }
  }

  upgrade() {
    this.coolDownTime = 0.9
    this.speed = 2.2
  }
}

export class Player1 extends PlayerTank {
  constructor(context) {
    super(context, 'player1')
    this.birth_coordinate = [161, 405]
    this.keyDirectionMap = {
      [KEYBOARD.W]: DIRECTION.UP,
      [KEYBOARD.S]: DIRECTION.DOWN,
      [KEYBOARD.A]: DIRECTION.LEFT,
      [KEYBOARD.D]: DIRECTION.RIGHT,
    }
    this.fireKey = KEYBOARD.SPACE
  }
}

export class Player2 extends PlayerTank {
  constructor(context) {
    super(context, 'player2')
    this.birth_coordinate = [289, 405]
    this.keyDirectionMap = {
      [KEYBOARD.UP]: DIRECTION.UP,
      [KEYBOARD.DOWN]: DIRECTION.DOWN,
      [KEYBOARD.LEFT]: DIRECTION.LEFT,
      [KEYBOARD.RIGHT]: DIRECTION.RIGHT,
    }
    this.fireKey = KEYBOARD.ENTER
  }
}
