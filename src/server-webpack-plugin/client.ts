import { WSMessageType } from 'types'

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
  }

  close() {
    this.socket && this.socket.close()
  }

  addEventListener(type: keyof WebSocketEventMap, listener: (this: WebSocket, ev: any) => any) {
    this.socket.addEventListener(type, listener)
  }

  removeEventListener(type: keyof WebSocketEventMap, listener: (this: WebSocket, ev: any) => any) {
    this.socket.removeEventListener(type, listener)
  }
}

const hotUpdate = async () => {
  // @ts-ignore
  const hot: HotType = module.hot
  if (hot) {
    let updatedModules: Array<number>
    const status = hot.status()
    console.log(status)

    if (['fail', 'abort'].includes(status)) {
      log('编译完成，整页重新加载！')
      window.location.reload()
      return
    }

    if (status === 'idle') {
      try {
        updatedModules = await hot.check()
        if (!updatedModules) return
      } catch (error) {
        console.error(error)
        return
      }
    }

    try {
      const outdatedModules = await hot.apply({
        ignoreUnaccepted: true,
        ignoreDeclined: true,
        ignoreErrored: true,
        onErrored(data) {
          console.error('发生错误:\n', data)
        }
      })
      log('编译完成，页面部分更新！')

      const unacceptedModules = updatedModules.filter(
        moduleId => outdatedModules && !outdatedModules.includes(moduleId)
      )
      if (unacceptedModules.length > 0) window.location.reload()
    } catch (error) {
      console.error(error)
    }
  }
}

const client = buildHash => {
  const socket = new ClientSocket({
    url: 'ws://127.0.0.1:55551'
  })

  window.addEventListener('beforeunload', socket.close)

  socket.addEventListener('message', message => {
    const { type, data }: { type: WSMessageType; data?: any } = JSON.parse(message.data)
    switch (type) {
      case 'beforeUpdate':
        log('正在编译最新代码...')
        break
      case 'update':
        buildHash === data ? log('代码无改变，暂不更新!') : hotUpdate()
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
