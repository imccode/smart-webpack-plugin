type ArrayOptions = Array<string | Array<string | { [key: string]: any }>>

/**
 * CosmiconfigResult
 */
type SmartCosmiconfigResult<T> = {
  /**
   * 配置
   */
  config: T
  /**
   * 配置文件路径
   */
  filepath: string
  /**
   * 配置是否为空
   */
  isEmpty?: boolean
} | null

/**
 * babel配置
 *
 * docs: https://babeljs.io/docs/en/config-files
 */
interface BabelConfiguration {
  /**
   * 转换器
   */
  presets?: ArrayOptions
  /**
   * 插件
   */
  plugins?: ArrayOptions
  /**
   * 未来可能引入的配置
   */
  [key: string]: any
}

/**
 * postcss 插件类型
 */
type PostcssPlugins = (loader?: object) => Array<(...args: any) => object> | { [key: string]: any }

/**
 * postcss配置
 *
 * docs: https://github.com/postcss/postcss#usage
 */
interface PostcssConfiguration {
  /**
   * postcss采用什么语法
   */
  ident?: string
  /**
   * postcss插件
   */
  plugins?: PostcssPlugins
  /**
   * 未来可能引入的配置
   */
  [key: string]: any
}

/**
 * script-webpack-plugin 插件的可配参数
 */
interface SmartWebpackPluginOptions {
  /**
   * script-webpack-plugin 插件的可配参数
   */
  script?: ScriptWebpackPluginOptions
  /**
   * style-webpack-plugin 插件的可配参数
   */
  style?: StyleWebpackPluginOptions
}

/**
 * script-webpack-plugin 插件的可配参数
 */
interface ScriptWebpackPluginOptions {
  /**
   * 启用缓存，指定缓存路径
   *
   * 默认development环境启用
   */
  cacheDirectory?: string | boolean
}

/**
 * style-webpack-plugin 插件的可配参数
 */
interface StyleWebpackPluginOptions {
  /**
   * 启用缓存，指定缓存路径
   *
   * 默认development环境启用
   */
  cacheDirectory?: string | boolean

  /**
   * css-loader的options配置
   */
  cssLoader?: {
    /**
     * 启用/禁用 CSS 模块和设置模式
     */
    modules?: boolean | Function
    /**
     * 未来可能引入的配置
     */
    [key: string]: any
  }
}
