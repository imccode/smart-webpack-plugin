import { LintWebpackPluginOptions } from 'types'
import { Compiler, Configuration } from 'webpack'
import webpackConfig from './webpackConfig'

/**
 * 代码校验webpack插件
 */
class LintWebpackPlugin {
  options: LintWebpackPluginOptions = {
    enable: true,
    fix: true,
    eslint: {
      fix: true,
      enable: true
    },
    stylint: {
      fix: true,
      enable: true
    }
  }

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
      stylint:
        options.stylint === false
          ? false
          : {
              ...this.options.stylint,
              ...(options.stylint || {})
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
