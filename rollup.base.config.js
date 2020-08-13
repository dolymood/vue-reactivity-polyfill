import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import replace from '@rollup/plugin-replace'

const extensions = ['.js', '.ts']

// with external
// reactivity.cjs
// reactivity.cjs.prod
// reactivity.esm-bundler
// reactivity.esm-bundler.prod

const config = {
  input: 'src/index.ts',
  external: ['@vue/shared', 'core-js'],
  output: [
    {
      file: 'dist/reactivity.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/reactivity.esm-bundler.js',
      format: 'es'
    }
  ],
  plugins: [
    resolve({
      extensions
    }),
    commonjs(),
    babel({ extensions, babelHelpers: 'bundled' }),
    replace({
      __TEST__: false,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    })
  ]
}

export function addProd (config) {
  const output = config.output.slice()
  for (let o of config.output) {
    const plugins = []
    if (o.format === 'iife' || o.format === 'es') {
      plugins.push(terser())
    }
    output.push({
      ...o,
      file: o.file.replace(/\.js$/, '.prod.js'),
      plugins
    })
  }
  config.output = output
}

addProd(config)

export default config
