import AssetWebpackPlugin from 'asset-webpack-plugin'
import chalk from 'chalk'
import MessageWebpackPlugin from 'message-webpack-plugin'
import ScriptWebpackPlugin from 'script-webpack-plugin'
import ServeWebpackPlugin from 'serve-webpack-plugin'
import StyleWebpackPlugin from 'styles-webpack-plugin'
import { Compiler, Configuration } from 'webpack'
import LintWebpackPlugin from './lint-webpack-plugin'
import log from './log'
import { SmartWebpackPluginOptions } from './types'

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
    const { mode, target } = compiler.options
    const { script, style, asset, lint, serve, message } = this.options

    if (!['development', 'production'].includes(mode)) {
      console.log(
        `${chalk.red('请设置 mode 的值，确保为')} ${chalk.bold.green(
          'development'
        )} | ${chalk.bold.green('production')}`
      )
      process.exit(1)
    }

    log.info(`当前构建环境：${chalk.green(mode)}，目标平台：${chalk.green(target)}`)

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
    if (message !== false) {
      compiler.options.plugins.push(new MessageWebpackPlugin(message))
    }
    if (serve !== false) {
      compiler.options.plugins.push(new ServeWebpackPlugin(serve))
    }
  }
}

export default SmartWebpackPlugin

module.exports = SmartWebpackPlugin
