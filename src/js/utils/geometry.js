import { add } from "./decimal";

export function calculateCenter(x, y, width, height) {
  return [add(x, width / 2), add(y, height / 2)]
}
