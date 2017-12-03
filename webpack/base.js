const path = require('path')
const {
  main,
  srcPath,
  testPath,
  outputPath,
  libraryName
} = require('../config')

module.exports = {
  entry: {
    [libraryName]: path.join(srcPath, main)
  },
  devtool: 'source-map',
  output: {
    path: outputPath,
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /(node_modules)/
      },
      {
        test: /(\.jsx|\.js)$/,
        loader: 'eslint-loader',
        include: [srcPath, testPath],
        exclude: /node_modules/,
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      }
    ]
  },
  resolve: {
    modules: [path.join(__dirname, '..', 'node_modules'), srcPath],
    extensions: ['.json', '.js'],
    alias: {
      '@': srcPath,
      '@lib': outputPath,
      '@test': testPath
    }
  }
}
