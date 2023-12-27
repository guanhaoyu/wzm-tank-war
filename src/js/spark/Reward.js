import { protectHome } from '../BattleField'
import { POS } from '../const/IMAGE'
import { FPS } from '../const/WORLD'
import interactiveManager from '../utils/InteractiveManager'
import { checkCollision } from '../utils/collision'
import Spark, { sparkManager } from './Spark'

const type = 'prop'

function addLives(target, count = 1) {
  target.lives += count
}

function stopEnemy() {
  interactiveManager.stopEnemy()
}

function makeGrid() {
  protectHome()
}

function destroyAllEnemy() {
  interactiveManager.destroyAllEnemy()
}

function upgrade(target) {
  target.upgrade()
}

function protect(target) {
  target.isProtected = true
  target.protectedFrames = 0
}

const rewards = [addLives, stopEnemy, makeGrid, destroyAllEnemy, upgrade, protect]

export default class Reward extends Spark {
  constructor(context, index, duration = 30) {
    super(context, type)
    this.durationFrames = duration * FPS
    this.posX = POS[type][0] + index * this.size
    this.posY = POS[type][1]
    this.index = index
  }

  get tick() {
    return 0
  }

  draw() {
    super.draw()
    if (this.frames > this.durationFrames) {
      sparkManager.delete(this.id)
    } else {
      const collisionResult = checkCollision(
        { x: this.x, y: this.y, width: this.size, height: this.size, id: this.id },
        interactiveManager.getTanks().filter(el => el.type?.includes('player'))
      )
      if (collisionResult) {
        rewards[this.index](collisionResult)
        sparkManager.delete(this.id)
      }
    }
  }
}
