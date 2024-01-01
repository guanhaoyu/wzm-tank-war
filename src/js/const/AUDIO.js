import start from '../../audio/start.mp3'
import bulletExplosion from '../../audio/bulletCrack.mp3'
import tankExplosion from '../../audio/tankCrack.mp3'
import playerExplosion from '../../audio/playerCrack.mp3'
import move from '../../audio/move.mp3'
import attack from '../../audio/attack.mp3'
import reward from '../../audio/prop.mp3'

/**************声音资源*****************/
const START_AUDIO = new Audio(start)
const BULLET_DESTROY_AUDIO = new Audio(bulletExplosion)
const TANK_DESTROY_AUDIO = new Audio(tankExplosion)
const PLAYER_DESTROY_AUDIO = new Audio(playerExplosion)
const MOVE_AUDIO = new Audio(move)
const ATTACK_AUDIO = new Audio(attack)
const REWARD_AUDIO = new Audio(reward)

MOVE_AUDIO.loop = true

export {
  START_AUDIO,
  BULLET_DESTROY_AUDIO,
  TANK_DESTROY_AUDIO,
  PLAYER_DESTROY_AUDIO,
  MOVE_AUDIO,
  ATTACK_AUDIO,
  REWARD_AUDIO
}
