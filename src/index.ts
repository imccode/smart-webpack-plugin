import { SmartWebpackPluginOptions } from 'types'
import { Compiler, Configuration } from 'webpack'
import AssetWebpackPlugin from './asset-webpack-plugin'
import { NODE_ENV } from './env'
import LintWebpackPlugin from './lint-webpack-plugin'
import ProgressWebpackPlugin from './progress-webpack-plugin'
import queueLog from './queueLog'
import ScriptWebpackPlugin from './script-webpack-plugin'
import ServerWebpackPlugin from './server-webpack-plugin'
import StyleWebpackPlugin from './style-webpack-plugin'

/**
 * smart webpack 插件
 */
class SmartWebpackPlugin {
  options: SmartWebpackPluginOptions = {}

  webpackConfig: Configuration = {}

  constructor(options: SmartWebpackPluginOptions = {}) {
    this.options = { ...this.options, ...options }
    /**
     * 打印队列消息
     */
    queueLog.apply()
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    const { script, style, asset, lint, progress } = this.options
    compiler.options.plugins.push(
      ...[
        new ScriptWebpackPlugin(script),
        new StyleWebpackPlugin(style),
        new AssetWebpackPlugin(asset),
        new LintWebpackPlugin(lint),
        new ProgressWebpackPlugin(progress)
      ]
    )

    if (NODE_ENV === 'development') {
      compiler.options.plugins.push(new ServerWebpackPlugin())
    }
  }
}

export default SmartWebpackPlugin
