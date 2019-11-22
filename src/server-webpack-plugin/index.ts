import path from 'path'
import { LibWebpackPluginOptions } from 'types'
import Koa from 'koa'
import koaWebpack from 'koa-webpack'
import { Compiler, Configuration } from 'webpack'
import { root } from '../config'
import webpackConfig from './webpackConfig'

/**
 * server webpack插件
 */
class ServerWebpackPlugin {
  options: LibWebpackPluginOptions = {
    outDirectory: path.resolve(root, 'lib')
  }

  webpackConfig: Configuration = {}

  constructor(options: LibWebpackPluginOptions = {}) {
    this.options = {
      ...this.options,
      ...options
    }

    this.webpackConfig = webpackConfig(this.options)
  }

  /**
   * 注入默认配置
   * @param compiler
   */
  inject(compiler: Compiler) {
    const { plugins, mode, output } = this.webpackConfig
    compiler.options.mode = mode
    compiler.options.plugins.push(...plugins)
    compiler.outputPath = output.path
    compiler.options.output = {
      ...compiler.options.output,
      ...output
    }
  }

  initServer(compiler: Compiler) {
    const app = new Koa()
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap('ServerWebpackPlugin', () => this.initServer(compiler))
  }
}

export default ServerWebpackPlugin
