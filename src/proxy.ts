import { hasOwn } from '@vue/shared'
import { def, ReactiveFlags, protoAugment, copyAugment } from './util'
import { arrayMethods } from './array'
import { NativeProxy, isNativeProxy } from './support'

if (!isNativeProxy) {
  const hasProto = '__proto__' in {}
  var arrayKeys = Object.getOwnPropertyNames(arrayMethods)
  // hack Proxy for Vue
  const ProxyPolyfill: any = function (target: any, handler: any) {
    const isArray = Array.isArray(target)
    // for Array cases
    // vue3 handle proto methods too
    // so we neet to force delegate it
    // https://github.com/vuejs/vue-next/issues/2137
    const originGet = handler.get
    handler.get = function (target: any, key: string, receiver: object) {
      if (isArray && hasOwn(arrayMethods, key)) {
        // array proto methods cases
        // just return arrayMethods key
        return arrayMethods[key]
      }
      const ret = originGet.call(handler, target, key, receiver)
      return ret
    }
    const proxy = new NativeProxy(target, handler)
    if (isArray) {
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
