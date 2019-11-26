import { LintWebpackPluginOptions } from 'types'
import { Compiler, Configuration } from 'webpack'
import webpackConfig from './webpackConfig'
import lintOptions from './options'

/**
 * 代码校验webpack插件
 */
class LintWebpackPlugin {
  options: LintWebpackPluginOptions = lintOptions

  webpackConfig: Configuration = {}

  constructor(options: LintWebpackPluginOptions = {}) {
    this.options = {
      ...this.options,
      ...options,
      eslint:
        options.eslint === false
          ? false
          : {
              ...this.options.eslint,
              ...(options.eslint || {})
            },
      stylelint:
        options.stylelint === false
          ? false
          : {
              ...this.options.stylelint,
              ...(options.stylelint || {})
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
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    if (this.options.enable) {
      compiler.options.plugins.push(...this.webpackConfig.plugins)
      compiler.hooks.afterEnvironment.tap('LintWebpackPlugin', () => this.inject(compiler))
    }
  }
}

export default LintWebpackPlugin
