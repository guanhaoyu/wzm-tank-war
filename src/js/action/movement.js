import { DIRECTION } from '../const/WORLD.js'
import { add, sub } from '../utils/decimal.js'

const { UP, DOWN, RIGHT, LEFT } = DIRECTION

/**
 * 位移一次
 * @param {0 | 1 | 2 | 3} direction 方向
 * @param {number} speed 速度
 * @param {number[]} 位置
 * @returns {{x: number, y: number}} 新的位置
 */
export function step(direction, speed, [x, y]) {
  let nextX = x
  let nextY = y
  switch (direction) {
    case UP:
      nextY = sub(y, speed)
      break
    case DOWN:
      nextY = add(y, speed)
      break
    case RIGHT:
      nextX = add(x, speed)
      break
    case LEFT:
      nextX = sub(x, speed)
      break
  }
  return [nextX, nextY]
}
