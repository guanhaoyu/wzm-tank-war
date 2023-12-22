class ObstacleManager {
  constructor() {
    this.obstacles = []
  }

  getObstacles() {
    return this.obstacles
  }

  add(...args) {
    args.forEach(arg => {
      if (!this.obstacles.find(obstacle => obstacle.id === arg.id)) {
        this.obstacles.push(arg)
      }
    })
  }

  remove(...ids) {
    ids.forEach(id => {
      const index = this.obstacles.findIndex(obstacle => obstacle.id === id)
      this.obstacles.splice(index, 1)
    })
  }

  clear() {
    this.obstacles = []
  }
}

const obstacleManager = new ObstacleManager()

export default obstacleManager
