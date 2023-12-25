import { BATTLE_FIELD } from '../const/WORLD.js'

/**
 * 判断线段是否重叠，x1 < x2
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

/**
 * 碰撞检测V2
 * @param {{id?: string, x: number, y: number, width: number, height: number}} target
 * @param {{id: string, x: number, y: number, width: number, height: number}[]} obstacles
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
      .some(obstacle => {
        const result =
          isOverlap(
            [target.x, target.x + target.width],
            [obstacle.x, obstacle.x + obstacle.width]
          ) &&
          isOverlap(
            [target.y, target.y + target.height],
            [obstacle.y, obstacle.y + obstacle.height]
          )
        return result
      }) || !isInBoundary(target, boundary)
  )
}

/**
 * 获取碰撞物
 * @param {{id?: string, x: number, y: number, width: number, height: number}} target
 * @param {{id: string, x: number, y: number, width: number, height: number}[]} obstacles
 * @returns {{id?: string, x?: number, y?: number, width?: number, height?: number}[]}
 */
export function checkCollision(
  target,
  obstacles = [],
  boundary = {
    x: BATTLE_FIELD.OFFSET_X,
    y: BATTLE_FIELD.OFFSET_Y,
    width: BATTLE_FIELD.WIDTH,
    height: BATTLE_FIELD.HEIGHT,
  }
) {
  const collisionObstacles = [];
  const obstaclesBeyondItself = obstacles.filter(obstacle => obstacle.id !== target.id)
  for (const obstacle of obstaclesBeyondItself) {
    if (
      isOverlap(
        [target.x, target.x + target.width],
        [obstacle.x, obstacle.x + obstacle.width]
      ) &&
      isOverlap(
        [target.y, target.y + target.height],
        [obstacle.y, obstacle.y + obstacle.height]
      )
    ) {
      collisionObstacles.push(obstacle)
    }
  }
  collisionObstacles.push(checkCollision(target, boundary))
  return collisionObstacles.filter(Boolean)
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
export function checkCollisionBoundary(target, boundary) {
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
