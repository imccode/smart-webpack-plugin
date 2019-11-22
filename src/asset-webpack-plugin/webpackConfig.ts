import { AssetWebpackPluginOptions } from 'types'
import { Configuration } from 'webpack'

export default (options: AssetWebpackPluginOptions) => {
  const config: Configuration = {
    module: {
      rules: [
        /**
         * 图片文件loader
         */
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 500,
                prefix: 'img',
                name: 'img/[name].[hash:8].[ext]'
              }
            }
          ]
        },
        /**
         * 字体文件loader
         */
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1e4,
                prefix: 'fonts',
                name: 'fonts/[name].[hash:8].[ext]'
              }
            }
          ]
        },
        /**
         * 音频、视频文件loader
         */
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 1e4,
                name: 'media/[name].[hash:8].[ext]'
              }
            }
          ]
        }
      ]
    }
  }
  return config
}
