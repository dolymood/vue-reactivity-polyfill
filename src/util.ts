import { reactive, readonly, toRaw, trigger, isReactive, isReadonly, TriggerOpTypes } from '@vue/reactivity'
import { isObject } from '@vue/shared'

export function def(obj: any, key: string, attrs: object) {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    ...attrs
  })
}

export function isValidArrayIndex (val: any) {
  const n = parseFloat(String(val))
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

export function handleReadonly (proxy: any, key: any) {
  const _isReadonly = isReadonly(proxy)
  if (_isReadonly) {
    console.warn(`Set operation on key "${String(key)}" failed: target is readonly.`, proxy)
  }
  return _isReadonly
}

export function addProp (proxy: any, key: any, val: any) {
  const _isReactive = isReactive(proxy)
  if (_isReactive) {
    const target = toRaw(proxy)
    target[key] = toRaw(val)

    const setter = proxy['___@setter___']
    const getter = proxy['___@getter___']
    const real = Object.getOwnPropertyDescriptor(target, key)
    const desc = {
      configurable: true,
      enumerable: Boolean(real && real.enumerable),
      get: getter.bind(target, key),
      set: setter.bind(target, key)
    }
    def(proxy, String(key), desc)
    trigger(target, 'set' as TriggerOpTypes, key, val)
  } else if (handleReadonly(proxy, key)) {
  } else {
    // just set
    proxy[key] = val
  }
}

 export const toReactive = <T extends unknown>(value: T): T =>
  isObject(value) ? reactive(value) : value

export const toReadonly = <T extends unknown>(value: T): T =>
  isObject(value) ? readonly(value) : value

export const toShallow = <T extends unknown>(value: T): T => value
