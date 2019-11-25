import webpack from 'webpack'
process.env.NODE_ENV = 'development'

import SmartWebpackPlugin from '../src'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const compiler = webpack({
  entry: './test/test',
  plugins: [
    new SmartWebpackPlugin({
      lint: {
        enable: false
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      hash: true,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    })
  ]
})

compiler.watch({}, (error, stats) => {
  /**
   * 构建失败，抛出错误
   */
  if (error) throw error
  if (stats.hasErrors()) {
    process.stdout.write(
      stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      })
    )
    process.exit(1)
  }
})
