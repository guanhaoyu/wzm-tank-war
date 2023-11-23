import { POS, RESOURCE_IMAGE } from './const/IMAGE.js'
import Digital from './other/Digital.js'

export default class Scoreboard {
  constructor(context) {
    this.ctx = context
    this.digital = new Digital(this.ctx)
  }

  init(level) {
    this.ctx.drawImage(RESOURCE_IMAGE, POS['score'][0], POS['score'][1], 30, 32, 464, 256, 30, 32) //player1

    this.ctx.drawImage(
      RESOURCE_IMAGE,
      30 + POS['score'][0],
      POS['score'][1],
      30,
      32,
      464,
      304,
      30,
      32
    ) //player2

    //30,32旗帜的size, 464, 352旗帜在canvas中位置
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      60 + POS['score'][0],
      POS['score'][1],
      30,
      32,
      464,
      352,
      32,
      30
    ) //画旗帜

    this.drawLevel(level)
    this.drawLives(0, 1)
    this.drawLives(0, 2)
    this.drawEnemyCount(20)
  }

  drawLevel(level) {
    this.digital.draw(level, 468, 384)
  }

  /**
   * 画坦克的生命数
   * @param {number} lives 生命数
   * @param {1 | 2} which 1、代表玩家1  2、代表玩家2
   */
  drawLives(lives, which) {
    const x = 482
    const y = which === 2 ? 320 : 272
    const size = this.digital.size
    this.ctx.fillStyle = '#7f7f7f'
    this.ctx.fillRect(x, y, size, size)
    this.digital.draw(lives, x, y)
  }

  /**
   * 画右侧敌方坦克数
   * @param {Integer} count 
   */
  drawEnemyCount(count = 0) {
    // 列数
    const colums = 2
    const x = 466
    const y = 34
    const enemySize = 16
    for (let i = 1; i <= count; i++) {
      this.ctx.drawImage(
        RESOURCE_IMAGE,
        92 + POS['score'][0],
        POS['score'][1],
        14,
        14,
        i % colums === 0 ? x + enemySize : x,
        y + parseInt((i + 1) / colums) * enemySize,
        14,
        14
      )
    }
  }
}
