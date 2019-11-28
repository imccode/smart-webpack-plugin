import { ServerWebpackPluginOptions } from 'types'
import { Compiler, Configuration, Entry, EntryFunc } from 'webpack'
import { isReact } from '../config'
import serverOptions from './options'
import Serve from './serve'
import webpackConfig from './webpackConfig'
import path from 'path'

/**
 * server webpack插件
 */
class ServerWebpackPlugin {
  options: ServerWebpackPluginOptions = {
    ...serverOptions
  }

  webpackConfig: Configuration = webpackConfig(this.options)

  constructor(options: ServerWebpackPluginOptions = {}) {
    this.options = { ...this.options, ...options }
  }

  /**
   * 构造一个新的entry
   */
  structureEntry(entry: string | string[] | Entry | EntryFunc, wsPort: number) {
    const entryFileName = path.resolve(__dirname, `./client?wsPort=${wsPort || 55555}`)
    let entryResult = []
    if (typeof entry === 'string') {
      entryResult = [entry, entryFileName]
    } else if (Array.isArray(entry)) {
      entryResult = [...entry, entryFileName]
    }

    if (isReact) {
      entryResult = ['react-hot-loader/patch', ...entryResult]
    }

    return entryResult
  }

  /**
   * 注入默认热更新服务
   * @param compiler
   */
  injectHotServer(compiler: Compiler) {
    const { entry } = compiler.options

    const serve = new Serve(this.options, compiler)
    if (typeof entry === 'object') {
      Object.keys(entry).forEach(key => {
        compiler.options.entry[key] = this.structureEntry(compiler.options.entry[key], serve.wsPort)
      })
    } else if (typeof entry === 'function') {
      const entryConfig = entry()
      compiler.options.entry = {}
      if (typeof entryConfig === 'object') {
        Object.keys(entry).forEach(key => {
          compiler.options.entry[key] = this.structureEntry(compiler.options.entry[key], serve.wsPort)
        })
      }
    } else {
      compiler.options.entry = this.structureEntry(compiler.options.entry, serve.wsPort)
    }
  }

  /**
   * 注入默认配置
   * @param compiler
   */
  inject(compiler: Compiler) {
    const { plugins, mode, stats, devtool, watch, output, resolve } = this.webpackConfig

    compiler.options.mode = mode
    compiler.options.devtool = devtool
    compiler.options.stats = stats
    compiler.options.output.filename = output.filename
    compiler.options.output.chunkFilename = output.chunkFilename
    compiler.options.watch = watch
    compiler.options.resolve.alias = {
      ...compiler.options.resolve.alias,
      ...resolve.alias
    }
    compiler.options.plugins.push(...plugins)
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    this.inject(compiler)
    this.injectHotServer(compiler)
  }
}

export default ServerWebpackPlugin
