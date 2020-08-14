# vue-reactivity-with-polyfill

`@vue/reactivity` can not support no `Proxy` envs, this pkg ployfill it.

- Use [proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill)
- Use core-js

### New API

- set(target, key, val)
- del(target, key)
- getLength(target: ArrayLike)

### Do not support

> WIP

- Symbol key
- Array length
- Dynamic prop, `object[key]` or `array[index]`
- delete
- objectSpread

More, see [proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill#readme)
