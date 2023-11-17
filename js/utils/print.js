let lock = false
export default function print(...args) {
  if (lock) {
    return
  }
  lock = true
  console.log(...args)
}
