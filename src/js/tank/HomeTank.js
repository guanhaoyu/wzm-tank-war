import { PLAYER_DESTROY_AUDIO } from '../const/AUDIO'
import { BRICK_SIZE } from '../const/SCREEN'
import Tank from './Tank'

export default class HomeTank extends Tank {
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
