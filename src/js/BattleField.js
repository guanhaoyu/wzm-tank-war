import { POS, RESOURCE_IMAGE } from './const/IMAGE.js'
import maps from './const/LEVEL.js'
import { BRICK_SIZE, SCREEN_HEIGHT, SCREEN_WIDTH } from './const/SCREEN.js'
import { BATTLE_FIELD, FPS, OBSTACLE_TYPES, TILE_TYPE } from './const/WORLD.js'
import { rewardManager } from './spark/Reward.js'
import interactiveManager from './utils/InteractiveManager.js'
import { isCollided } from './utils/collision.js'

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

/**
 * 更新当前关卡的地图数组，该功能是独立的，和BattleField没有关系
 * @param {[Integer, Integer]} arr
 * @param {Integer} value
 */
export function updateCurrentMap([i, j], value = 0) {
  currentMap[i][j] = value
  const id = `tile-${i}-${j}`
  const target = interactiveManager.find(id)
  /**
   * 如果已经存于interactiveManager中且tileType发生了变化，则将旧的删除
   * 新的会在BattleField的draw中添加
   */
  if (target) {
    target.tileType = value
  }
}

/**
 * 改变地砖的类型
 * @param {[Integer, Integer]} tiles
 * @param {Integer} tileType
 */
function changeTypeOfTiles(tiles, tileType) {
  tiles.forEach(tile => updateCurrentMap(tile, tileType))
}

const { WALL, GRASS, ICE, GRID, WATER, HOME, ANOTHERHOME } = TILE_TYPE
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

    this.isHomeProtected = false
    this.homeProtectTime = 5
    this.homeProtectFrames = 0

    rewardManager.provide('protectHome', this.protectHome.bind(this))
  }

  get homeProtectFramesLimit() {
    return this.homeProtectTime * FPS
  }

  get homeBoundaryCoordinates() {
    const first = homeBoundary[0]
    const last = homeBoundary[homeBoundary.length - 1]
    const width = (last[1] - first[1]) * BRICK_SIZE
    const height = (last[0] - first[0]) * BRICK_SIZE
    const [x, y] = this.positionToCoordinates(first[0], first[1])
    return { x, y, width, height }
  }

  protectHome(time) {
    const result = interactiveManager.getTanks().some(tank => isCollided(tank, [this.homeBoundaryCoordinates]))
    if (result) {
      requestAnimationFrame(this.protectHome.bind(this, time))
    } else {
      this.homeProtectTime = time || this.homeProtectTime
      this.homeProtectFrames = 0
      this.isHomeProtected = true
      changeTypeOfTiles(homeBoundary, TILE_TYPE.GRID)
    }
  }

  positionToCoordinates(i, j) {
    return [j * this.tileSize + this.offsetX, i * this.tileSize + this.offsetY]
  }

  cancelProtectHome() {
    this.isHomeProtected = false
    this.homeProtectFrames = 0
    changeTypeOfTiles(homeBoundary, TILE_TYPE.WALL)
  }

  setLevel(level = 1) {
    this.level = level
    currentMap = maps[Math.max(level - 1, 0)]
  }

  draw() {
    if (this.isHomeProtected) {
      this.homeProtectFrames++
      if (this.homeProtectFrames >= this.homeProtectFramesLimit) {
        this.cancelProtectHome()
      }
    }
    this.wallCtx.fillStyle = '#7f7f7f'
    this.wallCtx.fillRect(0, 0, this.offsetX + this.width, this.height + this.offsetY * 2)
    this.wallCtx.fillStyle = '#000'
    this.wallCtx.fillRect(this.offsetX, this.offsetY, this.width, this.height) //主游戏区

    this.grassCtx.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)

    for (let i = 0; i < this.hTileCount; i++) {
      for (let j = 0; j < this.wTileCount; j++) {
        const tileType = currentMap[i][j]
        const id = `tile-${i}-${j}`
        if (tileType === WALL || tileType === GRID || tileType === WATER || tileType === ICE) {
          this.wallCtx.drawImage(
            RESOURCE_IMAGE,
            this.tileSize * (tileType - 1) + this.mapPos[0],
            this.mapPos[1],
            this.tileSize,
            this.tileSize,
            j * this.tileSize + this.offsetX,
            i * this.tileSize + this.offsetY,
            this.tileSize,
            this.tileSize
          )
        } else if (tileType === GRASS) {
          this.grassCtx.drawImage(
            RESOURCE_IMAGE,
            this.tileSize * (tileType - 1) + this.mapPos[0],
            this.mapPos[1],
            this.tileSize,
            this.tileSize,
            j * this.tileSize + this.offsetX,
            i * this.tileSize + this.offsetY,
            this.tileSize,
            this.tileSize
          )
        } else if (tileType === HOME) {
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
        if (OBSTACLE_TYPES.includes(tileType)) {
          interactiveManager.add({
            id,
            tileType,
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
