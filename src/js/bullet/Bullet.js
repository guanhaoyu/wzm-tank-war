import { updateCurrentMap } from '../BattleField.js'
import { step } from '../action/movement.js'
import { POS, RESOURCE_IMAGE } from '../const/IMAGE.js'
import { DIRECTION, PLANCK_DISTANCE, TILE_TYPE } from '../const/WORLD.js'
import { createExplosion } from '../spark/Explosion.js'
import Spirits from '../spirit/Spirit.js'
import interactiveManager from '../utils/InteractiveManager.js'
import { checkCollision } from '../utils/collision.js'

const { UP, DOWN, LEFT, RIGHT } = DIRECTION
// 不同阵营的子弹可以对撞，也属于障碍物
export default class Bullet extends Spirits {
  constructor(context, camp) {
    super(context, 'bullet')
    // 不能超过16，否则有能打穿2个墙
    this.speed = 10
    this.camp = camp
    this.posX = POS[this.type][0]
    this.posY = POS[this.type][1]
    // 避免多次调用destroy方法
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
    interactiveManager.add(this)
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
    if (!this.isDestroyed) {
      this.drawImage()
      this.move()
    }
  }

  move() {
    for (let i = 0; i < this.speed; i = i + PLANCK_DISTANCE) {
      const [x, y] = step(this.direction, PLANCK_DISTANCE, [this.x, this.y])
      const collisionTarget = checkCollision(
        { x, y, width: this.width, height: this.height, id: this.id },
        /**
         * 过滤出不同阵营以解决以下2个问题：
         * 1. 避免友军伤害
         * 2. 坦克刚开炮，下一帧先画的是坦克，由于坦克看不到子弹，就会前进，等到子弹碰撞检测时就会认为撞到了坦克
         */
        interactiveManager.getAll().filter(el => el.camp !== this.camp && el.tileType !== TILE_TYPE.WATER),
      )
      if (collisionTarget) {
        this.collide(collisionTarget)
      } else {
        this.x = x
        this.y = y
      }
    }
  }

  collide(obstacle) {
    // 子弹撞到障碍物，吸附到障碍物上再爆炸
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
      obstacle.isShooted(this.id)
    } else {
      this.damage(obstacle)
    }
  }

  damage(tile) {
    if (tile?.id) {
      const [_, i, j] = tile.id.split('-')
      if (tile.tileType === TILE_TYPE.WALL) {
        updateCurrentMap([i, j])
      }
    }
  }

  destroy() {
    if (!this.isDestroyed) {
      createExplosion(this.ctx, 'bulletBomb', this.x, this.y, this.width, this.height)
      this.isDestroyed = true
    }
  }

  isShooted() {
    this.destroy()
  }
}
