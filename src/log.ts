import webpackLog from 'webpack-log'

type Log = {
  /**
   * 显示消息
   * @param message 消息文本
   * 蓝色
   */
  info(message): void
  /**
   * 提示消息
   * @param message 消息文本
   * 黄色
   */
  warn(message): void
  /**
   * 错误消息
   * @param message 消息文本
   * 红色
   */
  error(message): void
  /**
   * 调试消息
   * @param message 消息文本
   * 紫色
   */
  debug(message): void
}

const log: Log = webpackLog({ name: 'smart-webpack-plugin' })

export default log
