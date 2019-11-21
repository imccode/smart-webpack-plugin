import webpack from 'webpack'
import JsWebpackPlugin from '../src/js-webpack-plugin'

webpack({
  entry: 'test',
  plugins: [new JsWebpackPlugin()]
})
