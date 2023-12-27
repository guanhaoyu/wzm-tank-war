import { FPS } from '../const/WORLD'

class ObstacleManager {
  constructor() {
    this.obstacles = []

    this.isEnemyStop = false
    this.enemyStopTime = 30
    this.enemyStopFrames = 0
  }

  get enemyStopFramesLimit() {
    return this.enemyStopTime * FPS
  }

  stopEnemy() {
    this.isEnemyStop = true
    this.obstacles.filter(obstacle => obstacle.isAI).forEach(obstacle => (obstacle.isStop = true))
  }

  unStopEnemy() {
    this.obstacles.filter(obstacle => obstacle.isAI).forEach(obstacle => (obstacle.isStop = false))
    this.isEnemyStop = false
    this.enemyStopFrames = 0
  }

  getAll() {
    return this.obstacles
  }

  getTanks(...args) {
    if (args.length === 0) {
      return this.obstacles.filter(isTank)
    }
    return this.obstacles.filter(obstacle =>
      args.reduce((prev, cur) => prev || obstacle.type?.includes(cur), false)
    )
  }

  add(...args) {
    args.forEach(arg => {
      if (!this.obstacles.find(obstacle => obstacle.id === arg.id)) {
        this.obstacles.push(arg)
      }
    })
  }

  delete(...ids) {
    ids.forEach(id => {
      const index = this.obstacles.findIndex(obstacle => obstacle.id === id)
      if (index > -1) {
        this.obstacles.splice(index, 1)
      } else {
        throw new Error('删除的元素不存在')
      }
    })
  }

  clear() {
    this.obstacles = []
  }

  handleEnemyStop() {
    if (this.isEnemyStop) {
      this.enemyStopFrames++
      if (this.enemyStopFrames > this.enemyStopFramesLimit) {
        this.unStopEnemy()
      }
    }
  }

  drawSpirits(...args) {
    this.handleEnemyStop()
    this.obstacles
      .filter(obstacle => obstacle.id?.includes('spirit'))
      .forEach(obstacle => obstacle.draw(...args))
  }
}

export function isTank(target) {
  return target.type?.includes('enemy') || target.type?.includes('player')
}

const obstacleManager = new ObstacleManager()

export default obstacleManager
