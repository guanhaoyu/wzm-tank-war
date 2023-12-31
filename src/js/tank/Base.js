import { BRICK_SIZE } from "../const/SCREEN";
import Tank from "./Tank";

export default class Base extends Tank {
  constructor(context, task) {
    super(context, 'player')
    this.task = task
  }

  create(x = 224, y = 400) {
    super.create()
    this.isDestroyed = false
    this.x = x
    this.y = y
  }

  get width() {
    return BRICK_SIZE
  }

  get height() {
    return BRICK_SIZE
  }

  move() {}

  shoot() {}

  underAttack() {
    this.destroy()
    setTimeout(this.task, 500);
  }

  draw() {
    this.drawImage()
  }
}