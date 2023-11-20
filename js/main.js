import { SCREEN_HEIGHT, SCREEN_WIDTH } from './const/SCREEN.js'
import Menu from './layer/Menu.js'
import { GAME_STATE_INIT, GAME_STATE_MENU } from './const/GAMESTATE.js'
import KEYBOARD from './const/KEYBOARD.js'
import Game from './Game.js'

document.addEventListener('DOMContentLoaded', function () {
  const game = new Game()
  game.run()
})

// 画笔
let stageCtx // 舞台画布
let wallCtx // 地图画布
let grassCtx // 草地画布
let tankCtx // 坦克画布
let overCtx // 结束画布

let menu = null // 菜单
let stage = null // 舞台
let map = null // 地图
let player1 = null // 玩家1
let player2 = null // 玩家2
let prop = null
let enemyArray = [] // 敌方坦克
let bulletArray = [] // 子弹数组
let keys = [] // 记录按下的按键
let crackArray = [] // 爆炸数组

let gameState = GAME_STATE_MENU // 默认菜单状态
let level = 1
let maxEnemy = 20 // 敌方坦克总数
let maxAppearEnemy = 5 // 屏幕上一起出现的最大数
let appearEnemy = 0 // 已出现的敌方坦克
let mainframe = 0
let isGameOver = false
let overX = 176
let overY = 384
let emenyStopTime
let homeProtectedTime
let propTime

/**
 * 设置元素宽高尺寸
 * @param {Element[]} elements
 * @param {{ width: number; height: number }}
 */
function setElementsSize(elements, { width, height }) {
  elements.forEach(element => {
    element.style.width = `${width}px`
    element.style.height = `${height}px`
    element.setAttribute('width', width)
    element.setAttribute('height', height)
  })
}

function initScreen(width = SCREEN_WIDTH, height = SCREEN_HEIGHT) {
  const stageCanvas = document.querySelector('#stageCanvas')
  stageCtx = stageCanvas.getContext('2d')
  const wallCanvas = document.querySelector('#wallCanvas')
  wallCtx = wallCanvas.getContext('2d')
  const grassCanvas = document.querySelector('#grassCanvas')
  grassCtx = grassCanvas.getContext('2d')
  const tankCanvas = document.querySelector('#tankCanvas')
  tankCtx = tankCanvas.getContext('2d')
  const overCanvas = document.querySelector('#overCanvas')
  overCtx = overCanvas.getContext('2d')
  const container = document.querySelector('.container')
  setElementsSize([stageCanvas, wallCanvas, grassCanvas, tankCanvas, overCanvas, container], {
    width,
    height,
  })
}

function initObject() {
  menu = new Menu(stageCtx)
  // stage = new Stage(ctx,level);
  // map = new Map(wallCtx,grassCtx);
  // player1 = new PlayTank(tankCtx);
  // player1.x = 129 + map.offsetX;
  // player1.y = 385 + map.offsetY;
  // player2 = new PlayTank(tankCtx);
  // player2.offsetX = 128; //player2的图片x与图片1相距128
  // player2.x = 256 + map.offsetX;
  // player2.y = 385 + map.offsetY;
  // appearEnemy = 0; //已出现的敌方坦克
  // enemyArray = [];//敌方坦克
  // bulletArray = [];//子弹数组
  // keys = [];//记录按下的按键
  // crackArray = [];//爆炸数组
  // isGameOver = false;
  // overX = 176;
  // overY = 384;
  // overCtx.clearRect(0,0,SCREEN_WIDTH,SCREEN_HEIGHT);
  // emenyStopTime = 0;
  // homeProtectedTime = -1;
  // propTime = 1000;
}

const game = new Game()

function loop() {
  switch (gameState) {
    case GAME_STATE_MENU:
      // menu.draw()
      break
    case GAME_STATE_INIT:
      stage.draw()
  }

  requestAnimationFrame(loop)
  // setTimeout(loop, 20);
}

// function bindEvents() {
//   window.addEventListener('keydown', e => {
//     const { keyCode } = e
//     switch (gameState) {
//       case GAME_STATE_MENU:
//         if (keyCode === KEYBOARD.ENTER) {
//           gameState = GAME_STATE_INIT
//           // 判断玩家数量
//         } else {
//           menu.next(keyCode)
//         }
//     }
//   })
// }
