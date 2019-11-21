import fs from 'fs'
import path from 'path'

/**
 * 当前工作目录
 */
const root = process.cwd()

/**
 * package.json配置
 */
const packageConfig = require(path.resolve(root, 'package.json'))

/**
 * 是否使用了vue框架
 */
const isVue =
  (packageConfig.dependencies && packageConfig.dependencies.vue) ||
  (packageConfig.devDependencies && packageConfig.devDependencies.vue)

/**
 * 是否使用了react框架
 */
const isReact =
  (packageConfig.dependencies && packageConfig.dependencies.react) ||
  (packageConfig.devDependencies && packageConfig.devDependencies.react)

/**
 * 是否使用typescript语言
 */
const isTypescript = fs.existsSync(path.resolve(root, 'tsconfig.json'))

export { root, packageConfig, isVue, isReact, isTypescript }

