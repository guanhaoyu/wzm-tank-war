import { FPS, SPARK_TYPE } from '../const/WORLD.js'
import Spark, { sparkManager } from './Spark.js'

const type = 'enemyBefore'
export default class Blink extends Spark {
  constructor(context, duration = SPARK_TYPE[type].duration) {
    super(context, type)
    this.durationFrames = duration * FPS
    this.slowTimes = 5
    this.isOver = false
  }

  draw() {
    super.draw()
    if (this.frames >= this.durationFrames && (this.tick === 0 || this.tick === this.ticks - 1)) {
      this.isOver = true
      sparkManager.delete(this.id)
    }
  }
}
