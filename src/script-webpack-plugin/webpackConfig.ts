import chalk from 'chalk'
import CompressionWebpackPlugin from 'compression-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import { ScriptWebpackPluginOptions } from 'types'
import VueLoaderPlugin from 'vue-loader/lib/plugin'
import { Configuration } from 'webpack'
import { isReact, isTypescript, isVue, root } from '../config'
import { NODE_ENV } from '../env'
import queueLog from '../queueLog'
import babelConfig from './babelConfig'

export default (options: ScriptWebpackPluginOptions) => {
  let regExpStr = isTypescript ? '.(t|j)s' : '.js'

  if (isReact) {
    regExpStr += 'x?'
  }

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
          test: new RegExp(`${regExpStr}$`),
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
                ...babelConfig
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: ['.js']
    },
    plugins: []
  }

  if (isTypescript) {
    config.resolve.extensions.push('.ts')
  }

  /**
   * 支持vue
   */
  if (isVue) {
    queueLog.info(`以使用${chalk.green('Vue')}框架专属配置`)
    config.plugins.push(new VueLoaderPlugin())
    config.resolve.extensions.push('.vue')
  }

  /**
   * 支持react 的 state 热更新
   */
  if (isReact) {
    config.resolve.extensions.push(isTypescript ? '.tsx' : '.jsx')
    if (NODE_ENV === 'development') {
      const rulesUse = config.module.rules[0].use
      config.module.rules[0].use = [
        rulesUse[0],
        {
          loader: 'react-hot-loader/webpack'
        },
        // @ts-ignore
        ...rulesUse.slice(1)
      ]
    }
  }

  /**
   * 生产模式
   */
  if (NODE_ENV === 'production') {
    config.plugins.push(
      ...[
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
              drop_console: true
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
    )
  }

  return config
}
