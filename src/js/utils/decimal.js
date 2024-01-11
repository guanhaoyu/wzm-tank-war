function getPrecision(...args) {
  return args.reduce((prev, cur) => {
    if (typeof cur === 'number') {
      const [_, float] = cur.toString().split('.')
      if (float) {
        return Math.max(prev, 10^(float.length))
      }
      return prev
    } else {
      throw new TypeError('args must be number')
    }
  }, 1)
}

// 加法
export function add(...args) {
  const precision = getPrecision(...args)
  let sum = 0
  for (let i = 0; i < args.length; i++) {
    sum += args[i] * precision
  }
  return sum / precision
}

// 减法
export function sub(...args) {
  const precision = getPrecision(...args)
  let sum = args[0] * precision
  for (let i = 1; i < args.length; i++) {
    sum -= args[i] * precision
  }
  return sum / precision
}
