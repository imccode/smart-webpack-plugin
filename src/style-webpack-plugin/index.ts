import path from 'path'
import { root } from 'src/config'
import { NODE_ENV } from 'src/env'
import { Compiler, Configuration } from 'webpack'
import webpackConfig from './webpackConfig'

class StyleWebpackPlugin {
  options: StyleWebpackPluginOptions = {
    cacheDirectory: NODE_ENV === 'development' ? path.resolve(root, '.cache', 'babel') : false
  }

  webpackConfig: Configuration = {}

  constructor(options: StyleWebpackPluginOptions = {}) {
    this.options = { ...this.options, ...options }
    this.webpackConfig = webpackConfig(this.options)
  }

  /**
   * 注入默认配置
   * @param compiler
   */
  inject(compiler: Compiler) {
    compiler.options.module.rules.push(...this.webpackConfig.module.rules)
    compiler.options.plugins.push(...this.webpackConfig.plugins)
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    compiler.hooks.afterEnvironment.tap('StyleWebpackPlugin', () => this.inject(compiler))
  }
}

export default StyleWebpackPlugin
