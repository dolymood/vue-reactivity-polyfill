import { isValidArrayIndex, addProp, isPolyfillProxy, getProxyAndTarget } from './util'

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
export function set (o: Array<any> | Object, key: any, val: any): any {
  const { proxy, target } = getProxyAndTarget(o)
  if (!isPolyfillProxy(proxy)) {
    (proxy as any)[key] = val
    return val
  }
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    (proxy as Array<any>).splice(key, 1, val)
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
