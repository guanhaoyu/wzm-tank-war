import { BATTLE_FIELD } from '../const/WORLD.js'

/**
 * 判断线段是否重叠，x1 < x2
 * @param {[number, number]} line1
 * @param {[number, number]} line2
 * @returns {boolean}
 */
function isOverlap([a, b], [c, d]) {
  return (
    (a <= c && c <= b && b <= d) ||
    (c <= a && a <= d && d <= b) ||
    (c <= a && b <= d) ||
    (a <= c && d <= b)
  )
}

/**
 * 碰撞检测V2
 * @param {{id?: Integer, x: number, y: number, width: number, height: number}} target
 * @param {{id: Integer, x: number, y: number, width: number, height: number}[]} obstacles
 * @returns {boolean}
 */
export function isCollision(
  target,
  obstacles = [],
  boundary = {
    x: BATTLE_FIELD.OFFSET_X,
    y: BATTLE_FIELD.OFFSET_Y,
    width: BATTLE_FIELD.WIDTH,
    height: BATTLE_FIELD.HEIGHT,
  }
) {
  return (
    obstacles
      .filter(obstacle => obstacle.id !== target.id)
      .some(
        obstacle =>
          isOverlap(
            [target.x, target.x + target.width],
            [obstacle.x, obstacle.x + obstacle.width]
          ) &&
          isOverlap(
            [target.y, target.y + target.height],
            [obstacle.y, obstacle.y + obstacle.height]
          )
      ) || !isInBoundary(target, boundary)
  )
}

/**
 * 判断是否在边界内
 * @param {x: number, y: number, width: number, height: number} target
 * @param {x: number, y: number, width: number, height: number} boundary
 * @returns {boolean}
 */
export function isInBoundary(target, boundary) {
  return (
    target.x >= boundary.x &&
    target.x + target.width <= boundary.x + boundary.width &&
    target.y >= boundary.y &&
    target.y + target.height <= boundary.y + boundary.height
  )
}
