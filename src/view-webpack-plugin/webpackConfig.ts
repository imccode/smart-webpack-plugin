import { AssetWebpackPluginOptions } from 'types'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { Configuration } from 'webpack'
import { NODE_ENV } from '../env'

export default (options: AssetWebpackPluginOptions) => {
  const config: Configuration = {
    plugins: [
      /**
       * 生成html视图文件
       */
      new HtmlWebpackPlugin({
        filename: 'index.html',
        // template: config.templatePath,
        // publicPath: config.publicPath,
        hash: true,
        inject: true,
        minify: {
          removeComments: true,
          collapseWhitespace: true
        },
        meta:
          NODE_ENV === 'development'
            ? {}
            : {
                'Content-Security-Policy': {
                  'http-equiv': 'Content-Security-Policy',
                  content: 'upgrade-insecure-requests'
                }
              }
      })
    ]
  }
  return config
}
