import { BATTLE_FIELD } from '../BattleField'

/**
 * @deprecated 判断线段是否重叠，x1 < x2
 * @param {[number, number]} line1
 * @param {[number, number]} line2
 * @returns {boolean}
 */
function isOverlap([a, b], [c, d]) {
  const result =
    // 交叉，端点坐标一定不会相等
    (a < c && c < b && b < d) ||
    (c < a && a < d && d < b) ||
    // 包含，端点坐标至少有一个相等
    (c <= a && b <= d) ||
    (a <= c && d <= b)
  return result
}

export function overlap(a, b, c, d) {
  // 计算两条线段的起点和终点
  let start1 = a
  let end1 = b
  let start2 = c
  let end2 = d

  // 对起点和终点排序,便于计算
  if (start1 > end1) {
    ;[start1, end1] = [end1, start1]
  }
  if (start2 > end2) {
    ;[start2, end2] = [end2, start2]
  }

  // 计算重叠长度
  let overlap = 0
  if (end1 >= start2 && end2 >= start1) {
    overlap = Math.min(end1, end2) - Math.max(start1, start2)
  }
  return overlap
}

/**
 * 获取碰撞物
 * @param {{id?: string, x: number, y: number, width: number, height: number}} target
 * @param {{id: string, x: number, y: number, width: number, height: number}[]} obstacles
 * @returns {{id?: string, x: number, y: number, width: number, height: number}[]}
 */
export function getCollisions(
  target,
  obstacles = [],
  boundary = {
    x: BATTLE_FIELD.OFFSET_X,
    y: BATTLE_FIELD.OFFSET_Y,
    width: BATTLE_FIELD.WIDTH,
    height: BATTLE_FIELD.HEIGHT,
  }
) {
  const collisions = []
  const others = obstacles.filter(obstacle => obstacle.id !== target.id)
  for (const obstacle of others) {
    if (
      overlap(target.x, target.x + target.width, obstacle.x, obstacle.x + obstacle.width) &&
      overlap(target.y, target.y + target.height, obstacle.y, obstacle.y + obstacle.height)
    ) {
      collisions.push(obstacle)
    }
  }
  const collidedBoundary = getCollidedBoundary(target, boundary)
  if (collidedBoundary) {
    collisions.push(collidedBoundary)
  }
  return collisions
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

/**
 * todo 获取碰撞边界
 * @param {x: number, y: number, width: number, height: number} target
 * @param {x: number, y: number, width: number, height: number} boundary
 * @returns {{x?: number, y?: number} | null}
 */
function getCollidedBoundary(target, boundary) {
  if (target.x < boundary.x) {
    return { x: boundary.x }
  } else if (target.x + target.width > boundary.x + boundary.width) {
    return { x: boundary.x + boundary.width - target.width }
  }
  if (target.y < boundary.y) {
    return { y: boundary.y }
  } else if (target.y + target.height > boundary.y + boundary.height) {
    return { y: boundary.y + boundary.height - target.height }
  }
  return null
}
