import CompressionWebpackPlugin from 'compression-webpack-plugin'
import { NODE_ENV } from '../env'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import { ScriptWebpackPluginOptions } from 'types'
import VueLoaderPlugin from 'vue-loader/lib/plugin'
import { Configuration } from 'webpack'
import { isReact, isTypescript, isVue, root } from '../config'
import babelConfig from './babelConfig'

export default (options: ScriptWebpackPluginOptions) => {
  let regExpStr = '.js'

  if (isReact) {
    regExpStr = isTypescript ? '.tsx' : '.jsx'
  }

  const config: Configuration = {
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
    plugins: []
  }

  /**
   * 支持vue
   */
  if (isVue) {
    config.module.rules.push({
      test: /\.vue$/,
      use: [
        {
          loader: 'vue-loader'
        }
      ]
    })
    config.plugins.push(new VueLoaderPlugin())
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
