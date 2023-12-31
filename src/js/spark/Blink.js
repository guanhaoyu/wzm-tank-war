import { FPS, SPARK_TYPE } from '../const/WORLD.js'
import Spark from './Spark.js'

export default class Blink extends Spark {
  constructor(context, duration) {
    super(context, 'enemyBefore')
    this.durationFrames = (duration || SPARK_TYPE[this.type].duration) * FPS
    this.slowTimes = 5
  }

  judgeIsAppeared() {
    this.isAppeared = !(
      this.frames >= this.durationFrames &&
      (this.tick === 0 || this.tick === this.ticks - 1)
    )
  }
}
