import 'proxy-polyfill/src/index'
import { hasOwn } from '@vue/shared'
// @ts-ignore
import _Symbol from 'core-js/es/symbol'
// @ts-ignore
import _Reflect from 'core-js/es/reflect'
// @ts-ignore
import _Set from 'core-js/es/set'
// @ts-ignore
import _Map from 'core-js/es/map'
// @ts-ignore
import _WeakSet from 'core-js/es/weak-set'
// @ts-ignore
import _WeakMap from 'core-js/es/weak-map'

if (!self.Symbol) {
  self.Symbol = _Symbol
}
if (!self.Reflect) {
  self.Reflect = _Reflect
}
if (!self.Set) {
  self.Set = _Set
}
if (!self.Map) {
  self.Map = _Map
}
if (!self.WeakSet) {
  self.WeakSet = _WeakSet
}
if (!self.WeakMap) {
  self.WeakMap = _WeakMap
}

const ReactiveFlags: Record<string, string> = {
  SKIP: '__v_skip',
  IS_REACTIVE: '__v_isReactive',
  IS_READONLY: '__v_isReadonly',
  RAW: '__v_raw',
  REACTIVE: '__v_reactive',
  READONLY: '__v_readonly'
}

function def(obj: any, key: string, attrs: object) {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    ...attrs
  })
}

const _Proxy = self.Proxy
const isNativeProxy = _Proxy && /native code/.test(_Proxy.toString())
if (!isNativeProxy) {
  // hack Proxy for Vue
  const ProxyPolyfill: any = function (target: any, handler: any) {
    const proxy = new _Proxy(target, handler)
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

export * from '@vue/reactivity'
