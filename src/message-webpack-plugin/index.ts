import chalk from 'chalk'
import { Compiler, Configuration } from 'webpack'
import { MessageWebpackPluginOptions } from '../types'
import formatWebpackMessages from './format'
import webpackConfig from './webpackConfig'

const pluginName = 'MessageWebpackPlugin'

/**
 * 消息webpack插件
 */
class MessageWebpackPlugin {
  options: MessageWebpackPluginOptions = {}

  webpackConfig: Configuration = {}

  constructor(options: MessageWebpackPluginOptions = {}) {
    this.options = { ...this.options, ...options }
  }

  /**
   * 执行插件
   * @param compiler
   */
  apply(compiler: Compiler) {
    this.webpackConfig = webpackConfig(this.options, compiler)
    compiler.options.stats = this.webpackConfig.stats
    const { invalid, done } = compiler.hooks

    const isTTY = process.stdout.isTTY
    const clearConsole = () =>
      process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H')

    invalid.tap(pluginName, () => {
      if (isTTY && compiler.options.mode === 'development') clearConsole()
      console.log(`\n🛠 ${chalk.green('正在编译...')}`)
    })

    done.tap(pluginName, stats => {
      if (isTTY && compiler.options.mode === 'development') clearConsole()

      if (!stats.hasErrors() && !stats.hasWarnings()) {
        console.log(`\n✅ ${chalk.green('编译成功!')}`)
        this.options.onSuccess && this.options.onSuccess()
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
        console.log(`\n⭕️ ${chalk.red('编译失败！')}\n`)
        console.log(message.errors.join('\n\n'))
        this.options.onError && this.options.onError(stats.compilation.errors)
        return
      }

      if (message.warnings.length > 0) {
        console.log(`\n❔ ${chalk.yellow('编译警告！')}\n`)
        console.log(message.warnings.join('\n\n'))
        this.options.onWarning && this.options.onWarning(stats.compilation.warnings)
        return
      }
    })
  }
}

export { formatWebpackMessages, MessageWebpackPlugin }

export default MessageWebpackPlugin
