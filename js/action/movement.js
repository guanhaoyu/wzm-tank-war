import { DIRECTION } from '../const/WORLD.js'

const { UP, DOWN, RIGHT, LEFT } = DIRECTION

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
