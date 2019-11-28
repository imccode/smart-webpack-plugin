import { WSMessageType } from 'types'
import querystring from 'querystring'

interface Options {
  url: string
}

type HotArgsInfo = (info: any) => void

interface HotOptions {
  ignoreUnaccepted?(args: boolean): void
  ignoreDeclined?(args: boolean): void
  ignoreErrored?(args: boolean): void
  onDeclined?(args: HotArgsInfo): void
  onUnaccepte?(args: boolean): void
  onAccepted?(args: boolean): void
  onDisposed?(args: boolean): void
  onErrored?(args: boolean): void
}

interface HotType {
  status(): 'idle' | 'check' | 'prepare' | 'ready' | 'dispose' | 'apply' | 'abort' | 'fail'
  check(HotOptions?): Promise<Array<number>>
  apply(HotOptions?): Promise<Array<number>>
}

const log = msg => console.warn('Smart-Webpack-Plugin: ' + msg)

class ClientSocket {
  socket: WebSocket
  options: Options

  constructor(options: Options) {
    this.options = options
    this.connect()
  }

  connect() {
    this.socket = new window.WebSocket(this.options.url, 'ws')
    this.socket.addEventListener('open', () => log('热更新初始化成功！'))
    this.socket.addEventListener('close', () => log('已停止编译服务！'))
  }

  close() {
    log('已停止编译服务！')
    this.socket && this.socket.close()
  }

  addEventListener(type: keyof WebSocketEventMap, listener: (this: WebSocket, ev: any) => any) {
    this.socket.addEventListener(type, listener)
  }

  removeEventListener(type: keyof WebSocketEventMap, listener: (this: WebSocket, ev: any) => any) {
    this.socket.removeEventListener(type, listener)
  }
}

const hotUpdate = async (now: number) => {
  // @ts-ignore
  const hot: HotType = module.hot
  if (hot) {
    let updatedModules: Array<number>

    /**
     * 执行更新
     */
    const hotApply = async () => {
      try {
        const outdatedModules = await hot.apply({
          ignoreUnaccepted: true,
          ignoreDeclined: true,
          ignoreErrored: true,
          onErrored(data) {
            console.error('发生错误:\n', new Error(data))
          }
        })

        log(
          '检测到代码更变，编译完成，局部页面已更新！用时：' +
            ((Date.now() - now) / 1000).toFixed(2) +
            's'
        )
      } catch (error) {
        console.error(new Error(error))
        return
      }
    }

    const status = hot.status()
    if (['fail', 'abort'].includes(status)) {
      log('检测到代码更变，编译完成，整页重新加载！')
      window.location.reload()
      return
    }

    if (status === 'idle') {
      try {
        updatedModules = await hot.check()
        if (updatedModules) {
          hotUpdate(now)
          return
        }
        hotApply()
      } catch (error) {
        console.error(new Error(error))
        return
      }
    }

    if (status === 'ready') {
      hotApply()
    }
  }
}

const client = buildHash => {
  // @ts-ignore
  const params: { wsPort: number } = querystring.parse(__resourceQuery.slice(1))

  const socket = new ClientSocket({
    url: `ws://127.0.0.1:${params.wsPort || 55555}`
  })

  window.addEventListener('beforeunload', socket.close)

  socket.addEventListener('message', message => {
    const { type, data }: { type: WSMessageType; data?: any } = JSON.parse(message.data)
    let now = Date.now()
    switch (type) {
      case 'beforeUpdate':
        {
          log(`监测到${data.fileName}文件变动，正在编译更新...`)
          now = data.changeTime
        }
        break
      case 'invalidUpdate':
        log(`无效更新，没有实质性的内容变动!`)
        break
      case 'update':
        buildHash !== data && hotUpdate(now)
        break
      case 'error':
        console.error(`编译发生错误`, new Error(data))
        break
    }
  })
}

;(() => {
  let hash = '<unknown>'

  try {
    // @ts-ignore
    hash = __webpack_hash__
  } catch (e) {}

  client(hash)
})()
