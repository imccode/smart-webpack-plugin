"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const webpack_1 = require("webpack");
const config_1 = require("../config");
const message_webpack_plugin_1 = __importDefault(require("../message-webpack-plugin"));
const utils_1 = require("../utils");
exports.default = (options) => {
    const config = {
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
            new webpack_1.HotModuleReplacementPlugin(),
            /**
             * 打印Webpack消息
             */
            new message_webpack_plugin_1.default({
                success() {
                    console.log('\n在浏览器打开以下地址浏览.\n');
                    console.log(`  本地地址：http://localhost:${options.port}`);
                    utils_1.localIps()
                        .map(ip => `  网络地址: http://${ip}:${options.port}`)
                        .forEach(msg => {
                        console.log(msg);
                    });
                }
            })
        ]
    };
    return config;
};
