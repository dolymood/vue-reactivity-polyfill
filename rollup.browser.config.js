import config, { addProd } from './rollup.base.config'

// no external
// reactivity.esm-browser
// reactivity.esm-browser.prod
// reactivity.global
// reactivity.global.prod

config.external = []
config.output = [
  {
    file: 'dist/reactivity.esm-browser.js',
    format: 'es'
  },
  {
    file: 'dist/reactivity.global.js',
    name: 'VueReactivity',
    format: 'iife'
  }
]

addProd(config)

export default config
