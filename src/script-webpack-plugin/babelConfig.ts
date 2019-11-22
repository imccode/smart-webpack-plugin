import chalk from 'chalk'
import { cosmiconfigSync } from 'cosmiconfig'
import { BabelConfiguration, SmartCosmiconfigResult } from 'types'
import { isReact, isTypescript } from '../config'
import log from '../log'

const defaultConfig: BabelConfiguration = {
  /**
   * 转换器
   */
  presets: [
    /**
     * 转换需要的浏览器环境代码
     */
    '@babel/preset-env'
  ],
  /**
   * 插件
   */
  plugins: [
    /**
     * 顺序不可以调整
     */
    'babel-plugin-lodash',
    /**
     * 展开运算符
     */
    '@babel/plugin-proposal-object-rest-spread',
    /**
     * 装饰器
     *
     * @connet()
     */
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    /**
     * class 类
     */
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    /**
     * export v from 'mod'
     */
    '@babel/plugin-proposal-export-default-from',
    /**
     * export * as ns from 'mod'
     */
    '@babel/plugin-proposal-export-namespace-from',
    /**
     * require('mod')
     */
    '@babel/plugin-transform-modules-commonjs',
    /**
     * import('mod')
     */
    '@babel/plugin-syntax-dynamic-import',
    /**
     * 去除重复的 polyfill 导入
     */
    '@babel/plugin-transform-runtime'
  ]
}

/**
 * 用户的babel配置
 */
const userBabelConfig: SmartCosmiconfigResult<BabelConfiguration> = cosmiconfigSync(
  'babel'
).search()

let config = defaultConfig

if (userBabelConfig) {
  log.info(`已找到用户额外的${chalk.green('Babel')}配置，并合并默认配置`)
  config = userBabelConfig.config

  const { presets, plugins }: BabelConfiguration = userBabelConfig.config
  if (presets && Array.isArray(presets)) {
    config.presets = [...defaultConfig.presets, ...presets]
  }
  if (plugins && Array.isArray(plugins)) {
    config.plugins = [...defaultConfig.plugins, ...plugins]
  }
}

/**
 * 转换ts、tsx语法
 */
if (isTypescript) {
  log.info(`已使用${chalk.green('Typescript')}语言专属配置`)
  config.presets.push('@babel/preset-typescript')
}

/**
 * 转换react jsx语法
 */
if (isReact) {
  log.info(`以使用${chalk.green('React')}框架专属配置`)
  config.presets.unshift(['@babel/preset-react', { useBuiltIns: 'usage' }])
}

export default config
