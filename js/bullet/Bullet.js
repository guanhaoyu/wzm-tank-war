import Spirits from "../spirits/Spirit.js"

export default class Bullet extends Spirits {
  constructor(context, owner, type, direction, x, y) {
    // todo
    super(context, 'bullet', x, y, 6, 3, direction)
    this.owner = owner //子弹的所属者
    // ? owner是否已经足以表示
    this.type = type //1、玩家  2、敌方
    this.hit = false
  }
}
