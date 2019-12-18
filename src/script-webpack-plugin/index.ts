import path from 'path'
import { Compiler, Configuration } from 'webpack'
import { isVue, root } from '../config'
import { ScriptWebpackPluginOptions } from '../types'
import { includesEntry } from '../utils'
import webpackConfig from './webpackConfig'

const pluginName = 'ScriptWebpackPlugin'

/**
 * 脚本webpack插件
 */
class ScriptWebpackPlugin {
  options: ScriptWebpackPluginOptions = {
    cacheDirectory: path.resolve(root, '.cache', 'script'),
    dropConsole: true,
    hot: true
  }

  webpackConfig: Configuration = {}

  constructor(options: ScriptWebpackPluginOptions = {}) {
    this.options = { ...this.options, ...options }
  }

  /**
   * 注入vue的loader配置
   * @param compiler
   */
  injectVue(compiler: Compiler) {
    if (isVue) {
      compiler.options.module.rules.push({
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          hotReload: this.options.hot
        }
      })
    }
  }

  /**
   * 注入默认配置
   * @param compiler
   */
  inject(compiler: Compiler) {
    const { plugins, output, resolve, optimization } = this.webpackConfig
    this.injectVue(compiler)
    compiler.options.output.filename = output.filename
    compiler.options.output.chunkFilename = output.chunkFilename
    compiler.options.resolve.extensions = Array.from(
      new Set([...compiler.options.resolve.extensions, ...resolve.extensions])
    )
    compiler.options.plugins.push(...plugins)

    if (compiler.options.mode === 'production') {
      compiler.options.optimization = {
        ...compiler.options.optimization,
        ...optimization,
        splitChunks: {
          ...compiler.options.optimization.splitChunks,
          ...optimization.splitChunks
        }
      }
    }
  }

  /**
   * 注入热更新代码
   * @param compiler
   */
  injectHot(compiler: Compiler) {
    compiler.hooks.normalModuleFactory.tap(pluginName, normalModuleFactory => {
      normalModuleFactory.hooks.afterResolve.tap(pluginName, data => {
        if (
          !/node_modules/.test(data.resource) &&
          !data.rawRequest.includes('hot/client?wsPort') &&
          includesEntry(compiler.options.entry, data.rawRequest)
        ) {
          data.loaders.unshift({
            loader: path.resolve(__dirname, './reactRefreshLoader')
          })
        }
        return data
      })
    })
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
    if (this.options.hot) this.injectHot(compiler)
    compiler.hooks.afterEnvironment.tap(pluginName, () => {
      compiler.options.module.rules.push(...this.webpackConfig.module.rules)
    })
  }
}

export default ScriptWebpackPlugin
