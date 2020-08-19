import { isReactive, toRaw, trigger, TriggerOpTypes } from '@vue/reactivity'
import { hasOwn } from '@vue/shared'
import { isValidArrayIndex, handleReadonly, isPolyfillProxy } from './util'

/**
 * Delete a property and trigger change if necessary.
 */
export function del (target: Array<any> | Object, key: any) {
  const proxy = target as any
  if (!isPolyfillProxy(proxy)) {
    delete proxy[key]
  }
  target = toRaw(proxy) as any
  if (handleReadonly(target, key)) {
    return
  }

  const _isReactive = isReactive(proxy)
  if (!_isReactive) {
    delete proxy[key]
    return
  }

  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1)
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
