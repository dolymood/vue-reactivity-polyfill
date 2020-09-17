import { trigger, TriggerOpTypes } from '@vue/reactivity'
import { hasOwn } from '@vue/shared'
import { isValidArrayIndex, handleReadonly, isPolyfillProxy, getProxyAndTarget } from './util'

/**
 * Delete a property and trigger change if necessary.
 */
export function del (o: Array<any> | Object, key: any) {
  const { proxy, target } = getProxyAndTarget(o)
  if (!isPolyfillProxy(proxy)) {
    delete (proxy as any)[key]
    return
  }
  if (handleReadonly(proxy, key, 'Delete')) {
    return
  }

  if (Array.isArray(target) && isValidArrayIndex(key)) {
    proxy.splice(key, 1)
    return
  }

  if (!hasOwn(target, key)) {
    return
  }
  const oldVal = target[key]
  delete target[key]
  delete proxy[key]
  trigger(target, 'delete' as TriggerOpTypes, key, undefined, oldVal)
}
