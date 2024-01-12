import { BATTLE_FIELD } from './BattleField'
import { POS, RESOURCE_IMAGE } from './const/IMAGE'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './const/SCREEN'
import Digital from './other/Digital'

const startX = BATTLE_FIELD.OFFSET_X + BATTLE_FIELD.WIDTH
export default class Scoreboard {
  constructor(context) {
    this.ctx = context
    this.digital = new Digital(this.ctx)
    this.posX = POS['score'][0]
    this.posY = POS['score'][1]
  }

  init(level) {
    this.ctx.fillStyle = '#7f7f7f'
    this.ctx.fillRect(startX, 0, SCREEN_WIDTH - startX, SCREEN_HEIGHT)
    // player1 生命值左边的坦克图标
    this.ctx.drawImage(RESOURCE_IMAGE, this.posX, this.posY, 30, 32, 464, 256, 30, 32)
    // player2 生命值左边的坦克图标
    this.ctx.drawImage(RESOURCE_IMAGE, 30 + this.posX, this.posY, 30, 32, 464, 304, 30, 32)
    /**
     * 画旗帜
     * 30,32旗帜的size, 464, 352旗帜在canvas中位置
     */
    this.ctx.drawImage(RESOURCE_IMAGE, 60 + this.posX, this.posY, 30, 32, 464, 352, 32, 30)
    this.drawLevel(level)
  }

  drawLevel(level) {
    this.digital.draw(level, 468, 384)
  }

  /**
   * 画坦克的生命数
   * @param {Integer} lives 生命数
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
   * 清除右侧敌方坦克数，从最下面开始清除
   * @param restEnemy 敌方坦克的总数
   * @param appearEnemy 已出现的敌方坦克数
   */
  drawEnemyCount(restEnemy = 0, appearEnemy = 0) {
    const x = 466
    let y = 34
    const size = this.digital.size
    // 列数
    const colums = 2
    const ENEMY_SIZE = 16
    if (appearEnemy > 0) {
      y = 34 + ENEMY_SIZE
      this.ctx.fillStyle = '#7f7f7f'
      for (let i = 1; i <= appearEnemy; i++) {
        // 涂格子
        this.ctx.fillRect(
          ...calculatePositionInColumns(
            i,
            colums,
            x,
            y,
            ENEMY_SIZE,
            ENEMY_SIZE,
            restEnemy + appearEnemy
          ),
          size,
          size
        )
      }
    } else {
      for (let i = 1; i <= restEnemy; i++) {
        this.ctx.drawImage(
          RESOURCE_IMAGE,
          92 + this.posX,
          this.posY,
          size,
          size,
          ...calculatePositionInColumns(i, colums, x, y, ENEMY_SIZE, ENEMY_SIZE),
          size,
          size
        )
      }
    }
  }
}

/**
 * 画n列，计算每一个元素的位置
 * @param {Integer} i 第几个元素，从第一个（左上角）开始；若反向，则从最后一个（右下角）开始
 * @param {Integer} colums 列数
 * @param {number} x 初始x坐标
 * @param {number} y 初始y坐标
 * @param {number} offsetX 元素间水平距离
 * @param {number} offsetY 元素间垂直距离
 * @param {Integer} total 总共画几个元素，若传该参数则反向画
 * @returns {[number, number]}
 */
function calculatePositionInColumns(i, colums, x, y, offsetX, offsetY, total) {
  const rows = total ? Math.floor((total - i) / colums) : Math.ceil(i / colums)
  return [x + (i % colums) * offsetX, y + rows * offsetY]
}
