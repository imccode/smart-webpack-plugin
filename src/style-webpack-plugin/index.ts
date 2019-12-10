import path from 'path'
import { Compiler, Configuration } from 'webpack'
import { isVue, root } from '../config'
import { StyleWebpackPluginOptions } from '../types'
import webpackConfig from './webpackConfig'

/**
 * 样式webpack插件
 */
class StyleWebpackPlugin {
  options: StyleWebpackPluginOptions = {
    cacheDirectory: path.resolve(root, '.cache', 'style')
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
    this.options.cacheDirectory =
      compiler.options.mode === 'production' ? false : this.options.cacheDirectory

    this.webpackConfig = webpackConfig(this.options, compiler)

    this.inject(compiler)
    if (isVue) {
      this.injectRules(compiler)
    } else {
      compiler.hooks.afterEnvironment.tap('StyleWebpackPlugin', () => this.injectRules(compiler))
    }
  }
}

export default StyleWebpackPlugin
