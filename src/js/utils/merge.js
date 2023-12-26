import { isPrimitive } from './type.js'

/**
 * 对象合并
 * source中缺失的属性由target来补
 * @param {Object} source 
 * @param {Object} target 
 * @returns 
 */
export default function merge(source, target) {
  const config = {}
  for (const key in target) {
    const sourceValue = source[key]
    const targetValue = target[key]
    if (isPrimitive(sourceValue)) {
      config[key] = sourceValue ?? targetValue
    } else {
      config[key] = merge(sourceValue, targetValue)
    }
  }
  return config
}
