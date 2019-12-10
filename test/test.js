const HtmlWebpackPlugin = require('html-webpack-plugin')
const SmartWebpackPlugin = require('../lib')

module.exports = {
  entry: './my-app/src',
  plugins: [
    new SmartWebpackPlugin({
      script: {
        dropConsole: false
      }
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './test/index.html',
      hash: true,
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    })
  ]
}

// const compiler = webpack(
//   {
//     entry: './test/main',
//     mode: 'development',
//     plugins: [
//       new SmartWebpackPlugin({
//         script: {
//           dropConsole: false
//         }
//       }),
//       new HtmlWebpackPlugin({
//         filename: 'index.html',
//         template: './test/index.html',
//         hash: true,
//         inject: true,
//         minify: {
//           removeComments: true,
//           collapseWhitespace: true
//         }
//       })
//     ]
//   }

// (error, stats) => {
//   /**
//    * 构建失败，抛出错误
//    */
//   if (error) throw error
//   if (stats.hasErrors()) {
//     process.stdout.write(
//       stats.toString({
//         colors: true,
//         modules: false,
//         children: false,
//         chunks: false,
//         chunkModules: false
//       })
//     )
//     process.exit(1)
//   }
// }
// )

// compiler.watch({}, () => {})
