/********************地图块********************/
const WALL = 1
const GRID = 2
const GRASS = 3
const WATER = 4
const ICE = 5
const FLAG = 6
const HOME = 9
const ANOTHERHOME = 8

const OBSTACLE_TYPES = [WALL, GRID, WATER, HOME, ANOTHERHOME]

const TILE_TYPE = {
  WALL,
  GRID,
  GRASS,
  WATER,
  ICE,
  HOME,
  ANOTHERHOME,
  FLAG
}

/********************运动的四个方向********************/
const DIRECTION = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
}

/********************每秒帧数********************/
const FPS = 60

/********************最小距离********************/
const PLANCK_LENGTH = 0.1

/********************星火类型********************/
const SPARK_TYPE = {
  bulletBomb: {
    size: 32,
    ticks: 3
  },
  tankBomb: {
    size: 66,
    ticks: 4
  },
  enemyBefore: {
    size: 32,
    ticks: 7
  },
  protected: {
    size: 32,
    ticks: 2
  },
  prop: {
    size: 30,
    ticks: 1
  }
}

/********************阵营类型********************/
const CAMP = {
  PLAYER: 0,
  ENEMY: 1,
}

export {
  SPARK_TYPE,
  OBSTACLE_TYPES,
  DIRECTION,
  TILE_TYPE,
  FPS,
  PLANCK_LENGTH,
  CAMP
}
