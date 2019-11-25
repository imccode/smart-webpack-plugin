export = SmartWebpackPlugin

declare namespace SmartWebpackPlugin {
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
  type PostcssPlugins = (
    loader?: object
  ) => Array<(...args: any) => object> | { [key: string]: any }

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
     * script-webpack-plugin 脚本资源 插件的可配参数
     */
    script?: ScriptWebpackPluginOptions
    /**
     * style-webpack-plugin 样式资源 插件的可配参数
     */
    style?: StyleWebpackPluginOptions
    /**
     * asset-webpack-plugin 媒体资源 插件的可配参数
     */
    asset?: AssetWebpackPluginOptions
    /**
     * lint-webpack-plugin 代码校验 插件的可配参数
     */
    lint?: LintWebpackPluginOptions
    /**
     * progress-webpack-plugin 构建进度 插件的可配参数
     */
    progress?: ProgressWebpackPluginOptions
    /**
     * server-webpack-plugin 本地开发环境 插件的可配参数
     */
    server?: ServerWebpackPluginOptions
  }

  /**
   * script-webpack-plugin 脚本资源 插件的可配参数
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
   * style-webpack-plugin 样式资源 插件的可配参数
   */
  interface StyleWebpackPluginOptions {
    /**
     * 是否启用
     */
    enable?: boolean
    /**
     * 启用缓存，指定缓存路径
     *
     * 默认development环境启用
     */
    cacheDirectory?: string | boolean

    /**
     * css-loader的options配置
     */
    cssLoader?:
      | false
      | {
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

  /**
   * asset-webpack-plugin 媒体资源 插件的可配参数
   */
  interface AssetWebpackPluginOptions {
    /**
     * 是否启用
     */
    enable?: boolean
  }

  /**
   * lint-webpack-plugin 代码校验 插件的可配参数
   */
  interface LintWebpackPluginOptions {
    /**
     * 是否启用
     */
    enable?: boolean
    /**
     * 是否在校验之前自动修复不规则的代码
     */
    fix?: boolean
    /**
     * eslint配置规则
     */
    eslint?:
      | false
      | {
          /**
           * 是否在校验之前自动修复不规则的代码
           */
          fix?: boolean
          /**
           * 未来可能引入的配置
           */
          [key: string]: any
        }
    /**
     * stylint配置规则
     */
    stylint?:
      | false
      | {
          /**
           * 是否在校验之前自动修复不规则的代码
           */
          fix?: boolean
          /**
           * 未来可能引入的配置
           */
          [key: string]: any
        }
  }
  /**
   * progress-webpack-plugin 构建进度 插件的可配参数
   */
  interface ProgressWebpackPluginOptions {
    /**
     * 是否启用
     */
    enable?: boolean
  }

  /**
   * server-webpack-plugin 本地开发环境 插件的可配参数
   *
   * options docs: https://github.com/shellscape/webpack-plugin-serve
   */
  interface ServerWebpackPluginOptions {
    /**
     * 是否启用
     */
    enable?: boolean
    /**
     * 启用热更新
     */
    hmr?: boolean
    /**
     * 开发端口
     */
    port?: number
    /**
     * 是否开启压缩，主要返回gzip文件
     */
    compress?: boolean
  }
}
