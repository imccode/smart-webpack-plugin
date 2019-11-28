import path from 'path'
import { ScriptWebpackPluginOptions } from 'types'
import { Compiler, Configuration } from 'webpack'
import { isVue, root } from '../config'
import { NODE_ENV } from '../env'
import webpackConfig from './webpackConfig'

/**
 * 脚本webpack插件
 */
class ScriptWebpackPlugin {
  options: ScriptWebpackPluginOptions = {
    cacheDirectory: NODE_ENV === 'development' ? path.resolve(root, '.cache', 'script') : false
  }

  webpackConfig: Configuration = {}

  constructor(options: ScriptWebpackPluginOptions = {}) {
    this.options = { ...this.options, ...options }
    this.webpackConfig = webpackConfig(this.options)
  }

  /**
   * 注入vue的loader配置
   * @param compiler
   */
  injectVue(compiler: Compiler) {
    if (isVue) {
      compiler.options.module.rules.push({
        test: /\.vue$/,
        loader: 'vue-loader'
      })
    }
  }

  /**
   * 注入默认配置
   * @param compiler
   */
  inject(compiler: Compiler) {
    const { plugins, output, resolve } = this.webpackConfig
    this.injectVue(compiler)
    compiler.options.output.filename = output.filename
    compiler.options.output.chunkFilename = output.chunkFilename
    compiler.options.resolve.extensions = Array.from(
      new Set([...compiler.options.resolve.extensions, ...resolve.extensions])
    )
    compiler.options.plugins.push(...plugins)
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    this.inject(compiler)
    compiler.hooks.afterEnvironment.tap('ScriptWebpackPlugin', () => {
      compiler.options.module.rules.push(...this.webpackConfig.module.rules)
    })
  }
}

export default ScriptWebpackPlugin
