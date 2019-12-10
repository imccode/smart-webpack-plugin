import chalk from 'chalk'
import path from 'path'
import { Compiler, Configuration } from 'webpack'
import log from '../log'
import { ServerWebpackPluginOptions } from '../types'
import { structureEntry } from '../utils'
import WsServe from './hot/wsServe'
import Serve from './serve'
import webpackConfig from './webpackConfig'

/**
 * server webpack插件
 */
class ServerWebpackPlugin {
  options: ServerWebpackPluginOptions = {
    port: 8080,
    compress: false,
    hot: true
  }

  webpackConfig: Configuration = webpackConfig(this.options)

  constructor(options: ServerWebpackPluginOptions = {}) {
    this.options = { ...this.options, ...options }
  }

  /**
   * 注入默认热更新服务
   * @param compiler
   */
  injectHotServer(compiler: Compiler) {
    const { entry } = compiler.options

    const serve = new WsServe(this.options, compiler)
    const entryFileName = path.resolve(__dirname, `./hot/client?wsPort=${serve.wsPort || 55555}`)

    compiler.options.entry = structureEntry(entry, entryFileName)
  }

  /**
   * 注入默认配置
   * @param compiler
   */
  inject(compiler: Compiler) {
    const { plugins, devtool, watch, output, resolve } = this.webpackConfig

    compiler.options.devtool = devtool
    compiler.options.output.path = output.path
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
    new Serve(this.options, compiler)
    if (this.options.hot) {
      log.info(`已开启${chalk.green('Hot')}代码热更新`)
      this.injectHotServer(compiler)
    }
  }
}

export default ServerWebpackPlugin
