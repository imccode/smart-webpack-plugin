import webpack from 'webpack'
import SmartWebpackPlugin from '../src'

const compiler = webpack({
  entry: './test/test',
  plugins: [
    new SmartWebpackPlugin({
      lint: {
        enable: false
      }
    })
  ]
})
compiler.run((error, stats) => {
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
