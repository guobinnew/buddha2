const webpack = require('webpack');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path')

const distPath = path.join(__dirname, '../dist')
const dataPath = path.join(__dirname, '../server/data')
module.exports = {
    target:'node',
    mode: 'development',
    entry: path.join(__dirname, '../server/wrapper.js'),
    output: {
      path: distPath,
      filename: 'server.js'
    },
    devtool: 'none',
    devServer: {
      contentBase: distPath,
      historyApiFallback: true, //不跳转
      inline: true,
      hot: true
    },
    module: {
      rules: [{
          test: /(\.jsx|\.js)$/,
          use: {
            loader: "babel-loader"
          },
          exclude: /node_modules/
        }]
  },
  node: {
		__filename: true,
		__dirname: true
	},
  plugins: [
    new CleanWebpackPlugin(["dist"], {
      root: path.join(__dirname, '../'),
      verbose: true, //开启在控制台输出信息
      dry: false,
    }),
    new CopyWebpackPlugin([{
      from: dataPath,
      to: path.join(distPath, 'data'),
    }]),
  ]
}