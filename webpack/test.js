const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpack = require('./base')
// const path = require('path')

let webpackConfig = merge(baseWebpack, {
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"test"'
    })
  ]
})

delete webpackConfig.entry
module.exports = webpackConfig
