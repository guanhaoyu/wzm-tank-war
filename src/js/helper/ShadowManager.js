import Shadow from "../Shadow"

class ShadowManager {
  constructor() {
    this.shadows = []
    this.addTime = Date.now()
  }

  add(context, type, x, y, width, height, direction) {
    this.addTime = Date.now()
    this.shadows.push(new Shadow(context, type, x, y, width, height, direction))
  }

  clear() {
    this.shadows = []
  }

  draw() {
    this.shadows.forEach(s => s.draw())
  }

  remove(...args) {
    args.forEach(arg => {
      this.shadows = this.shadows.filter(shadow => shadow.id !== arg.id)
    })
  }
}

const shadowManager = new ShadowManager()
export default shadowManager
