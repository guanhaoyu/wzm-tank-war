import { move } from '../action/movement.js'
import { POS, RESOURCE_IMAGE } from '../const/IMAGE.js'
import { DIRECTION } from '../const/WORLD.js'
import Spirits from '../spirit/Spirit.js'

export default class Bullet extends Spirits {
  constructor(context) {
    // todo
    super(context, 'bullet')
    this.hit = false
    this.speed = 1

    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
  }
  create(x, y, direction) {
    this.x = x
    this.y = y
    this.direction = direction
  }

  draw() {
    const interval = 6
    let offsetY = 0
    let offsetX = 0
    this.width = 4
    this.height = 5
    if (this.direction === DIRECTION.DOWN) {
      offsetY = 1
    } else if (this.direction === DIRECTION.LEFT) {
      offsetX = 1
      offsetY = 1
      this.width = 5
      this.height = 4
    } else if (this.direction === DIRECTION.RIGHT) {
      offsetY = 1
      this.width = 5
      this.height = 4
    }
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      this.posX + this.direction * interval - offsetX,
      this.posY + offsetY,
      this.width,
      this.height,
      this.x,
      this.y,
      this.width,
      this.height
    )
    this.move()
  }

  move() {
    move.call(this)
  }
}
