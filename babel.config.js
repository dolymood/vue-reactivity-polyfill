module.exports = {
  ignore: [ /core-js/, /@babel\/runtime/ ],
  presets: [
    ['@babel/preset-env', {
      corejs: 3,
      modules: false,
      useBuiltIns: 'usage'
    }],
    '@babel/preset-typescript'
  ]
}
