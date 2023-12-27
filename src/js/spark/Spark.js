import { POS, RESOURCE_IMAGE } from "../const/IMAGE.js"
import { SPARK_TYPE, FPS } from "../const/WORLD.js"
import { calculateCenter } from "../utils/geometry.js"

let id = 0

export default class Spark {
  constructor(context, type) {
    this.ctx = context
    this.type = type
    const { size, ticks } = SPARK_TYPE[type]
    this.ticks = ticks
    this.size = size
    this.posX = POS[type][0]
    this.posY = POS[type][1]
    this.id = `spark-${id}`
    id++
    this.frames = -1
    this.slowTimes = 3
  }

  create(x, y) {
    this.x = x
    this.y = y
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
    this.frames++
    this.drawImage()
  }
}

class SparkManager {
  constructor() {
    this.arr = []
  }

  add(...args) {
    args.forEach(arg => {
      if (!this.arr.find(el => el.id === arg.id)) {
        this.arr.push(arg)
      }
    })
  }

  delete(...ids) {
    ids.forEach(id => {
      const index = this.arr.findIndex(el => el.id === id)
      if (index > -1) {
        this.arr.splice(index, 1)
      } else {
        throw new Error('删除的元素不存在')
      }
    })
  }

  clear() {
    this.arr = []
  }

  draw() {
    this.arr.forEach(el => {
      el.draw()
    })
  }
}

export const sparkManager = new SparkManager()