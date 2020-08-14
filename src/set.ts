import { isReactive, isReadonly, toRaw } from '@vue/reactivity'
import { isValidArrayIndex, addProp } from './util'

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set (target: Array<any> | Object, key: any, val: any): any {
  const _isReactive = isReactive(target)
  const _isReadonly = isReadonly(target)
  const proxy = target as any
  target = toRaw(proxy) as any
  if (!_isReactive && !_isReadonly) {
    proxy[key] = val
    return val
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    (target as Array<any>).splice(key, 1, val)
    return val
  }
  // already exits
  if (key in proxy && !(key in Object.prototype)) {
    proxy[key] = val
    return val
  }
  addProp(proxy, key, val)
  return val
}
