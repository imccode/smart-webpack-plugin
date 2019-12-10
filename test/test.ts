import HtmlWebpackPlugin from 'html-webpack-plugin'
import webpack from 'webpack'
import SmartWebpackPlugin from '../src'

webpack({
  entry: './my-app/src',
  mode: 'development',
  plugins: [
    new SmartWebpackPlugin({
      script: {
        dropConsole: false
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './test/index.html',
      hash: true,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    })
  ]
}).watch({}, () => {})
