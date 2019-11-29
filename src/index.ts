import { SmartWebpackPluginOptions } from './types'
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
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    const { script, style, asset, lint, progress, server } = this.options

    if (script !== false) {
      compiler.options.plugins.push(new ScriptWebpackPlugin(script))
    }
    if (style !== false) {
      compiler.options.plugins.push(new StyleWebpackPlugin(style))
    }
    if (asset !== false) {
      compiler.options.plugins.push(new AssetWebpackPlugin(asset))
    }
    if (lint !== false) {
      compiler.options.plugins.push(new LintWebpackPlugin(lint))
    }
    if (progress !== false) {
      compiler.options.plugins.push(new ProgressWebpackPlugin(progress))
    }

    if (server !== false && NODE_ENV === 'development') {
      compiler.options.plugins.push(new ServerWebpackPlugin(server))
    }

    /**
     * 打印队列消息
     */
    queueLog.apply()
  }
}

export default SmartWebpackPlugin

module.exports = SmartWebpackPlugin

export { SmartWebpackPlugin, ScriptWebpackPlugin, StyleWebpackPlugin, AssetWebpackPlugin, LintWebpackPlugin, ProgressWebpackPlugin, ServerWebpackPlugin }

