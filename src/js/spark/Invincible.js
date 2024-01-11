import { RESOURCE_IMAGE } from "../const/IMAGE";
import { sub } from "../utils/decimal";
import Spark from "./Spark";

export default class Invincible extends Spark {
  constructor(context) {
    super(context, 'protected')
    this.slowTimes = 9
  }

  setLocation(x, y, width, height) {
    this.x = sub(x, sub(this.size, width) / 2)
    this.y = sub(y, sub(this.size, height) / 2)
  }

  drawImage() {
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      this.posX,
      this.posY+ this.tick * this.size,
      this.size,
      this.size,
      this.x,
      this.y,
      this.size,
      this.size
    )
  }

  judgeIsAppeared() {}
}
