import Koa from 'koa'
import koaStatic from 'koa-static'
import koaCompress from 'koa-compress'
import { ServerWebpackPluginOptions } from 'types'
import { Compiler } from 'webpack'

export default (options: ServerWebpackPluginOptions, compiler: Compiler) => {
  const app = new Koa()

  app.use(koaStatic(compiler.options.output.path))

  if (options.compress) {
    app.use(koaCompress())
  }

  app.listen(options.port)
}
