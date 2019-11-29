import { LintWebpackPluginOptions } from 'index'
import { Compiler, Configuration } from 'webpack'
import lintOptions from './options'
import webpackConfig from './webpackConfig'

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
    compiler.options.plugins.push(...this.webpackConfig.plugins)
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    this.inject(compiler)
    compiler.hooks.afterEnvironment.tap('LintWebpackPlugin', () => {
      compiler.options.module.rules.push(...this.webpackConfig.module.rules)
    })
  }
}

export default LintWebpackPlugin
