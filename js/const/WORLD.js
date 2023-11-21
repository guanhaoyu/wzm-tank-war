/********************地图块********************/
const WALL = 1
const GRID = 2
const GRASS = 3
const WATER = 4
const ICE = 5
const HOME = 9
const ANOTHREHOME = 8

const TILE_TYPE = {
  WALL,
  GRID,
  GRASS,
  WATER,
  ICE,
  HOME,
  ANOTHREHOME
}

/********************运动的四个方向********************/
const DIRECTION = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3
}
const UP = 0
const DOWN = 1
const LEFT = 2
const RIGHT = 3

const ENEMY_LOCATION = [192, 0, 384] //相对于主游戏区

/********************子弹类型********************/
const BULLET_TYPE_PLAYER = 1
const BULLET_TYPE_ENEMY = 2
/********************爆炸类型********************/
const CRACK_TYPE_TANK = 'tank'
const CRACK_TYPE_BULLET = 'bullet'

export { DIRECTION, TILE_TYPE }
