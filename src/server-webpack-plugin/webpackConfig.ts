import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import path from 'path'
import { ServerWebpackPluginOptions } from '../types'
import { Configuration, HotModuleReplacementPlugin } from 'webpack'
import { isReact, root } from '../config'
import { localIps } from '../utils'

export default (options: ServerWebpackPluginOptions) => {
  const config: Configuration = {
    stats: false,
    performance: false,
    /**
     * 表示当前webpack环境为开发环境
     */
    mode: 'development',
    /**
     * 浏览器debug sourceMap 模式
     */
    devtool: 'eval-source-map',
    output: {
      path: path.resolve(root, '.cache', 'server/dist'),
      /**
       * 导出文件名设置
       *
       * 根据文件chunk内容生成名字
       */
      filename: 'js/[name].[hash:8].js',
      /**
       * 导出分块(chunk)文件名设置
       *
       * 根据文件chunk内容生成名字
       */
      chunkFilename: 'js/[name].chunk-[hash:8].js'
    },
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    },
    /**
     * 监听文件改动
     */
    watch: true,
    plugins: [
      new HotModuleReplacementPlugin(),
      /**
       * 只显示核心错误
       */
      new FriendlyErrorsWebpackPlugin({
        compilationSuccessInfo: {
          messages: localIps().map(ip => {
            return `listening: http://${ip}:${options.port}`
          })
        }
      })
    ]
  }

  if (isReact) {
    config.resolve.alias['react-dom'] = '@hot-loader/react-dom'
  }

  return config
}
