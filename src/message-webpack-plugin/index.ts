import chalk from 'chalk'
import { Compiler } from 'webpack'
import { MessageWebpackPluginOptions } from '../types'
import formatWebpackMessages from './format'

const pluginName = 'MessageWebpackPlugin'

/**
 * 消息webpack插件
 */
class MessageWebpackPlugin {
  options: MessageWebpackPluginOptions = {}

  constructor(options: MessageWebpackPluginOptions = {}) {
    this.options = { ...this.options, ...options }
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    const isTTY = process.stdout.isTTY
    const clearConsole = () =>
      process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H')

    compiler.hooks.invalid.tap(pluginName, () => {
      if (isTTY && compiler.options.mode === 'development') clearConsole()
      console.log(`\n🛠 ${chalk.green('正在编译...')}`)
    })

    compiler.hooks.done.tap(pluginName, stats => {
      if (isTTY && compiler.options.mode === 'development') clearConsole()

      if (!stats.hasErrors() && !stats.hasWarnings()) {
        console.log(`\n✅ ${chalk.green('编译成功!')}`)
        this.options.success && this.options.success()
        return
      }

      const message = formatWebpackMessages(
        stats.toJson({
          all: false,
          warnings: true,
          errors: true
        })
      )

      if (message.errors.length > 0) {
        console.log(`\n❌ ${chalk.red('编译失败！')}\n`)
        console.log(message.errors.join('\n\n'))
        this.options.errors && this.options.errors(stats.compilation.errors)
        return
      }

      if (message.warnings.length > 0) {
        console.log(`\n❓${chalk.yellow('编译警告！')}\n`)
        console.log(message.warnings.join('\n\n'))
        this.options.warnings && this.options.warnings(stats.compilation.warnings)
        return
      }
    })
  }
}

export { formatWebpackMessages, MessageWebpackPlugin }

export default MessageWebpackPlugin
