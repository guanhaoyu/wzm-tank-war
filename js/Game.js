import lifecycle from './Lifecycle.js'
import { GAME_STATE_MENU, GAME_STATE_INIT, GAME_STATE_START, GAME_STATE_OVER, GAME_STATE_WIN } from './const/GAMESTATE.js'
import { SCREEN_HEIGHT, SCREEN_WIDTH } from './const/SCREEN.js'
import { DIRECTION } from './const/WORLD.js'
import Menu from './layer/Menu.js'

/**
 * 设置元素宽高尺寸
 * @param {Element[]} elements
 * @param {{ width: number; height: number }}
 */
function setCanvasSize(elements, { width, height }) {
  elements.forEach(element => {
    element.setAttribute('width', width)
    element.setAttribute('height', height)
  })
}

lifecycle.init([GAME_STATE_MENU, GAME_STATE_INIT, GAME_STATE_START, GAME_STATE_OVER, GAME_STATE_WIN])

/**
 * 调度
 * 键入监听
 */
export default class Game {
  gameState = GAME_STATE_MENU

  menu = null
  stage = null

  constructor() {
    this.prepare()
    this.handleKeyboardEvent()
  }

  prepare(width = SCREEN_WIDTH, height = SCREEN_HEIGHT) {
    const container = document.querySelector('.container')
    container.style.width = `${width}px`
    container.style.height = `${height}px`

    const stageCanvas = document.querySelector('#stageCanvas')
    const stageCtx = stageCanvas.getContext('2d')
    this.menu = new Menu(stageCtx)

    const wallCanvas = document.querySelector('#wallCanvas')
    const wallCtx = wallCanvas.getContext('2d')
    const grassCanvas = document.querySelector('#grassCanvas')
    const grassCtx = grassCanvas.getContext('2d')
    const tankCanvas = document.querySelector('#tankCanvas')
    const tankCtx = tankCanvas.getContext('2d')
    const overCanvas = document.querySelector('#overCanvas')
    const overCtx = overCanvas.getContext('2d')
    setCanvasSize([stageCanvas, wallCanvas, grassCanvas, tankCanvas, overCanvas], {
      width,
      height,
    })
  }
  handleKeyboardEvent() {
    const keys = new Set()
    this.menu.subscribe(keys)
    document.addEventListener('keydown', ({code}) => {
      keys.add(code)
    })
    document.addEventListener('keyup', ({code}) => {
      keys.delete(code)
    })
  }

  run() {
    switch (this.gameState) {
      case GAME_STATE_MENU:
        this.menu.draw()
        break
      case GAME_STATE_INIT:
    }
  
    requestAnimationFrame(this.run.bind(this))
  }
}
