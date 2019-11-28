"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const compression_webpack_plugin_1 = __importDefault(require("compression-webpack-plugin"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const plugin_1 = __importDefault(require("vue-loader/lib/plugin"));
const config_1 = require("../config");
const env_1 = require("../env");
const queueLog_1 = __importDefault(require("../queueLog"));
const babelConfig_1 = __importDefault(require("./babelConfig"));
exports.default = (options) => {
    let regExpStr = config_1.isTypescript ? '.(t|j)s' : '.js';
    if (config_1.isReact) {
        regExpStr += 'x?';
    }
    const config = {
        /**
         * 导出配置
         */
        output: {
            /**
             * 导出文件名设置
             *
             * 根据文件chunk内容生成名字
             */
            filename: 'js/[name].[contenthash:8].min.js',
            /**
             * 导出分块(chunk)文件名设置
             *
             * 根据文件chunk内容生成名字
             */
            chunkFilename: 'js/[name].chunk-[contenthash:8].min.js'
        },
        module: {
            rules: [
                {
                    test: new RegExp(`${regExpStr}$`),
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        {
                            loader: require.resolve('thread-loader')
                        },
                        {
                            loader: 'babel-loader',
                            options: {
                                /**
                                 * 将相对于解析程序选项中的所有路径的工作目录
                                 */
                                cwd: config_1.root,
                                /**
                                 * 启用缓存，指定缓存路径
                                 *
                                 * 默认development环境启用
                                 */
                                cacheDirectory: options.cacheDirectory,
                                /**
                                 * babel 配置
                                 */
                                ...babelConfig_1.default
                            }
                        }
                    ]
                }
            ]
        },
        resolve: {
            extensions: ['.js']
        },
        plugins: []
    };
    if (config_1.isTypescript) {
        config.resolve.extensions.push('.ts');
    }
    /**
     * 支持vue
     */
    if (config_1.isVue) {
        queueLog_1.default.info(`以使用${chalk_1.default.green('Vue')}框架专属配置`);
        config.plugins.push(new plugin_1.default());
        config.resolve.extensions.push('.vue');
    }
    /**
     * 支持react 的 state 热更新
     */
    if (config_1.isReact) {
        config.resolve.extensions.push(config_1.isTypescript ? '.tsx' : '.jsx');
        if (env_1.NODE_ENV === 'development') {
            const rulesUse = config.module.rules[0].use;
            config.module.rules[0].use = [
                rulesUse[0],
                {
                    loader: 'react-hot-loader/webpack'
                },
                // @ts-ignore
                ...rulesUse.slice(1)
            ];
        }
    }
    /**
     * 生产模式
     */
    if (env_1.NODE_ENV === 'production') {
        config.plugins.push(...[
            /**
             * 压缩优化js文件
             */
            new terser_webpack_plugin_1.default({
                terserOptions: {
                    /**
                     * 导出配置
                     */
                    output: {
                        /**
                         * 删除注释
                         */
                        comments: false,
                        /**
                         * 自动格式化压缩
                         */
                        beautify: false
                    },
                    /**
                     * 压缩配置 默认开启
                     */
                    compress: {
                        /**
                         * 删除 console
                         */
                        drop_console: true
                    }
                },
                /**
                 * 多线程压缩
                 */
                parallel: true
            }),
            /**
             * 对js文件进行gzip
             */
            new compression_webpack_plugin_1.default({
                cache: options.cacheDirectory,
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.js$/,
                threshold: 1024,
                minRatio: 0.8
            })
        ]);
    }
    return config;
};
