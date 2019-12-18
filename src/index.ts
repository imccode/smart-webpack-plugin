import { SmartWebpackPluginOptions } from './types'
import { Compiler, Configuration } from 'webpack'
import AssetWebpackPlugin from 'asset-webpack-plugin'
import LintWebpackPlugin from './lint-webpack-plugin'
import MessageWebpackPlugin from './message-webpack-plugin'
import ProgressWebpackPlugin from './progress-webpack-plugin'
import log from './log'
import ScriptWebpackPlugin from './script-webpack-plugin'
import ServerWebpackPlugin from './server-webpack-plugin'
import StyleWebpackPlugin from './style-webpack-plugin'
import chalk = require('chalk')
import { localIps } from './utils'

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
    const { script, style, asset, lint, progress, server, message } = this.options
    const port = 33333

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
      compiler.options.plugins.push(
        new MessageWebpackPlugin({
          ...(message || {}),
          onSuccess() {
            if (mode !== 'development') return
            console.log('\n在浏览器打开以下地址浏览.\n')
            console.log(`  本地地址：${chalk.underline(`http://localhost:${port}`)}`)
            localIps()
              .map(ip => `  网络地址: ${chalk.underline(`http://${ip}:${port}`)}`)
              .forEach(msg => {
                console.log(msg)
              })
          }
        })
      )
    }
    // if (progress !== false) {
    //   compiler.options.plugins.push(new ProgressWebpackPlugin(progress))
    // }

    if (server !== false && mode === 'development') {
      compiler.options.plugins.push(
        new ServerWebpackPlugin({
          ...(server || {}),
          port
        })
      )
    }
  }
}

export default SmartWebpackPlugin

module.exports = SmartWebpackPlugin
