import { FPS } from '../const/WORLD'

class InteractiveManager {
  constructor() {
    this.arr = []

    this.isEnemyStop = false
    this.enemyStopTime = 30
    this.enemyStopFrames = 0
  }

  get enemyStopFramesLimit() {
    return this.enemyStopTime * FPS
  }

  stopEnemy(time = 30) {
    this.enemyStopFrames = time
    this.isEnemyStop = true
  }

  unStopEnemy() {
    this.arr.filter(el => el.isAI).forEach(el => (el.isStop = false))
    this.isEnemyStop = false
    this.enemyStopFrames = 0
  }

  destroyAllEnemy() {
    this.arr
      .filter(el => el.isAI && el.isAppear)
      .forEach(el => el.destroy())
  }

  getAll() {
    return this.arr.filter(el => !el.isDestroyed && el.tileType !== 0)
  }

  getAllWithoutBullet() {
    return this.getAll().filter(el => el.type !== 'bullet')
  }

  getTanks(...args) {
    const all = this.getAll()
    if (args.length === 0) {
      return all.filter(isTank)
    }
    return all.filter(el =>
      args.reduce((prev, cur) => prev || el.type?.includes(cur), false)
    )
  }

  add(...args) {
    args.forEach(arg => {
      if (!this.arr.find(el => el.id === arg.id)) {
        this.arr.push(arg)
      }
    })
  }

  clear() {
    this.arr = []
  }

  find(id) {
    return this.arr.find(el => el.id === id)
  }

  handleEnemyStop() {
    if (this.isEnemyStop) {
      this.arr.filter(el => el.isAI).forEach(el => (el.isStop = true))
      this.enemyStopFrames++
      if (this.enemyStopFrames > this.enemyStopFramesLimit) {
        this.unStopEnemy()
      }
    }
  }

  drawSpirits(...args) {
    this.handleEnemyStop()
    this.arr
      .filter(el => el.id?.includes('spirit'))
      .forEach(el => el.draw(...args))
  }
}

export function isTank(target) {
  return target.type?.includes('enemy') || target.type?.includes('player')
}

const interactiveManager = new InteractiveManager()

export default interactiveManager
