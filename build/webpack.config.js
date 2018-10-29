const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin');
const path = require('path')

const distPath = path.join(__dirname, '../dist')
const dataPath = path.join(__dirname, '../server/data')
module.exports = {
    target:'node',
    entry: path.join(__dirname, '../server/wrapper.js'),
    output: {
      path: distPath,
      filename: 'server.js'
    },
    devtool: 'none',
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
  optimization: {
    minimizer: [
        new UglifyJsPlugin({
            uglifyOptions: {
                compress: false
            }
        })
    ]
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