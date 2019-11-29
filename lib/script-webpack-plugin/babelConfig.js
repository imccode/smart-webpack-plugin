"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const cosmiconfig_1 = require("cosmiconfig");
const config_1 = require("../config");
const queueLog_1 = __importDefault(require("../queueLog"));
const env_1 = require("../env");
const defaultConfig = {
    /**
     * 转换器
     */
    presets: [
        /**
         * 转换需要的浏览器环境代码
         */
        '@babel/preset-env'
    ],
    /**
     * 插件
     */
    plugins: [
        /**
         * 顺序不可以调整
         */
        'babel-plugin-lodash',
        /**
         * 展开运算符
         */
        '@babel/plugin-proposal-object-rest-spread',
        /**
         * 装饰器
         *
         * @connet()
         */
        ['@babel/plugin-proposal-decorators', { legacy: true }],
        /**
         * class 类
         */
        ['@babel/plugin-proposal-class-properties', { loose: true }],
        /**
         * export v from 'mod'
         */
        '@babel/plugin-proposal-export-default-from',
        /**
         * export * as ns from 'mod'
         */
        '@babel/plugin-proposal-export-namespace-from',
        /**
         * require('mod')
         */
        '@babel/plugin-transform-modules-commonjs',
        /**
         * import('mod')
         */
        '@babel/plugin-syntax-dynamic-import',
        /**
         * 去除重复的 polyfill 导入
         */
        '@babel/plugin-transform-runtime'
    ]
};
/**
 * 用户的babel配置
 */
const userBabelConfig = cosmiconfig_1.cosmiconfigSync('babel').search();
let config = defaultConfig;
if (userBabelConfig) {
    queueLog_1.default.info(`已找到用户额外的${chalk_1.default.green('Babel')}配置，并合并默认配置`);
    config = userBabelConfig.config;
    const { presets, plugins } = userBabelConfig.config;
    if (presets && Array.isArray(presets)) {
        config.presets = [...defaultConfig.presets, ...presets];
    }
    if (plugins && Array.isArray(plugins)) {
        config.plugins = [
            ...defaultConfig.plugins.slice(0, defaultConfig.plugins.length - 1 || 0),
            ...plugins,
            ...defaultConfig.plugins.slice(defaultConfig.plugins.length - 1)
        ];
    }
}
/**
 * 转换ts、tsx语法
 */
if (config_1.isTypescript) {
    queueLog_1.default.info(`已使用${chalk_1.default.green('Typescript')}语言专属配置`);
    config.presets.push('@babel/preset-typescript');
}
/**
 * 转换react jsx语法
 */
if (config_1.isReact) {
    queueLog_1.default.info(`以使用${chalk_1.default.green('React')}框架专属配置`);
    config.presets.unshift(['@babel/preset-react', { useBuiltIns: 'usage' }]);
    if (env_1.NODE_ENV === 'development') {
        config.plugins.unshift('react-hot-loader/babel');
    }
}
exports.default = config;
