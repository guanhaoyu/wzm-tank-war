import { updateCurrentMap } from '../BattleField'
import { BULLET_DESTROY_AUDIO } from '../const/AUDIO'
import { RESOURCE_IMAGE } from '../const/IMAGE'
import { CAMP, DIRECTION, PLANCK_LENGTH, TILE_TYPE } from '../const/WORLD'
import { createExplosion } from '../spark/Explosion'
import Spirit from '../spirit/Spirit'
import interactiveManager from '../helper/InteractiveManager'
import { getCollisions } from '../utils/collision'
import { add, sub } from '../utils/decimal'
import { step } from '../utils/geometry'

const { UP, DOWN, LEFT, RIGHT } = DIRECTION
// 不同阵营的子弹可以对撞，也属于障碍物
export default class Bullet extends Spirit {
  constructor(context, camp) {
    super(context, 'bullet')
    // 不能超过16，否则能打穿2个墙
    this.speed = 6
    this.camp = camp
    // 避免多次调用destroy方法
    this.isDestroyed = false
  }
  // 此处[x, y]是发射器的中心点
  create([x, y], direction, [width, height] = [0, 0]) {
    this.direction = direction
    if (direction === UP) {
      this.x = sub(x, this.width / 2)
      this.y = sub(y, this.height / 2, this.height)
    } else if (direction === DOWN) {
      this.x = sub(x, this.width / 2)
      this.y = add(y, height / 2)
    } else if (direction === LEFT) {
      this.x = sub(x, width / 2, this.width)
      this.y = sub(y, this.height / 2)
    } else {
      this.x = add(x, width / 2)
      this.y = sub(y, this.height / 2)
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
    for (let i = 0; i < this.speed; i = i + PLANCK_LENGTH) {
      const [x, y] = step(this.direction, PLANCK_LENGTH, [this.x, this.y])
      const collisions = getCollisions(
        { x, y, width: this.width, height: this.height, id: this.id },
        /**
         * 过滤出不同阵营以解决以下2个问题：
         * 1. 避免友军伤害
         * 2. 坦克刚开炮，下一帧先画的是坦克，由于坦克看不到子弹，就会前进，等到子弹碰撞检测时就会认为撞到了坦克
         */
        interactiveManager.getList(el => el.camp !== this.camp && el.tileType !== TILE_TYPE.WATER),
      )
      if (collisions.length) {
        this.collide(collisions)
      } else {
        this.x = x
        this.y = y
      }
    }
  }

  collide(targets) {
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
    targets.forEach(target => {
      if (typeof target.isShooted === 'function') {
        target.isShooted(this.id)
      } else {
        this.damage(target)
      }
    })
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
      createExplosion(this.ctx, 'bulletBomb', this.x, this.y, this.width, this.height, BULLET_DESTROY_AUDIO.duration)
      this.isDestroyed = true
      if (this.camp === CAMP.PLAYER) {
        BULLET_DESTROY_AUDIO.play()
      }
    }
  }

  isShooted() {
    this.destroy()
  }
}
