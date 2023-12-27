import { POS } from "../const/IMAGE";
import { FPS } from "../const/WORLD";
import Spark, { sparkManager } from "./Spark";

const type = 'prop'
export default class Reward extends Spark {
  constructor(context, index, duration = 30) {
    super(context, type)
    this.durationFrames = duration * FPS
    this.posX = POS[type][0] + index * this.size
    this.posY = POS[type][1]
  }

  get tick() {
    return 0
  }

  draw() {
    super.draw()
    if (this.frames >= this.durationFrames) {
      sparkManager.delete(this.id)
    }
  }
}
