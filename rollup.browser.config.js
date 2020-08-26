import config, { addProd } from './rollup.base.config'

// todo, vue exports track trigger can gengerate these files

// no external
// reactivity-polyfill.esm-browser
// reactivity-polyfill.esm-browser.prod

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
      '@vue/reactivity': 'Vue || VueRuntimeDOM'
    }
  }
]

addProd(config)

export default config
