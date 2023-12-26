import { BATTLE_FIELD } from '../const/WORLD.js'
import { isTank } from './ObstacleManager.js'

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
 * @param {{id?: string, x: number, y: number, width: number, height: number, type?: string}} target
 * @param {{id: string, x: number, y: number, width: number, height: number, type?: string}[]} obstacles
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
        let tWidth = target.width
        let tHeight = target.height
        let oWidth = obstacle.width
        let oHeight = obstacle.height
        if (isTank(target) && isTank(obstacle)) {
          tWidth = tHeight = Math.max(tWidth, tHeight)
          oWidth = oHeight = Math.max(oWidth, oHeight)
        }
        
        const resultX = isOverlap([target.x, target.x + tWidth], [obstacle.x, obstacle.x + oWidth])
        const resultY = isOverlap(
          [target.y, target.y + tHeight],
          [obstacle.y, obstacle.y + oHeight]
        )
        return resultX && resultY
      }) || !isInBoundary(target, boundary)
  )
}

window.isOverlap = isOverlap

/**
 * 获取碰撞物
 * @param {{id?: string, x: number, y: number, width: number, height: number}} target
 * @param {{id: string, x: number, y: number, width: number, height: number}[]} obstacles
 * @returns {{id?: string, x: number, y: number, width: number, height: number} | null}
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
  const obstaclesBeyondItself = obstacles.filter(obstacle => obstacle.id !== target.id)
  for (const obstacle of obstaclesBeyondItself) {
    if (
      isOverlap([target.x, target.x + target.width], [obstacle.x, obstacle.x + obstacle.width]) &&
      isOverlap([target.y, target.y + target.height], [obstacle.y, obstacle.y + obstacle.height])
    ) {
      return obstacle
    }
    const collisionBoundary = checkCollisionBoundary(target, boundary)
    if (collisionBoundary) {
      return collisionBoundary
    }
  }
  return null
}

/**
 * 判断是否在边界内
 * @param {x: number, y: number, width: number, height: number} target
 * @param {x: number, y: number, width: number, height: number} boundary
 * @returns {boolean}
 */
export function isInBoundary(target, boundary) {
  // if (target.direction === 1) {
  //   const r1 = target.x >= boundary.x
  //   const r2 = target.x + target.width <= boundary.x + boundary.width
  //   console.log(target.x + target.width, boundary.x + boundary.width, r2)
  //   const r3 = target.y >= boundary.y
  //   const r4 = target.y + target.height <= boundary.y + boundary.height
  //   console.log(r1,r2,r3,r4)
  //   debugger
  // }
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
