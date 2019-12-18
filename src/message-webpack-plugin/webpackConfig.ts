import { Compiler, Configuration } from 'webpack'
import { MessageWebpackPluginOptions } from '../types'

export default (options: MessageWebpackPluginOptions, compiler: Compiler) => {
  const config: Configuration = {
    stats: {
      all: false
    },
    performance: false
  }

  return config
}
