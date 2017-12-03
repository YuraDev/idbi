const webpack = require('webpack')
const merge = require('webpack-merge')
const {libraryName} = require('../config')
const baseWebpack = require('./base')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

module.exports = merge(baseWebpack, {
  output: {
    filename: libraryName + '.js'
  },
  watch: true,
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new FriendlyErrorsPlugin()
  ]
})
