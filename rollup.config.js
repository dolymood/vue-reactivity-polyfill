import path from 'path'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel, { getBabelOutputPlugin } from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

 const config = {
  input: 'src/reactivity.js',
  output: [
    {
      file: 'dist/reactivity.cjs.js',
      format: 'cjs'
    },
    {
      file: 'dist/reactivity.esm.js',
      format: 'es'
    },
    {
      file: 'dist/reactivity.global.js',
      name: 'VueReactivity',
      format: 'iife'
    }
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({ babelHelpers: 'bundled' })
  ]
}

const output = config.output.slice()
for (let o of config.output) {
  const plugins = []
  if (o.format === 'iife' || o.format === 'es') {
    plugins.push(getBabelOutputPlugin({
      configFile: path.resolve(__dirname, 'babel.config.js'),
      allowAllFormats: true
    }))
    plugins.push(terser({
      module: /^es/.test(o.format)
    }))
  }
  output.push({
    ...o,
    file: o.file.replace(/\.js$/, '.prod.js'),
    plugins
  })
}
config.output = output

export default config
