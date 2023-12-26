import { updateCurrentMap } from '../BattleField.js'
import { move, step } from '../action/movement.js'
import { POS, RESOURCE_IMAGE } from '../const/IMAGE.js'
import { DIRECTION, EXPLOSION_TYPE, PLANCK_DISTANCE, TILE_TYPE } from '../const/WORLD.js'
import Explosion from '../other/Explosion.js'
import Spirits from '../spirit/Spirit.js'
import obstacleManager from '../utils/ObstacleManager.js'
import { checkCollision } from '../utils/collision.js'
import { calculateCenter } from '../utils/geometry.js'

const { UP, DOWN, LEFT, RIGHT } = DIRECTION
// 不同阵营的子弹可以对撞，也属于障碍物
export default class Bullet extends Spirits {
  constructor(context, camp) {
    super(context, 'bullet')
    this.speed = 6
    this.camp = camp
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
    this.isDestroyed = false
  }
  // 此处[x, y]是发射器的中心点
  create([x, y], direction, [width, height] = [0, 0]) {
    this.direction = direction
    if (direction === UP) {
      this.x = x - this.width / 2
      this.y = y - height / 2 - this.height
    } else if (direction === DOWN) {
      this.x = x - this.width / 2
      this.y = y + height / 2
    } else if (direction === LEFT) {
      this.x = x - width / 2 - this.width
      this.y = y - this.height / 2
    } else {
      this.x = x + width / 2
      this.y = y - this.height / 2
    }
    obstacleManager.add(this)
  }

  get width() {
    if (this.direction === LEFT || this.direction === RIGHT) {
      return 5
    }
    return 4
  }

  get height() {
    if (this.direction === LEFT || this.direction === RIGHT) {
      return 4
    }
    return 5
  }

  drawImage() {
    const interval = 6
    let offsetY = 0
    let offsetX = 0
    if (this.direction === DOWN) {
      offsetY = 1
    } else if (this.direction === LEFT) {
      offsetX = 1
      offsetY = 1
    } else if (this.direction === RIGHT) {
      offsetY = 1
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
        /**
         * 过滤出不同阵营以解决以下2个问题：
         * 1. 避免友军伤害
         * 2. 坦克刚开炮，下一帧先画的是坦克，由于坦克看不到子弹，就会前进，等到子弹碰撞检测时就会认为撞到了坦克
         */
        obstacleManager.getAll().filter(obstacle => obstacle.camp !== this.camp)
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
    // if (this.direction === UP) {
    //   this.y = obstacle.y + obstacle.height
    // } else if (this.direction === DOWN) {
    //   this.y = obstacle.y
    // } else if (this.direction === LEFT) {
    //   this.x = obstacle.x + obstacle.width
    // } else {
    //   this.x = obstacle.x
    // }
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
        obstacleManager.delete(id)
      }
    }
  }

  createExplosion() {
    const bulletBomb = 'bulletBomb'
    const { size } = EXPLOSION_TYPE[bulletBomb]
    const explosion = new Explosion(this.ctx, bulletBomb)
    const [x, y] = calculateCenter(this.x, this.y, this.width, this.height)
    const halfSize = size / 2
    explosion.create(x - halfSize, y - halfSize)
  }

  destroy() {
    if (!this.isDestroyed) {
      obstacleManager.delete(this.id)
      this.createExplosion()
      this.isDestroyed = true
    }
  }

  isShooted() {
    this.destroy()
  }
}
