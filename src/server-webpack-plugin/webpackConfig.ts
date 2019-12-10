import path from 'path'
import { Configuration, HotModuleReplacementPlugin } from 'webpack'
import { root } from '../config'
import MessageWebpackPlugin from '../message-webpack-plugin'
import { ServerWebpackPluginOptions } from '../types'
import { localIps } from '../utils'

export default (options: ServerWebpackPluginOptions) => {
  const config: Configuration = {
    /**
     * 浏览器debug sourceMap 模式
     */
    devtool: 'eval-source-map',
    output: {
      path: path.resolve(root, '.cache', 'server/dist'),
      /**
       * 导出文件名设置
       *
       * 根据文件chunk内容生成名字
       */
      filename: 'js/[name].[hash:8].js',
      /**
       * 导出分块(chunk)文件名设置
       *
       * 根据文件chunk内容生成名字
       */
      chunkFilename: 'js/[name].chunk-[hash:8].js'
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js'
      }
    },
    /**
     * 监听文件改动
     */
    watch: true,
    plugins: [
      new HotModuleReplacementPlugin(),
      /**
       * 打印Webpack消息
       */
      new MessageWebpackPlugin({
        success() {
          console.log('\n在浏览器打开以下地址浏览.\n')
          console.log(`  本地地址：http://localhost:${options.port}`)
          localIps()
            .map(ip => `  网络地址: http://${ip}:${options.port}`)
            .forEach(msg => {
              console.log(msg)
            })
        }
      })
    ]
  }

  return config
}
