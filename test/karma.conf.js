const webpackConfig = require('../webpack/test.js')

module.exports = function (config) {
  config.set({
    basePath: '',
    port: 9876,
    browsers: ['Chrome'],
    frameworks: ['mocha', 'sinon-chai'],
    files: [ 'specs/*.js' ],
    exclude: [ ],
    preprocessors: {
      'specs/*.js': ['webpack', 'sourcemap']
    },
    reporters: ['spec', 'coverage'],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    concurrency: Infinity,
    coverageReporter: {
      dir: './coverage',
      reporters: [
        { type: 'lcov', subdir: '.' },
        { type: 'text-summary' }
      ]
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    }
  })
}
