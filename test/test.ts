const webpack = require('webpack')

process.env.NODE_ENV = 'development'

const { SmartWebpackPlugin } = require('../src')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const compiler = webpack(
  {
    entry: './test/main',
    plugins: [
      new SmartWebpackPlugin(),
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
    ],
    optimization: {
      /**
       * 配置runtime文件
       */
      runtimeChunk: {
        /**
         * 多个chunk共享一个runtime入口，起名为runtime
         */
        name: 'runtime'
      },
      /**
       * 移除空chunk
       */
      removeEmptyChunks: true,
      /**
       * 通用分块策略
       */
      splitChunks: {
        /**
         * 表示将选择哪些块进行优化
         *
         * 优化异步模块
         */
        chunks: 'async',
        /**
         * 要生成的块的最小大小
         */
        minSize: 3e3,
        /**
         * 分割前必须共享模块的最小块数
         */
        minChunks: 1,
        /**
         * 按需加载时的最大并行请求数
         */
        maxAsyncRequests: 5,
        /**
         * 入口点处的最大并行请求数
         */
        maxInitialRequests: 3,
        /**
         * 多个块之间的连接符
         *
         * 如： module1-module2-module3.js
         */
        automaticNameDelimiter: '-',
        /**
         * 自动生成基于块和缓存组密钥的名称
         */
        name: true,
        /**
         * 构建缓存优化
         *
         * 不常修改文件在此配置
         */
        cacheGroups: {
          /**
           * vendor自定义块
           *
           * 打包自node_modules的模块
           */
          vendor: {
            test: /node_modules/,
            name: 'vendor',
            chunks: 'all',
            priority: 10
          }
        }
      }
    }
  },
  // (error, stats) => {
  //   /**
  //    * 构建失败，抛出错误
  //    */
  //   if (error) throw error
  //   if (stats.hasErrors()) {
  //     process.stdout.write(
  //       stats.toString({
  //         colors: true,
  //         modules: false,
  //         children: false,
  //         chunks: false,
  //         chunkModules: false
  //       })
  //     )
  //     process.exit(1)
  //   }
  // }
)

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
    // process.exit(1)
  }
})
