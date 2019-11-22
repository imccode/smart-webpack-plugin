import { ScriptWebpackPluginOptions, SmartWebpackPluginOptions } from 'types'
import { Compiler, Configuration } from 'webpack'
import AssetWebpackPlugin from './asset-webpack-plugin'
import LintWebpackPlugin from './lint-webpack-plugin'
import ScriptWebpackPlugin from './script-webpack-plugin'
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
    const { script, style, asset, lint } = this.options
    compiler.options.plugins.push(
      ...[
        new ScriptWebpackPlugin(script),
        new StyleWebpackPlugin(style),
        new AssetWebpackPlugin(asset),
        new LintWebpackPlugin(lint)
      ]
    )
  }
}

export default SmartWebpackPlugin
