import path from 'path'
import { root } from '../config'
import { NODE_ENV } from '../env'
import { ScriptWebpackPluginOptions } from 'types'
import { Compiler, Configuration } from 'webpack'
import webpackConfig from './webpackConfig'

/**
 * 脚本webpack插件
 */
class ScriptWebpackPlugin {
  options: ScriptWebpackPluginOptions = {
    cacheDirectory: NODE_ENV === 'development' ? path.resolve(root, '.cache', 'babel') : false
  }

  webpackConfig: Configuration = {}

  constructor(options: ScriptWebpackPluginOptions = {}) {
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
    compiler.options.plugins.push(...this.webpackConfig.plugins)
    compiler.hooks.afterEnvironment.tap('ScriptWebpackPlugin', () => this.inject(compiler))
  }
}

export default ScriptWebpackPlugin
