import path from 'path'
import { root } from '../config'
import { NODE_ENV } from '../env'
import { StyleWebpackPluginOptions } from 'types'
import { Compiler, Configuration } from 'webpack'
import webpackConfig from './webpackConfig'

/**
 * 样式webpack插件
 */
class StyleWebpackPlugin {
  options: StyleWebpackPluginOptions = {
    enable: true,
    cacheDirectory: NODE_ENV === 'development' ? path.resolve(root, '.cache', 'babel') : false
  }

  webpackConfig: Configuration = {}

  constructor(options: StyleWebpackPluginOptions = {}) {
    this.options = {
      ...this.options,
      ...options,
      cssLoader: {
        ...this.options.cssLoader,
        ...(options.cssLoader || {})
      }
    }
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
    if (this.options.enable) {
      compiler.hooks.afterEnvironment.tap('StyleWebpackPlugin', () => this.inject(compiler))
    }
  }
}

export default StyleWebpackPlugin
