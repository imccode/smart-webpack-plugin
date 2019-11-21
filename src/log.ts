import webpackLog from 'webpack-log'

/**
 * 延时队列消息
 */
class QueueLog {
  /**
   * 存储消息数组
   */
  private message: Array<{
    type: 'info' | 'warn' | 'error' | 'debug'
    text: string
  }> = []

  /**
   * webpackLog实体
   */
  private self = {}

  /**
   * 返回存储消息长度
   */
  get length() {
    return this.message.length
  }

  constructor(name: string) {
    this.self = webpackLog({ name })
  }

  /**
   * 显示消息
   * @param message 消息文本
   * 蓝色
   */
  info(message: string) {
    this.message.push({
      type: 'info',
      text: message
    })
  }

  /**
   * 提示消息
   * @param message 消息文本
   * 黄色
   */
  warn(message: string) {
    this.message.push({
      type: 'warn',
      text: message
    })
  }

  /**
   * 错误消息
   * @param message 消息文本
   * 红色
   */
  error(message: string) {
    this.message.push({
      type: 'error',
      text: message
    })
  }

  /**
   * 调试消息
   * @param message 消息文本
   * 紫色
   */
  debug(message: string) {
    this.message.push({
      type: 'debug',
      text: message
    })
  }

  /**
   * 打印存储的消息
   */
  apply() {
    this.message.forEach(({ type, text }) => {
      this.self[type](text)
    })
    this.message = []
  }
}

export default new QueueLog('smart-webpack-plugin')
