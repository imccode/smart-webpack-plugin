import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin'
import chalk from 'chalk'
import CompressionWebpackPlugin from 'compression-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import VueLoaderPlugin from 'vue-loader/lib/plugin'
import { Compiler, Configuration } from 'webpack'
import { isReact, isTypescript, isVue, root } from '../config'
import log from '../log'
import { ScriptWebpackPluginOptions } from '../types'
import babelConfig from './babelConfig'

export default (options: ScriptWebpackPluginOptions, compiler: Compiler) => {
  const config: Configuration = {
    /**
     * 导出配置
     */
    output: {
      /**
       * 导出文件名设置
       *
       * 根据文件chunk内容生成名字
       */
      filename: 'js/[name].[contenthash:8].min.js',
      /**
       * 导出分块(chunk)文件名设置
       *
       * 根据文件chunk内容生成名字
       */
      chunkFilename: 'js/[name].chunk-[contenthash:8].min.js'
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          exclude: /(node_modules|bower_components)/,
          use: [
            {
              loader: require.resolve('thread-loader')
            },
            {
              loader: 'babel-loader',
              options: {
                /**
                 * 将相对于解析程序选项中的所有路径的工作目录
                 */
                cwd: root,
                /**
                 * 启用缓存，指定缓存路径
                 *
                 * 默认development环境启用
                 */
                cacheDirectory: options.cacheDirectory,
                /**
                 * babel 配置
                 */
                ...babelConfig(options, compiler)
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js']
    },
    plugins: [
      /**
       * 强制所有必需模块的整个路径与磁盘上实际路径的确切情况相匹配
       */
      new CaseSensitivePathsPlugin()
      // new ReactRefreshPlugin()
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
      },
      minimizer: [
        /**
         * 压缩优化js文件
         */
        new TerserWebpackPlugin({
          terserOptions: {
            /**
             * 导出配置
             */
            output: {
              /**
               * 删除注释
               */
              comments: false,
              /**
               * 自动格式化压缩
               */
              beautify: false
            },
            /**
             * 压缩配置 默认开启
             */
            compress: {
              /**
               * 删除 console
               */
              drop_console: options.dropConsole
            }
          },
          /**
           * 多线程压缩
           */
          parallel: true
        }),
        /**
         * 对js文件进行gzip
         */
        new CompressionWebpackPlugin({
          cache: options.cacheDirectory,
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.js$/,
          threshold: 1024,
          minRatio: 0.8
        })
      ]
    }
  }

  if (isTypescript) {
    config.resolve.extensions.push('.ts')
  }

  /**
   * 支持vue
   */
  if (isVue) {
    log.info(`以使用${chalk.green('Vue')}框架专属配置`)
    config.plugins.push(new VueLoaderPlugin())
    config.resolve.extensions.push('.vue')
  }

  /**
   * 支持react
   */
  if (isReact) {
    config.resolve.extensions.push(isTypescript ? '.tsx' : '.jsx')
  }

  return config
}
