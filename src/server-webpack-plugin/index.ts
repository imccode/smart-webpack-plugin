import { ServerWebpackPluginOptions } from 'types'
import { Compiler, Entry, EntryFunc, Configuration } from 'webpack'
import serverOptions from './options'
import webpackConfig from './webpackConfig'
import Serve from './serve'

const pluginName = 'ServerWebpackPlugin'

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
    const entryFileName = './src/server-webpack-plugin/client.ts'

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
    const { plugins, mode, stats, devtool, watch, output } = this.webpackConfig
    const { entry } = compiler.options

    compiler.options.mode = mode
    compiler.options.stats = stats
    compiler.options.devtool = devtool
    compiler.options.output.filename = output.filename
    compiler.options.output.chunkFilename = output.chunkFilename
    compiler.options.watch = watch
    compiler.options.plugins.push(...plugins)

    if (this.options.hot) {
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
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    if (this.options.enable) {
      const { done, watchClose, watchRun } = compiler.hooks

      this.inject(compiler)

      const serve = new Serve(this.options, compiler)
      if (this.options.hot) {
        serve.openWS()

        /**
         * 编译(compilation)完成
         */
        done.tap(pluginName, stats => {
          serve.sendWS('update', stats.hash)
        })

        /**
         * 监听模式下，一个新的编译(compilation)触发之后，执行一个插件，但是是在实际编译开始之前
         */
        watchRun.tap(pluginName, stats => {
          serve.sendWS('beforeUpdate')
        })

        /**
         * 监听模式停止
         */
        watchClose.tap(pluginName, () => {
          serve.sendWS('close')
          serve.closeWS()
        })
      }
    }
  }
}

export default ServerWebpackPlugin
