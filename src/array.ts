import { def } from './util'
import { ReactiveFlags } from './proxy'
import { ITERATE_KEY, toRaw, trigger, isReactive, TriggerOpTypes, isReadonly, isProxy, track, TrackOpTypes } from '@vue/reactivity'
import { addProp, handleReadonly, toReactive, toReadonly, toShallow } from './util'
// clone https://github.com/vuejs/vue/blob/dev/src/core/observer/array.js
const arrayProto: any = Array.prototype
// const methods = Object.getOwnPropertyNames(arrayProto)
const arrayMethods = Object.create(arrayProto)

const methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

// hook API
// methods.forEach(method => {
//   if (methodsToPatch.includes(method)) {
//     return
//   }
//   const original = arrayProto[method]
//   def(arrayMethods, method, {
//     writable: true,
//     value: function mutator (...args: any[]) {
//       // const target = toRaw(this) as any
//       debugger
//       const result = original.apply(this, args)
//       return result
//     }
//   })
// })

methodsToPatch.forEach(function (method) {
  // cache original method
  const original = arrayProto[method]
  def(arrayMethods, method, {
    writable: true,
    value: function mutator (...args: any[]) {
      const target = toRaw(this) as any
      const proxy = isProxy(this) ? this : (target[ReactiveFlags.REACTIVE] || target[ReactiveFlags.READONLY])
      if (handleReadonly(proxy, method)) {
        return
      }
      const oldThis = target.slice()
      const oldLen = oldThis.length
      const result = original.apply(target, args)
      const newLen = target.length
      let i = 0
      let j = 0
      while (i < newLen || j < oldLen) {
        if (i < newLen) {
          // update
          const oldVal = oldThis[i]
          const newVal = target[i]
          if (!(i in oldThis)) {
            // set
            addProp(proxy, i, newVal)
          } else {
            if (oldVal !== newVal) {
              trigger(target, 'set' as TriggerOpTypes, i, newVal, oldVal)
            }
          }
        } else {
          delete proxy[i]
          proxy.length -= 1
          // delete old
          trigger(target, 'delete' as TriggerOpTypes, i, undefined, oldThis[i])
        }
        i++
        j++
      }
      // if (oldLen !== newLen) {
      //   // length changed
      //   trigger(target, 'set' as TriggerOpTypes, 'length', target.length, oldLen)
      // }
      // always trigger clear to hack trigger all effects
      trigger(target, 'clear' as TriggerOpTypes, 'length', target.length, oldLen)
      return result
    }
  })
})

const method = 'forEach'
const _forEach = arrayProto[method]
def(arrayMethods, method, {
  writable: true,
  value: function mutator (callback: Function, thisArg: unknown) {
    const target = toRaw(this) as any
    const _isReadonly = isReadonly(this)
    const _isReactive = isReactive(this)
    const proxy = (_isReadonly || _isReactive) ? this : (target[ReactiveFlags.REACTIVE] || target[ReactiveFlags.READONLY])

    !_isReadonly && track(target, 'iterate' as TrackOpTypes, ITERATE_KEY)
    const wrap = _isReadonly ? toReadonly : _isReactive ? toReactive : toShallow
    function wrappedCallback(value: unknown, key: number) {
        return callback.call(thisArg, wrap(value), key, proxy)
    }
    return _forEach.call(target, wrappedCallback)
  }
})

// hack array from
const originFrom = Array.from
originFrom && (Array.from = function <T>(arrayLike: ArrayLike<T>): T[] {
  const ret = originFrom<T>(arrayLike)
  const raw = toRaw(arrayLike)
  // at least call once for ITERATE_KEY
  track(raw, 'interate' as TrackOpTypes, ITERATE_KEY)
  // check forEach
  // @ts-ignore
  if (raw.forEach) {
    // @ts-ignore
    raw.forEach((_, key) => {
      track(raw, 'get' as TrackOpTypes, key)
    })
  } else {
    const len = raw.length
    for (let i = 0; i < len; i++) {
      track(raw, 'get' as TrackOpTypes, i)
    }
  }
  return ret
})

function getLength<T> (array: Array<T>) {
  const len = array.length
  track(toRaw(array), 'get' as TrackOpTypes, 'length')
  return len
}

export {
  arrayMethods,
  getLength
}
