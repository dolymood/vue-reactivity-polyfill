import { ITERATE_KEY, toRaw, track, TrackOpTypes } from '@vue/reactivity'
import { isPolyfillProxy } from '../lang'

// hack array from
const originFrom = Array.from
originFrom && (Array.from = function <T>(arrayLike: ArrayLike<T>): T[] {
  const ret = originFrom<T>(arrayLike)
  if (!isPolyfillProxy(arrayLike)) {
    return ret
  }
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
