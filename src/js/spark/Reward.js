import { POS } from '../const/IMAGE'
import { BRICK_SIZE } from '../const/SCREEN'
import { BATTLE_FIELD, FPS } from '../const/WORLD'
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
  rewardManager.consume('protectHome')
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

class RewardManager {
  constructor() {
    this.addRewardInterval = 15 // 15s可能产生一个奖励
    this.addRewardFrames = 0 // 用于添加奖励的计时
    this.addRewardProbability = 0.4 // 一次产生奖励的概率
    this.rewardApproaches = new Map()
  }

  get addRewardFramesLimit() {
    return this.addRewardInterval * FPS
  }

  get existReward() {
    return sparkManager.getReward()
  }

  addReward(context) {
    this.addRewardFrames++
    if (
      this.addRewardFrames % this.addRewardFramesLimit === 0 &&
      Math.random() < this.addRewardProbability &&
      !this.existReward
    ) {
      this.createReward(context)
      this.addRewardFrames = 0
    }
  }

  createReward(context) {
    const reward = new Reward(context, Math.floor(Math.random() * rewards.length))
    reward.create(
      Math.floor(Math.random() * (BATTLE_FIELD.WIDTH - BRICK_SIZE)) + BATTLE_FIELD.OFFSET_X,
      // 确保奖励出现在home上方
      Math.floor(Math.random() * (BATTLE_FIELD.HEIGHT - BRICK_SIZE * 3)) + BATTLE_FIELD.OFFSET_Y
    )
    return reward
  }

  provide(fnName, callback) {
    this.rewardApproaches.set(fnName, callback)
  }

  consume(fnName) {
    const callback = this.rewardApproaches.get(fnName)
    return callback?.()
  }
}

export const rewardManager = new RewardManager()
