import path from 'path'
import SimpleProgressWebpackPlugin from 'simple-progress-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'
import { LibWebpackPluginOptions } from 'types'
import webpack, { Configuration, HotModuleReplacementPlugin } from 'webpack'

export default (options: LibWebpackPluginOptions) => {
  const config: Configuration = {
    /**
     * 最小化显示构建信息
     */
    stats: 'minimal',
    /**
     * 表示当前webpack环境为开发环境
     */
    mode: 'development',
    /**
     * 导出配置
     */
    output: {
      /**
       * 导出文件名设置
       *
       * 根据文件chunk名生成名字
       */
      filename: 'js/[name].[hash:8].min.js',
      /**
       * 导出分块(chunk)文件名设置
       *
       * 根据文件chunk名生成名字
       */
      chunkFilename: 'js/[name].chunk-[hash:8].min.js'
    },
    /**
     * 浏览器debug sourceMap 模式
     */
    devtool: 'cheap-module-eval-source-map',
    /**
     * 监听文件改动
     */
    watch: true,
    plugins: [new HotModuleReplacementPlugin()]
  }

  return config
}
