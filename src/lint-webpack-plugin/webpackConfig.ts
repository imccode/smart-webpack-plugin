import { cosmiconfigSync } from 'cosmiconfig'
import eslintFriendlyFormatterfrom from 'eslint-friendly-formatter'
import queueLog from '../queueLog'
import StylelintWebpackPlugin from 'stylelint-webpack-plugin'
import { LintWebpackPluginOptions, SmartCosmiconfigResult } from '../types'
import { Configuration } from 'webpack'
import { isReact, isTypescript, isVue, root } from '../config'
import chalk = require('chalk')

export default (options: LintWebpackPluginOptions) => {
  let regExpStr = isTypescript ? '.(t|j)s' : '.js'
  if (isVue) {
    regExpStr = '.(js|ts|vue)'
  } else if (isReact) {
    regExpStr += 'x?'
  }

  const config: Configuration = {
    module: {
      rules: []
    },
    plugins: []
  }

  if (options.eslint) {
    /**
     * 用户的eslint配置
     */
    const userEslintConfig: SmartCosmiconfigResult<{}> = cosmiconfigSync('eslint', {
      packageProp: 'eslintConfig',
      searchPlaces: [
        '.eslintrc.js',
        '.eslintrc.yaml',
        '.eslintrc.yml',
        '.eslintrc.json',
        '.eslintrc',
        'package.json'
      ]
    }).search()
    if (userEslintConfig) {
      queueLog.info(`已找到用户的${chalk.green('Eslint')}配置，并开启脚本代码校验`)
      /**
       * eslinter校验代码
       */
      config.module.rules.push({
        test: new RegExp(`${regExpStr}$`),
        enforce: 'pre',
        include: root,
        use: [
          {
            loader: 'eslint-loader',
            options: {
              fix: options.eslint.fix || options.fix,
              /**
               * 允许在用户项目根目录查找Eslit配置文件
               */
              useEslintrc: true,
              /**
               * 校验不通过，抛出错误提示
               */
              failOnError: true,
              /**
               * 校验前就行工具格式化
               */
              formatter: eslintFriendlyFormatterfrom
            }
          }
        ]
      })
    } else {
      queueLog.warn(`未找到用户的${chalk.green('Eslint')}配置，不开启脚本代码校验`)
    }
  }

  if (options.stylelint) {
    /**
     * 用户的stylelint配置
     */
    const userStylelintConfig: SmartCosmiconfigResult<{}> = cosmiconfigSync('stylelint').search()
    if (userStylelintConfig) {
      queueLog.info(`已找到用户的${chalk.green('Stylelint')}配置，并开启样式代码校验`)
      config.plugins.push(
        /**
         * 处理stylelint样式校验
         */
        new StylelintWebpackPlugin({
          files: [`**/*.(${isVue ? 'vue|' : ''}css|scss)`],
          fix: options.stylelint.fix || options.fix
        })
      )
    } else {
      queueLog.warn(`未找到用户的${chalk.green('Stylelint')}配置，不开启样式代码校验`)
    }
  }

  return config
}
