import { AssetWebpackPluginOptions } from '../types'
import { Configuration } from 'webpack'
import SimpleProgressWebpackPlugin from 'simple-progress-webpack-plugin'

export default (options: AssetWebpackPluginOptions) => {
  const config: Configuration = {
    plugins: [
      /**
       * 显示构建过程
       */
      new SimpleProgressWebpackPlugin({ format: 'minimal' })
    ]
  }

  return config
}
