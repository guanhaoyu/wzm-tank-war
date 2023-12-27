import { RESOURCE_IMAGE } from "../const/IMAGE";
import Spark from "./Spark";

export default class Invincible extends Spark {
  constructor(context) {
    super(context, 'protected')
    this.isOver = false
    this.slowTimes = 8
  }

  drawImage() {
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      this.posX + this.tick * this.size,
      this.posY,
      this.size,
      this.size,
      this.x,
      this.y,
      this.size,
      this.size
    )
  }

  draw() {
    if (!this.isOver) {
      super.draw()
    }
  }
}
