import { ProgressWebpackPluginOptions } from 'index'
import { Compiler, Configuration } from 'webpack'
import webpackConfig from './webpackConfig'

/**
 * 媒体资源webpack插件
 */
class ProgressWebpackPlugin {
  options: ProgressWebpackPluginOptions = {}

  webpackConfig: Configuration = {}

  constructor(options: ProgressWebpackPluginOptions = {}) {
    this.options = { ...this.options, ...options }
    this.webpackConfig = webpackConfig(this.options)
  }

  /**
   * 注入默认配置
   * @param compiler
   */
  inject(compiler: Compiler) {
    compiler.options.plugins.push(...this.webpackConfig.plugins)
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    this.inject(compiler)
  }
}

export default ProgressWebpackPlugin
