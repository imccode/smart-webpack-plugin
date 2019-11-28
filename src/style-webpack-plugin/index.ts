import path from 'path'
import { StyleWebpackPluginOptions } from 'types'
import { Compiler, Configuration } from 'webpack'
import { isVue, root } from '../config'
import { NODE_ENV } from '../env'
import webpackConfig from './webpackConfig'

/**
 * 样式webpack插件
 */
class StyleWebpackPlugin {
  options: StyleWebpackPluginOptions = {
    cacheDirectory: NODE_ENV === 'development' ? path.resolve(root, '.cache', 'style') : false
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
    compiler.options.plugins.push(...this.webpackConfig.plugins)
  }

  /**
   * 注入默认Loader配置
   * @param compiler
   */
  injectRules(compiler: Compiler) {
    compiler.options.module.rules.push(...this.webpackConfig.module.rules)
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    this.inject(compiler)
    if (isVue) {
      this.injectRules(compiler)
    } else {
      compiler.hooks.afterEnvironment.tap('StyleWebpackPlugin', () => this.injectRules(compiler))
    }
  }
}

export default StyleWebpackPlugin
