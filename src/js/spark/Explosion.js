import { FPS, SPARK_TYPE } from '../const/WORLD.js'
import { calculateCenter } from '../utils/geometry.js'
import Spark from './Spark.js'

export default class Explosion extends Spark {
  constructor(context, type, duration) {
    super(context, type)
    this.durationFrames = duration * FPS
  }

  judgeIsAppeared() {
    this.isAppeared = !(this.frames >= this.durationFrames && this.tick === 0)
  }
}

/**
 * 创建💥
 * @param {'tankBomb' | 'bulletBomb'} type
 */
export function createExplosion(ctx, type, x, y, width, height) {
  const { size, duration } = SPARK_TYPE[type]
  const [cx, cy] = calculateCenter(x, y, width, height)
  const halfSize = size / 2
  new Explosion(ctx, type, duration).create(cx - halfSize, cy - halfSize)
}
