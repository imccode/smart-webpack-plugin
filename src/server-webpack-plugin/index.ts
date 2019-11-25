import { ServerWebpackPluginOptions } from 'types'
import { Compiler, Entry, EntryFunc, Configuration } from 'webpack'
import serverOptions from './options'
import webpackConfig from './webpackConfig'
import serve from './serve'

/**
 * server webpack插件
 */
class ServerWebpackPlugin {
  options: ServerWebpackPluginOptions = {
    enable: process.env.NODE_ENV === 'development',
    ...serverOptions
  }

  webpackConfig: Configuration = webpackConfig(this.options)

  constructor(options: ServerWebpackPluginOptions = {}) {
    this.options = { ...this.options, ...options }
  }

  /**
   * 构造一个新的entry
   */
  structureEntry(entry: string | string[] | Entry | EntryFunc) {
    const entryFileName = 'webpack-plugin-serve/client'

    if (typeof entry === 'string') {
      return [entry, entryFileName]
    } else if (Array.isArray(entry)) {
      return [...entry, entryFileName]
    }
  }

  /**
   * 注入默认配置
   * @param compiler
   */
  inject(compiler: Compiler) {
    const { plugins, mode, stats, devtool, watch } = this.webpackConfig
    const { entry } = compiler.options

    compiler.options.mode = mode
    compiler.options.stats = stats
    compiler.options.devtool = devtool
    compiler.options.watch = watch
    compiler.options.plugins.push(...plugins)

    if (typeof entry === 'object') {
      Object.keys(entry).forEach(key => {
        compiler.options.entry[key] = this.structureEntry(compiler.options.entry[key])
      })
    } else if (typeof entry === 'function') {
      const entryConfig = entry()
      compiler.options.entry = {}
      if (typeof entryConfig === 'object') {
        Object.keys(entry).forEach(key => {
          compiler.options.entry[key] = this.structureEntry(compiler.options.entry[key])
        })
      }
    } else {
      compiler.options.entry = this.structureEntry(compiler.options.entry)
    }
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    if (this.options.enable) {
      this.inject(compiler)
      compiler.hooks.afterEnvironment.tap('ServerWebpackPlugin', () =>
        serve(this.options, compiler)
      )
    }
  }
}

export default ServerWebpackPlugin
