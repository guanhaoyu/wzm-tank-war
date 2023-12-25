import { DIRECTION } from '../const/WORLD.js'
import obstacleManager from '../utils/ObstacleManager.js'
import { isCollision } from '../utils/collision.js'

const { UP, DOWN, RIGHT, LEFT } = DIRECTION

const PLANCK = 0.5

/**
 * 位移一次
 * @param {0 | 1 | 2 | 3} direction 方向
 * @param { number } speed 速度
 * @param {number[]} 位置
 * @returns {{x: number, y: number}} 新的位置
 */
export function step(direction, speed, [x, y]) {
  let nextX = x
  let nextY = y
  switch (direction) {
    case UP:
      nextY = y - speed
      break
    case DOWN:
      nextY = y + speed
      break
    case RIGHT:
      nextX = x + speed
      break
    case LEFT:
      nextX = x - speed
      break
  }
  return [nextX, nextY]
}

export function move(onAccess, onCollision, afterMove) {
  let voyage = 0
  for (let i = 0; i < this.speed; i = i + PLANCK) {
    const [x, y] = step(this.direction, PLANCK, [this.x, this.y])
    const isCollisionResult = isCollision(
      { x, y, width: this.width, height: this.height, id: this.id },
      obstacleManager.getObstacles()
    )
    if (!isCollisionResult) {
      this.x = x
      this.y = y
      voyage += PLANCK
    } else {
      onCollision?.()
    }
  }
  if (voyage === this.speed) {
    onAccess?.()
  }
  afterMove?.()
}
