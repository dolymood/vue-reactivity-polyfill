# vue-reactivity-with-polyfill

`@vue/reactivity` can not support no `Proxy` envs, this pkg ployfill it.

- Use [proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill)
- Use core-js

### Do not support

> WIP

- Set
- Map
- WeakSet
- WeakMap

More, see [proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill#readme)
