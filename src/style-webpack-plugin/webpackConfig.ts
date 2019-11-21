import path from 'path'
import { Configuration } from 'webpack'
import { root, isVue } from '../config'
import { NODE_ENV } from 'src/env'
import miniCssExtractPlugin from 'mini-css-extract-plugin'
import { RuleSetUse, RuleSetUseItem } from 'webpack'
import postcssConfig from './postcssConfig'
import OptimizeCssAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CompressionWebpackPlugin from 'compression-webpack-plugin'

const cachePath = path.resolve(root, '.cache', 'style')

export default (
  options: StyleWebpackPluginOptions = {
    cacheDirectory: NODE_ENV === 'development' ? cachePath : false
  }
) => {
  /**
   * 提取样式到单个css文件
   */
  const miniCssExtractConf: RuleSetUseItem = {
    loader: miniCssExtractPlugin.loader,
    options: {
      hmr: false,
      reloadAll: true
    }
  }

  const styleLoaderName = isVue ? 'vue-style-loader' : 'style-loader'

  /**
   * 样式loader配置
   *
   * 通用loader配置
   */
  const commonLoaders: RuleSetUse = [
    /**
     * 提取到单个css文件
     *
     * 或者
     *
     * 生成css样式为html行内样式
     */
    NODE_ENV === 'development' ? { loader: styleLoaderName } : miniCssExtractConf,
    /**
     * 处理其他预编译样式生成的css
     */
    { loader: 'css-loader', options: options.cssLoader ? options.cssLoader : {} },
    /**
     * 用postcss处理特殊需求
     *
     * 如：添加浏览器前缀
     */
    {
      loader: 'postcss-loader',
      options: postcssConfig
    }
  ]

  /**
   * 启用缓存
   */
  if (options.cacheDirectory) {
    commonLoaders.unshift({
      loader: 'cache-loader',
      options: {
        /**
         * 默认development环境启用
         */
        cacheDirectory: options.cacheDirectory
      }
    })
  }

  const config: Configuration = {
    module: {
      rules: [
        /**
         * css文件样式处理
         */
        { test: /\.css$/, use: commonLoaders },
        /**
         * scss文件样式处理
         */
        { test: /\.scss$/, use: [...commonLoaders, { loader: 'sass-loader' }] }
      ]
    },
    plugins: []
  }

  /**
   * 生产模式
   */
  if (NODE_ENV === 'production') {
    config.plugins.push(
      ...[
        /**
         * 压缩css, 添加前缀等
         */
        new OptimizeCssAssetsPlugin({
          /**
           * 压缩器cssnano
           */
          cssProcessor: require('cssnano'),
          /**
           * 压缩相关配置
           */
          cssProcessorOptions: {
            /**
             * 删除注释
             */
            discardComments: {
              removeAll: true
            }
          },
          canPrint: false
        }),
        /**
         * 多文件css提取到一个文件 或 chunk
         */

        new MiniCssExtractPlugin({
          filename: 'css/[name].[contenthash:8].min.css',
          chunkFilename: 'css/[name].[contenthash:8].min.css'
        }),
        /**
         * 对css文件进行gzip
         */
        new CompressionWebpackPlugin({
          cache: options.cacheDirectory,
          filename: '[path].gz[query]',
          algorithm: 'gzip',
          test: /\.css$/,
          threshold: 1024,
          minRatio: 0.8
        })
      ]
    )

    config.plugins.push
  }

  return config
}
