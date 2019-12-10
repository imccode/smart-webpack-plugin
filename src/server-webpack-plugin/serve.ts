import Koa from 'koa'
import koaCompress from 'koa-compress'
import koaStatic from 'koa-static'
import { Compiler } from 'webpack'
import { ServerWebpackPluginOptions } from '../types'

class Serve {
  private options: ServerWebpackPluginOptions
  private httpServer: Koa<Koa.DefaultState, Koa.DefaultContext>
  private compiler: Compiler

  constructor(options: ServerWebpackPluginOptions, compiler: Compiler) {
    this.options = options
    this.compiler = compiler
    this.httpServer = new Koa()
    this.initServer()
  }

  initServer() {

    this.httpServer.use(koaStatic(this.compiler.options.output.path))

    if (this.options.compress) {
      this.httpServer.use(koaCompress())
    }

    this.httpServer.listen(this.options.port)
  }
}

export default Serve
