import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin'
import { ServerWebpackPluginOptions } from 'types'
import { Configuration, Compiler, HotModuleReplacementPlugin } from 'webpack'
import { localIps } from '../utils'

export default (options: ServerWebpackPluginOptions) => {
  const newOptions: ServerWebpackPluginOptions = { ...options }
  delete newOptions.enable

  const config: Configuration = {
    /**
     * 最小化显示构建信息
     */
    stats: 'minimal',
    /**
     * 表示当前webpack环境为开发环境
     */
    mode: 'development',
    /**
     * 浏览器debug sourceMap 模式
     */
    devtool: 'cheap-module-eval-source-map',
    output: {
      filename: '[name].[hash:8].js',
      chunkFilename: '[name].chunk-[hash:8].js'
    },
    /**
     * 监听文件改动
     */
    watch: true,
    plugins: [
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

  if (options.hot) {
    config.plugins.push(new HotModuleReplacementPlugin())
  }

  return config
}
