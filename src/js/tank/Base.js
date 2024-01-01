import { PLAYER_DESTROY_AUDIO } from '../const/AUDIO.js'
import { BRICK_SIZE } from '../const/SCREEN.js'
import Tank from './Tank.js'

export default class Base extends Tank {
  constructor(context, task) {
    super(context)
    this.task = task
  }

  create(x = 224, y = 400) {
    super.create()
    this.isDestroyed = false
    this.x = x
    this.y = y
  }

  get width() {
    return BRICK_SIZE
  }

  get height() {
    return BRICK_SIZE
  }

  move() {}

  shoot() {}

  underAttack() {
    this.destroy(PLAYER_DESTROY_AUDIO.duration)
    this.task()
  }

  draw() {
    this.drawImage()
  }

  playDestroySound() {
    PLAYER_DESTROY_AUDIO.play()
  }
}
