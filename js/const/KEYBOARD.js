import { DOWN, LEFT, RIGHT, UP } from "./WORLD.js"

const KEYBOARD = {
  UP: 38,
  DOWN: 40,
  RIGHT: 39,
  LEFT: 37,

  SPACE: 32,
  TAB: 9,
  ENTER: 13,
  CTRL: 17,
  ALT: 18,

  Num0: 48,
  Num1: 49,
  Num2: 50,
  Num3: 51,
  Num4: 52,
  Num5: 53,
  Num6: 54,
  Num7: 55,
  Num8: 56,
  Num9: 57,

  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
}

// 按键到方向的映射
export const keyDirectionMap = new Map()

keyDirectionMap.set(KEYBOARD.UP, UP)
keyDirectionMap.set(KEYBOARD.DOWN, DOWN)
keyDirectionMap.set(KEYBOARD.LEFT, LEFT)
keyDirectionMap.set(KEYBOARD.RIGHT, RIGHT)

export default KEYBOARD
