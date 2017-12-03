const path = require('path')

module.exports = {
  main: 'index.js',
  libraryName: 'idb',
  outputPath: path.join(__dirname, 'lib'),
  srcPath: path.join(__dirname, 'src'),
  testPath: path.join(__dirname, 'test')
}
