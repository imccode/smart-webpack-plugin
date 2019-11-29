import queueLog from './queueLog'
import chalk from 'chalk'

/**
 * 返回当前node的环境信息
 */
//@ts-ignore
const NODE_ENV: 'production' | 'development' = process.env.NODE_ENV || 'production'

queueLog.info(`当前构建环境${chalk.green(NODE_ENV)}`)

export { NODE_ENV }
