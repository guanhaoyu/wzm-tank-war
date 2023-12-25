import { POS, RESOURCE_IMAGE } from './const/IMAGE.js'
import maps from './const/LEVEL.js'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './const/SCREEN.js'
import { BATTLE_FIELD, OBSTACLE_TYPES, TILE_TYPE } from './const/WORLD.js'
import obstacleManager from './utils/ObstacleManager.js'

let currentMap = null

export function updateCurrentMap([i, j], value = 0) {
  currentMap[i][j] = value
}

const { WALL, GRASS, ICE, GRID, WATER, HOME, ANOTHREHOME } = TILE_TYPE
export default class BattleField {
  wTileCount = 26 //主游戏区的宽度地图块数
  hTileCount = 26 //主游戏区的高度地图块数
  tileSize = 16 //地图块的大小
  homeSize = 32 //家图标的大小

  offsetX = BATTLE_FIELD.OFFSET_X //主游戏区的X偏移量
  offsetY = BATTLE_FIELD.OFFSET_Y //主游戏区的Y偏移量
  width = BATTLE_FIELD.WIDTH
  height = BATTLE_FIELD.HEIGHT

  mapPos = POS['map']

  homePosX = POS['home'][0]
  homePosY = POS['home'][1]

  constructor(wallCtx, grassCtx) {
    this.wallCtx = wallCtx
    this.grassCtx = grassCtx
  }

  setLevel(level = 1) {
    this.level = level
    currentMap = maps[Math.max(level - 1, 0)]
  }

  draw() {
    this.wallCtx.fillStyle = '#7f7f7f'
    this.wallCtx.fillRect(0, 0, this.offsetX + this.width, this.height + this.offsetY * 2)
    this.wallCtx.fillStyle = '#000'
    this.wallCtx.fillRect(this.offsetX, this.offsetY, this.width, this.height) //主游戏区

    this.grassCtx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

    for (let i = 0; i < this.hTileCount; i++) {
      for (let j = 0; j < this.wTileCount; j++) {
        const current = currentMap[i][j]
        const id = `${current}-${i}-${j}`
        if (current === WALL || current === GRID || current === WATER || current === ICE) {
          this.wallCtx.drawImage(
            RESOURCE_IMAGE,
            this.tileSize * (current - 1) + this.mapPos[0],
            this.mapPos[1],
            this.tileSize,
            this.tileSize,
            j * this.tileSize + this.offsetX,
            i * this.tileSize + this.offsetY,
            this.tileSize,
            this.tileSize
          )
          if (OBSTACLE_TYPES.includes(current)) {
            obstacleManager.add({
              id,
              x: j * this.tileSize + this.offsetX,
              y: i * this.tileSize + this.offsetY,
              width: this.tileSize,
              height: this.tileSize,
            })
          }
        } else if (current === GRASS) {
          this.grassCtx.drawImage(
            RESOURCE_IMAGE,
            this.tileSize * (current - 1) + this.mapPos[0],
            this.mapPos[1],
            this.tileSize,
            this.tileSize,
            j * this.tileSize + this.offsetX,
            i * this.tileSize + this.offsetY,
            this.tileSize,
            this.tileSize
          )
        } else if (current === HOME) {
          this.wallCtx.drawImage(
            RESOURCE_IMAGE,
            this.homePosX,
            this.homePosY,
            this.homeSize,
            this.homeSize,
            j * this.tileSize + this.offsetX,
            i * this.tileSize + this.offsetY,
            this.homeSize,
            this.homeSize
          )
        }
      }
    }
  }
}
