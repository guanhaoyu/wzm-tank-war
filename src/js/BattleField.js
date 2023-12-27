import { POS, RESOURCE_IMAGE } from './const/IMAGE.js'
import maps from './const/LEVEL.js'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './const/SCREEN.js'
import { BATTLE_FIELD, FPS, OBSTACLE_TYPES, TILE_TYPE } from './const/WORLD.js'
import interactiveManager from './utils/InteractiveManager.js'

let currentMap = null

const homeBoundary = [
  [23, 11],
  [23, 12],
  [23, 13],
  [23, 14],
  [24, 11],
  [24, 14],
  [25, 11],
  [25, 14],
]

export function updateCurrentMap([i, j], value = 0) {
  currentMap[i][j] = value
}

let homeIsProtected = false
let homeProtectTime = 25
let homeProtectFrames = 0

function getHomeProtectFramesLimit() {
  return homeProtectTime * FPS
}

export function protectHome(time = 25) {
  homeProtectTime = time
  homeProtectFrames = 0
  homeIsProtected = true
  homeBoundary.forEach(el => {
    const target = interactiveManager.getAll().find(obstacle => {
      const [tile, i, j] = obstacle.id.split('-')
      return tile == TILE_TYPE.WALL && el[0] == i && el[1] == j
    })
    if (target?.id) {
      interactiveManager.delete(target.id)
    }
    updateCurrentMap(el, TILE_TYPE.GRID)
  })
}

function cancelProtectHome() {
  homeIsProtected = false
  homeProtectFrames = 0
  homeBoundary.forEach(el => {
    const target = interactiveManager.getAll().find(obstacle => {
      const [tile, i, j] = obstacle.id.split('-')
      return tile == TILE_TYPE.GRID && el[0] == i && el[1] == j
    })
    if (target?.id) {
      interactiveManager.delete(target.id)
    }
    updateCurrentMap(el, TILE_TYPE.WALL)
  })
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
    if (homeIsProtected) {
      homeProtectFrames++
      if (homeProtectFrames > getHomeProtectFramesLimit()) {
        cancelProtectHome()
      }
    }
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
        if (OBSTACLE_TYPES.includes(current)) {
          interactiveManager.add({
            id,
            x: j * this.tileSize + this.offsetX,
            y: i * this.tileSize + this.offsetY,
            width: this.tileSize,
            height: this.tileSize,
          })
        }
      }
    }
  }
}
