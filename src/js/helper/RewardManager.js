import { BATTLE_FIELD } from "../BattleField"
import { BRICK_SIZE } from "../const/SCREEN"
import { FPS } from "../const/WORLD"
import Reward from "../spark/Reward"
import interactiveManager from "./InteractiveManager"
import sparkManager from "./SparkManager"

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
  interactiveManager.destroyAppearedEnemy()
}

function upgrade(target) {
  target.upgrade()
}

function protect(target) {
  target.isProtected = true
  target.protectedFrames = 0
}

export const rewards = [addLives, stopEnemy, makeGrid, destroyAllEnemy, upgrade, protect]

class RewardManager {
  constructor() {
    this.addRewardInterval = 15 // 15s可能产生一个奖励
    this.addRewardFrames = 0 // 用于添加奖励的计时
    this.addRewardProbability = 0.4 // 一次产生奖励的概率
    this.rewardWays = new Map()
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
    this.rewardWays.set(fnName, callback)
  }

  consume(fnName) {
    const callback = this.rewardWays.get(fnName)
    return callback?.()
  }
}

const rewardManager = new RewardManager()
export default rewardManager
