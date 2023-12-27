import { DIRECTION } from "./WORLD.js"

const KEYBOARD = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  RIGHT: 'ArrowRight',
  LEFT: 'ArrowLeft',

  SPACE: 'Space',
  ENTER: 'Enter',

  A: 'KeyA',
  D: 'KeyD',
  N: 'KeyN',
  P: 'KeyP',
  S: 'KeyS',
  W: 'KeyW',

  T: 'KeyT',
  BACKSPACE: 'Backspace'
}

// 按键到方向的映射
export const keyDirectionMap = new Map()

keyDirectionMap.set(KEYBOARD.UP, DIRECTION.UP)
keyDirectionMap.set(KEYBOARD.DOWN, DIRECTION.DOWN)
keyDirectionMap.set(KEYBOARD.LEFT, DIRECTION.LEFT)
keyDirectionMap.set(KEYBOARD.RIGHT, DIRECTION.RIGHT)

export default KEYBOARD
