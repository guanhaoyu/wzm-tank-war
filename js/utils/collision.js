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
 * @param {{x: number, y: number, width: number, height: number}} target
 * @param {{x: number, y: number, width: number, height: number}[]} obstacles
 * @returns {boolean}
 */
export default function checkCollision(target, obstacles = []) {
  return obstacles.some(
    obstacle =>
      isOverlap([target.x, target.x + target.width], [obstacle.x, obstacle.x + obstacle.width]) &&
      isOverlap([target.y, target.y + target.height], [obstacle.y, obstacle.y + obstacle.height])
  )
}

/**
 * 判断是否在边界内
 * @param {x: number, y: number, width: number, height: number} target
 * @returns {boolean}
 */
export function isInBoundary(target) {
  return (
    target.x >= BATTLE_FIELD.OFFSET_X &&
    target.x + target.width <= BATTLE_FIELD.OFFSET_X + BATTLE_FIELD.WIDTH &&
    target.y >= BATTLE_FIELD.OFFSET_Y &&
    target.y + target.height <= BATTLE_FIELD.OFFSET_Y + BATTLE_FIELD.HEIGHT
  )
}
