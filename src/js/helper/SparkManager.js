
class SparkManager {
  constructor() {
    this.sparks = []
  }
  
  getReward() {
    return this.sparks.find(spark => spark.type === 'prop')
  }

  add(...args) {
    args.forEach(arg => {
      if (!this.sparks.find(spark => spark.id === arg.id)) {
        this.sparks.push(arg)
      }
    })
  }

  clear() {
    this.sparks = []
  }

  draw() {
    this.sparks.forEach(spark => spark.draw())
  }
}

const sparkManager = new SparkManager()
export default sparkManager
