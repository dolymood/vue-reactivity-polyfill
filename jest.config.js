module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./scripts/setupJestEnv.ts'],
  globals: {
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    },
    __DEV__: true,
    __TEST__: true,
    __VERSION__: require('./package.json').version,
    __BROWSER__: false,
    __GLOBAL__: false,
    __ESM_BUNDLER__: true,
    __ESM_BROWSER__: false,
    __NODE_JS__: true,
    __FEATURE_OPTIONS_API__: true,
    __FEATURE_SUSPENSE__: true
  },
  coverageDirectory: 'coverage',
  coverageReporters: ['html', 'lcov', 'text'],
  collectCoverageFrom: [
    'src/**',
    'node_modules/@vue/reacticity/**'
  ],
  watchPathIgnorePatterns: ['/node_modules/', '/dist/', '/.git/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  rootDir: __dirname,
  testMatch: ['<rootDir>/__tests__/**/*spec.[jt]s?(x)']
}
