import Koa from 'koa'
import koaStatic from 'koa-static'
import koaCompress from 'koa-compress'
import { ServerWebpackPluginOptions, WSMessageType } from 'types'
import { Compiler } from 'webpack'
import WebSocket from 'ws'

class Serve {
  private options: ServerWebpackPluginOptions
  private ws: WebSocket
  private httpServer: Koa<Koa.DefaultState, Koa.DefaultContext>
  private wsServer: WebSocket.Server

  constructor(options: ServerWebpackPluginOptions, compiler: Compiler) {
    this.options = options
    this.httpServer = new Koa()
    this.initServer(compiler)
  }

  initServer(compiler: Compiler) {
    if (this.options.hot) {
      this.wsServer = new WebSocket.Server({
        noServer: false,
        port: 55551
      })
    }

    this.httpServer.use(koaStatic(compiler.options.output.path))

    if (this.options.compress) {
      this.httpServer.use(koaCompress())
    }

    this.httpServer.listen(this.options.port)
  }

  /**
   * 打开长连接
   */
  openWS() {
    this.wsServer.on('connection', ws => (this.ws = ws))
  }

  /**
   * 发送长连接数据-到客户端
   * @param data 发送的数据
   */
  sendWS(type: WSMessageType, data?: any): Promise<Error | undefined> {
    return new Promise(resolve => {
      if (this.ws)
        this.ws
          ? this.ws.send(
              JSON.stringify({
                type,
                data
              }),
              (err?: Error) => resolve(err)
            )
          : resolve(new Error('长连接还未创建成功'))
    })
  }

  /**
   * 关闭长连接
   */
  closeWS() {
    this.wsServer.close()
  }
}

export default Serve
