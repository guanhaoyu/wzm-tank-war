import { FPS } from '../const/WORLD'

class InteractiveManager {
  constructor() {
    this.list = []

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
    this.list.filter(el => el.isAI).forEach(el => (el.isStop = false))
    this.isEnemyStop = false
    this.enemyStopFrames = 0
  }

  destroyAppearedEnemy() {
    this.list.filter(el => el.isAI && el.isAppeared).forEach(el => el.destroy())
  }

  getList(filter) {
    const list = this.list.filter(el => !el.isDestroyed && el.tileType !== 0)
    if (typeof filter === 'function') {
      return list.filter(filter)
    }
    return list
  }

  getListWithoutBullet() {
    return this.getList(el => el.type !== 'bullet')
  }

  getTanks(...args) {
    const list = this.getList(isTank)
    if (args.length === 0) {
      return list
    }
    return list.filter(tank =>
      args.reduce((prev, type) => prev || tank.type?.includes(type), false)
    )
  }

  add(...args) {
    args.forEach(arg => {
      if (!this.list.find(el => el.id === arg.id)) {
        this.list.push(arg)
      }
    })
  }

  clear() {
    this.list = []
  }

  find(id) {
    return this.list.find(el => el.id === id)
  }

  handleEnemyStop() {
    if (this.isEnemyStop) {
      this.list.filter(el => el.isAI).forEach(el => (el.isStop = true))
      this.enemyStopFrames++
      if (this.enemyStopFrames >= this.enemyStopFramesLimit) {
        this.unStopEnemy()
      }
    }
  }

  drawSpirits(...args) {
    this.handleEnemyStop()
    this.list.filter(el => el.id?.includes('spirit')).forEach(el => el.draw(...args))
  }
}

export function isTank(target) {
  return target.type?.includes('enemy') || target.type?.includes('player')
}

const interactiveManager = new InteractiveManager()
export default interactiveManager
