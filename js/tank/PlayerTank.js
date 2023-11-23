import Tank from './Tank.js'

export default class PlayerTank extends Tank {
  constructor(context) {
    super(context)
    this.lives = 3
    this.isProtected = true //是否受保护
    this.protectedTime = 500 //保护时间 ? 这500是秒？接近9分钟啊离谱
    this.speed = 2 //坦克的速度
    this.x = 129 + 32
    this.y = 385 + 16
  }
}
