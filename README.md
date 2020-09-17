# vue-reactivity-polyfill [![CircleCI](https://circleci.com/gh/dolymood/vue-reactivity-polyfill.svg?style=svg)](https://circleci.com/gh/dolymood/vue-reactivity-polyfill)

`@vue/reactivity` can not support no `Proxy` envs, this pkg ployfill it.

- Use [proxy-polyfill](https://github.com/GoogleChrome/proxy-polyfill)
- Use core-js

If you want to use with Vue3 to be compatible with IE9+, you need to use [vue3-plugin-polyfill](https://github.com/dolymood/vue3-plugin-polyfill) too.

Here is a demo, [vue-next-demo](https://github.com/dolymood/vue-next-demo).

### Usage

```js
// add polyfill
// vue-reactivity-polyfill-getownpropertynames is used to
// fix IE Obejct.getOwnPropertyNames(fn) error.
// for bundle, must imported before @vue/reactivity or vue
import 'vue-reactivity-polyfill-getownpropertynames'
import 'vue-reactivity-polyfill'
// use
import { ref } from '@vue/reactivity'
// or
import { ref } from 'vue'
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
