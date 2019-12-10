"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_webpack_plugin_1 = __importDefault(require("compression-webpack-plugin"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const optimize_css_assets_webpack_plugin_1 = __importDefault(require("optimize-css-assets-webpack-plugin"));
const config_1 = require("../config");
const postcssConfig_1 = __importDefault(require("./postcssConfig"));
exports.default = (options, compiler) => {
    const { mode } = compiler.options;
    /**
     * 提取样式到单个css文件
     */
    const miniCssExtractConf = {
        loader: mini_css_extract_plugin_1.default.loader,
        options: {
            hmr: false,
            reloadAll: true
        }
    };
    const styleLoaderName = config_1.isVue ? 'vue-style-loader' : 'style-loader';
    /**
     * 样式loader配置
     *
     * 通用loader配置
     */
    const commonLoaders = [
        /**
         * 提取到单个css文件
         *
         * 或者
         *
         * 生成css样式为html行内样式
         */
        mode === 'development' ? { loader: styleLoaderName } : miniCssExtractConf,
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
            options: postcssConfig_1.default()
        }
    ];
    /**
     * 启用缓存
     */
    if (mode === 'development' && options.cacheDirectory) {
        commonLoaders.unshift({
            loader: 'cache-loader',
            options: {
                /**
                 * 默认development环境启用
                 */
                cacheDirectory: options.cacheDirectory
            }
        });
    }
    const config = {
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
    };
    /**
     * 生产模式
     */
    if (mode === 'production') {
        config.plugins.push(...[
            /**
             * 压缩css, 添加前缀等
             */
            new optimize_css_assets_webpack_plugin_1.default({
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
            new mini_css_extract_plugin_1.default({
                filename: 'css/[name].[contenthash:8].min.css',
                chunkFilename: 'css/[name].[contenthash:8].min.css'
            }),
            /**
             * 对css文件进行gzip
             */
            new compression_webpack_plugin_1.default({
                cache: options.cacheDirectory,
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: /\.css$/,
                threshold: 1024,
                minRatio: 0.8
            })
        ]);
        config.plugins.push;
    }
    return config;
};
