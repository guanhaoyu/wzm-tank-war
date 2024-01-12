import { REWARD_AUDIO } from '../const/AUDIO'
import { POS } from '../const/IMAGE'
import { FPS } from '../const/WORLD'
import interactiveManager from '../helper/InteractiveManager'
import { rewards } from '../helper/RewardManager'
import { getCollisions } from '../utils/collision'
import Spark from './Spark'

export default class Reward extends Spark {
  constructor(context, index, duration = 30) {
    super(context, 'prop')
    this.durationFrames = duration * FPS
    this.posX = POS[this.type][0] + index * this.size
    this.posY = POS[this.type][1]
    this.index = index
  }

  get tick() {
    return 0
  }

  judgeIsAppeared() {
    if (this.frames >= this.durationFrames) {
      this.isAppeared = false
    } else {
      const collisions = getCollisions(
        { x: this.x, y: this.y, width: this.size, height: this.size, id: this.id },
        interactiveManager.getTanks('player')
      )
      if (collisions.length) {
        REWARD_AUDIO.play()
        collisions.forEach(collision => {
          rewards[this.index](collision)
        })
        this.isAppeared = false
      }
    }
  }
}
