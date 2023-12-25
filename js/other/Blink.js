import Explosion, { explosionManager } from './Explosion.js'

export default class Blink extends Explosion {
  constructor(context) {
    super(context, 'enemyBefore')
    this.slowTimes = 5
    this.isOver = false
  }
  afterDraw(tick) {
    if (this.durationFrames <= this.frames && (tick === 0 || tick === this.seriesLength - 1)) {
      this.isOver = true
      explosionManager.delete(this.id)
    }
  }
}
