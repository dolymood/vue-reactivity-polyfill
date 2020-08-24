import { hasOwn } from '@vue/shared'
import { def, ReactiveFlags, protoAugment, copyAugment } from './util'
import { arrayMethods } from './array'
import { NativeProxy, isNativeProxy } from './support'

if (!isNativeProxy) {
  const hasProto = '__proto__' in {}
  var arrayKeys = Object.getOwnPropertyNames(arrayMethods)
  // hack Proxy for Vue
  const ProxyPolyfill: any = function (target: any, handler: any) {
    const proxy = new NativeProxy(target, handler)
    if (Array.isArray(target)) {
      // array cases
      if (hasProto) {
        protoAugment(target, arrayMethods)
      } else {
        copyAugment(target, arrayMethods, arrayKeys)
      }
    }
    for (let k in ReactiveFlags) {
      const key = ReactiveFlags[k]
      // undefined do not use to define and should not define
      // if target hasOwn key can not define again
      if (!hasOwn(target, key) || target[key] !== target) {
        if (key !== ReactiveFlags.READONLY || handler.get(target, key, proxy) !== undefined) {
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
