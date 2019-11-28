import { AssetWebpackPluginOptions, FrameworkState } from 'types'
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

  private framework: FrameworkState
  
  constructor(options: AssetWebpackPluginOptions = {}, framework: FrameworkState = {}) {
    this.options = { ...this.options, ...options }
    this.webpackConfig = webpackConfig(this.options)
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
      compiler.hooks.afterEnvironment.tap('AssetWebpackPlugin', () => {
        compiler.options.module.rules.push(...this.webpackConfig.module.rules)
      })
  }
}

export default AssetWebpackPlugin
