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
  private compiler: Compiler
  wsPort: number

  constructor(options: ServerWebpackPluginOptions, compiler: Compiler) {
    this.options = options
    this.compiler = compiler
    this.httpServer = new Koa()
    this.initServer()
  }

  initServer() {
    const createWsServer = () => {
      try {
        this.wsPort = Math.floor(Math.random() * 10000 + 50000)
        this.wsServer = new WebSocket.Server({
          noServer: false,
          port: this.wsPort
        })
      } catch (error) {
        createWsServer()
      }
    }

    createWsServer()

    this.openWS()

    this.httpServer.use(koaStatic(this.compiler.options.output.path))

    if (this.options.compress) {
      this.httpServer.use(koaCompress())
    }

    this.httpServer.listen(this.options.port)
  }

  /**
   * 打开长连接
   */
  openWS() {
    this.wsServer.on('connection', ws => {
      this.ws = ws
      this.hooks()
    })
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

  hooks() {
    const pluginName = 'ServerWebpackPlugin'
    const { done, invalid } = this.compiler.hooks

    let lastHash

    /**
     * 无效编译
     */
    invalid.tap(pluginName, (fileName, changeTime) => {
      this.sendWS('beforeUpdate', {
        fileName,
        changeTime
      })
    })

    /**
     * 编译完成
     */
    done.tap(pluginName, stats => {
      if (lastHash === stats.hash) {
        this.sendWS('invalidUpdate')
        return
      }
      lastHash = stats.hash

      if (stats.hasErrors()) {
        this.sendWS('error', stats.toString())
        return
      }

      this.sendWS('update', stats.hash)
    })
  }
}

export default Serve
