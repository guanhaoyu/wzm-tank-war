import { POS, RESOURCE_IMAGE } from "../const/IMAGE.js"
import { SPARK_TYPE } from "../const/WORLD.js"
import sparkManager from "../helper/SparkManager.js"

let id = 0

export default class Spark {
  constructor(context, type) {
    this.ctx = context
    this.type = type
    // duration不一定是spark控制，也可能是tank控制，为了避免通信成本，故不在此获取duration
    const { size, ticks } = SPARK_TYPE[type]
    this.ticks = ticks
    this.size = size
    this.posX = POS[type][0]
    this.posY = POS[type][1]
    this.id = `spark-${id}`
    id++
    this.frames = 0
    this.slowTimes = 3
  }

  create(x, y) {
    this.x = x
    this.y = y
    this.isAppeared = true
    sparkManager.add(this)
  }

  get tick() {
    return Math.floor(this.frames / this.slowTimes) % this.ticks
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
    if (this.isAppeared) {
      this.drawImage()
      this.frames++
      this.judgeIsAppeared()
    }
  }

  judgeIsAppeared() {}
}

