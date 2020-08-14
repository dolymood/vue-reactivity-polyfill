import { hasOwn } from '@vue/shared'
import { def } from './util'
import { arrayMethods } from './array'

export const ReactiveFlags: Record<string, string> = {
  SKIP: '__v_skip',
  IS_REACTIVE: '__v_isReactive',
  IS_READONLY: '__v_isReadonly',
  RAW: '__v_raw',
  REACTIVE: '__v_reactive',
  READONLY: '__v_readonly'
}

const _Proxy = self.Proxy
const isNativeProxy = _Proxy && /native code/.test(_Proxy.toString())
if (!isNativeProxy) {
  // hack Proxy for Vue
  const ProxyPolyfill: any = function (target: any, handler: any) {
    const proxy = new _Proxy(target, handler)
    if (Array.isArray(target)) {
      // array cases
      Object.setPrototypeOf(target, arrayMethods)
    }
    for (let k in ReactiveFlags) {
      const key = ReactiveFlags[k]
      // undefined do not use to define and should not define
      // if target hasOwn key can not define again
      if (!hasOwn(target, key)) {
        const initVal = handler.get(target, key, proxy)
        if (key !== ReactiveFlags.READONLY || initVal !== undefined) {
          def(proxy, key, {
            get() {
              return handler.get(target, key, proxy)
            }
          })
        }
      }
    }
    return proxy
  }
  ProxyPolyfill.revocable = _Proxy.revocable
  self.Proxy = ProxyPolyfill
}
