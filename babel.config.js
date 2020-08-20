const runtimeVersion = require('@babel/runtime/package.json').version

module.exports = {
  ignore: [ /core-js/, /@babel\/runtime/ ],
  presets: [
    ['@babel/preset-env', {
      corejs: 3,
      modules: false,
      useBuiltIns: 'usage'
    }],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', {
      absoluteRuntime: false,
      corejs: false,
      helpers: true,
      regenerator: false,
      useESModules: false,
      version: runtimeVersion
    }]
  ]
}
