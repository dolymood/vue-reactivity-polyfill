import config, { addProd } from './rollup.base.config'

// no external
// reactivity-polyfill.esm-browser
// reactivity-polyfill.esm-browser.prod
// reactivity-polyfill.global
// reactivity-polyfill.global.prod

config.external = ['@vue/reactivity']
config.output = [
  {
    file: 'dist/reactivity-polyfill.esm-browser.js',
    format: 'es'
  },
  {
    file: 'dist/reactivity-polyfill.global.js',
    name: 'VueReactivityPolyfill',
    format: 'iife',
    globals: {
      '@vue/reactivity': 'Vue'
    }
  }
]

addProd(config)

export default config
