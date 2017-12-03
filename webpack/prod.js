const webpack = require('webpack')
const merge = require('webpack-merge')
const {libraryName} = require('../config')
const baseWebpack = require('./base')

module.exports = merge(baseWebpack, {
  output: {
    filename: libraryName + '.min.js'
  },
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.UglifyJsPlugin({ minimize: true })
  ]
})
