"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const friendly_errors_webpack_plugin_1 = __importDefault(require("friendly-errors-webpack-plugin"));
const webpack_1 = require("webpack");
const utils_1 = require("../utils");
const config_1 = require("../config");
const path_1 = __importDefault(require("path"));
exports.default = (options) => {
    const config = {
        stats: 'minimal',
        /**
         * 表示当前webpack环境为开发环境
         */
        mode: 'development',
        /**
         * 浏览器debug sourceMap 模式
         */
        devtool: 'eval-source-map',
        output: {
            path: path_1.default.resolve(config_1.root, '.cache', 'server/dist'),
            /**
             * 导出文件名设置
             *
             * 根据文件chunk内容生成名字
             */
            filename: '[name].[hash:8].js',
            /**
             * 导出分块(chunk)文件名设置
             *
             * 根据文件chunk内容生成名字
             */
            chunkFilename: '[name].chunk-[hash:8].js'
        },
        resolve: {
            alias: {}
        },
        /**
         * 监听文件改动
         */
        watch: true,
        plugins: [
            new webpack_1.HotModuleReplacementPlugin(),
            /**
             * 只显示核心错误
             */
            new friendly_errors_webpack_plugin_1.default({
                compilationSuccessInfo: {
                    messages: utils_1.localIps().map(ip => {
                        return `listening: http://${ip}:${options.port}`;
                    })
                }
            })
        ]
    };
    if (config_1.isReact) {
        config.resolve.alias['react-dom'] = '@hot-loader/react-dom';
    }
    return config;
};
