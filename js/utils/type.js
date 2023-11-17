export function isPrimitive(value) {
  return Object(value) !== value;
}

function isObject(value) {
  return value !== null && typeof value === 'object';  
}
