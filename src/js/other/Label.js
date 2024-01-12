import { POS, RESOURCE_IMAGE } from '../const/IMAGE'

export default class Label {
  constructor(contxt) {
    this.ctx = contxt
    this.type = 'stageLevel'

  }

  draw() {
    this.ctx.drawImage(
      RESOURCE_IMAGE,
      POS[this.type][0],
      POS[this.type][1],
      78,
      14,
      194,
      208,
      78,
      14
    )
  }
}
