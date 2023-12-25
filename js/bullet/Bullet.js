import { updateCurrentMap } from '../BattleField.js'
import { move, step } from '../action/movement.js'
import { POS, RESOURCE_IMAGE } from '../const/IMAGE.js'
import { DIRECTION, EXPLOSION_TYPE, PLANCK_DISTANCE, TILE_TYPE } from '../const/WORLD.js'
import Explosion from '../other/Explosion.js'
import Spirits from '../spirit/Spirit.js'
import obstacleManager from '../utils/ObstacleManager.js'
import { checkCollision } from '../utils/collision.js'

// 不同阵营的子弹可以对撞，也属于障碍物
export default class Bullet extends Spirits {
  constructor(context, camp) {
    // todo
    super(context, 'bullet')
    this.speed = 0.5
    this.camp = camp
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
  }
  create(x, y, direction) {
    this.x = x
    this.y = y
    this.direction = direction
    obstacleManager.add(this)
  }

  drawImage() {
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
  }

  draw() {
    this.drawImage()
    this.move()
  }

  move() {
    for (let i = 0; i < this.speed; i = i + PLANCK_DISTANCE) {
      const [x, y] = step(this.direction, PLANCK_DISTANCE, [this.x, this.y])
      const collisionResult = checkCollision(
        { x, y, width: this.width, height: this.height, id: this.id },
        obstacleManager.getAll()
      )
      if (collisionResult) {
        this.onCollision(collisionResult)
      } else {
        this.x = x
        this.y = y
      }
    }
  }

  onCollision(obstacle) {
    if (this.direction === DIRECTION.UP) {
      this.y = obstacle.y + obstacle.height
    } else if (this.direction === DIRECTION.DOWN) {
      this.y = obstacle.y
    } else if (this.direction === DIRECTION.LEFT) {
      this.x = obstacle.x + obstacle.width
    } else {
      this.x = obstacle.x
    }
    this.destroy()
    if (typeof obstacle.isShooted === 'function') {
      obstacle.isShooted()
    } else {
      this.damage(obstacle.id)
    }
  }

  damage(id) {
    if (id) {
      const [tile, i, j] = id.split('-')
      if (parseInt(tile) === TILE_TYPE.WALL) {
        updateCurrentMap([i, j])
      }
    }
  }

  createExplosion() {
    const bulletBomb = 'bulletBomb'
    const { size } = EXPLOSION_TYPE[bulletBomb]
    const explosion = new Explosion(this.ctx, bulletBomb)
    explosion.create(this.x + this.width / 2 - size / 2, this.y + this.height / 2 - size / 2)
  }

  destroy() {
    obstacleManager.delete(this.id)
    this.createExplosion()
  }

  isShooted() {
    this.destroy()
  }
}
