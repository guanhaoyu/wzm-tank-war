import { FPS } from '../const/WORLD'
import Spark from './Spark'

export default class Blink extends Spark {
  constructor(context, duration = 0.68) {
    super(context, 'enemyBefore')
    this.durationFrames = duration * FPS
    this.slowTimes = 5
  }

  judgeIsAppeared() {
    this.isAppeared = !(
      this.frames >= this.durationFrames &&
      (this.tick === 0 || this.tick === this.ticks - 1)
    )
  }
}
