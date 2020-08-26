# vue-reactivity-polyfill

`@vue/reactivity` can not support no `Proxy` envs, this pkg ployfill it.

- Use [proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill)
- Use core-js

### Usage

```js
import { ref } from '@vue/reactivity'
// or
import { ref } from 'vue'
// add polyfill
import { get, set, del } from 'vue-reactivity-polyfill'
```

### New API

- get(target, path, defaultValue)
- set(target, key, val)
- del(target, key)
- getLength(target: ArrayLike)

### Unsupported Cases

- Symbol key
- Array length
- Dynamic prop, `object[key]` or `array[index]`
- delete
- objectSpread

More, see [proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill#readme)
