import eslintFriendlyFormatterfrom from 'eslint-friendly-formatter'
import StylelintWebpackPlugin from 'stylelint-webpack-plugin'
import { Configuration } from 'webpack'
import { isReact, isTypescript, isVue, root } from '../config'
import { LintWebpackPluginOptions } from 'types'

export default (options: LintWebpackPluginOptions) => {
  let regExpStr = '.js'
  if (isVue) {
    regExpStr = '.(js|vue)'
  } else if (isReact) {
    regExpStr = isTypescript ? '.tsx' : '.jsx'
  }

  const config: Configuration = {
    module: {
      rules: []
    },
    plugins: []
  }

  if (options.eslint) {
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
  }

  if (options.stylint) {
    config.plugins.push(
      /**
       * 处理stylelint样式校验
       */
      new StylelintWebpackPlugin({
        files: [`**/*.(${isVue ? 'vue|' : ''}css|scss)`],
        fix: options.stylint.fix || options.fix
      })
    )
  }

  return config
}
