import { hasOwn } from '@vue/shared'
import { def, ReactiveFlags } from './util'
import { arrayMethods } from './array'
import { NativeProxy, isNativeProxy } from './support'

if (!isNativeProxy) {
  // hack Proxy for Vue
  const ProxyPolyfill: any = function (target: any, handler: any) {
    const proxy = new NativeProxy(target, handler)
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
  ProxyPolyfill.revocable = NativeProxy.revocable
  self.Proxy = ProxyPolyfill
}
