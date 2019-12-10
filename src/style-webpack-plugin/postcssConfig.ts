import { cosmiconfigSync } from 'cosmiconfig'
import postcssImport from 'postcss-import'
import postcssPresetEnv from 'postcss-preset-env'
import postcssUrl from 'postcss-url'
import { PostcssConfiguration, SmartCosmiconfigResult } from '../types'
import log from '../log'
import chalk = require('chalk')

export default () => {
  const defaultConfig: PostcssConfiguration = {
    ident: 'postcss',
    /**
     * 插件
     */
    plugins: () => [
      /**
       * 处理css模块导入
       */
      postcssImport(),
      /**
       * 处理cssurl转换
       */
      postcssUrl(),
      /**
       * 目标构建环境
       */
      postcssPresetEnv({
        browsers: ['iOS >= 7', 'Android >= 4', 'last 2 versions']
      })
    ]
  }

  /**
   * 用户的postcss配置
   */
  const userPostcssConfig: SmartCosmiconfigResult<PostcssConfiguration> = cosmiconfigSync(
    'postcss'
  ).search()

  let config = defaultConfig

  if (userPostcssConfig) {
    log.info(`已找到用户额外的${chalk.green('Postcss')}配置，并合并默认配置`)
    config = userPostcssConfig.config

    const { plugins }: PostcssConfiguration = userPostcssConfig.config
    if (plugins && Array.isArray(plugins)) {
      const defaultPlugins = defaultConfig.plugins()
      if (Array.isArray(defaultPlugins)) {
        config.plugins = () => [...defaultPlugins, ...plugins]
      }
    }
  }

  return config
}
