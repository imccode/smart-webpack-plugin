import { AssetWebpackPluginOptions } from 'types'
import { Compiler, Configuration } from 'webpack'
import webpackConfig from './webpackConfig'

/**
 * 媒体资源webpack插件
 */
class AssetWebpackPlugin {
  options: AssetWebpackPluginOptions = {
    enable: true
  }

  webpackConfig: Configuration = {}

  constructor(options: AssetWebpackPluginOptions = {}) {
    this.options = { ...this.options, ...options }
    this.webpackConfig = webpackConfig(this.options)
  }

  /**
   * 注入默认配置
   * @param compiler
   */
  inject(compiler: Compiler) {
    compiler.options.module.rules.push(...this.webpackConfig.module.rules)
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    if (this.options.enable) {
      compiler.hooks.afterEnvironment.tap('AssetWebpackPlugin', () => this.inject(compiler))
    }
  }
}

export default AssetWebpackPlugin
