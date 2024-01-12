import { FPS, SPARK_TYPE } from '../const/WORLD'
import { sub } from '../utils/decimal'
import { calculateCenter } from '../utils/geometry'
import Spark from './Spark'

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
export function createExplosion(ctx, type, x, y, width, height, duration) {
  const [cx, cy] = calculateCenter(x, y, width, height)
  const halfSize = SPARK_TYPE[type].size / 2
  const explosion = new Explosion(ctx, type, duration)
  explosion.create(sub(cx, halfSize), sub(cy, halfSize))
  return explosion
}
