"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cosmiconfig_1 = require("cosmiconfig");
const postcss_import_1 = __importDefault(require("postcss-import"));
const postcss_preset_env_1 = __importDefault(require("postcss-preset-env"));
const postcss_url_1 = __importDefault(require("postcss-url"));
const log_1 = __importDefault(require("../log"));
const chalk = require("chalk");
exports.default = () => {
    const defaultConfig = {
        ident: 'postcss',
        /**
         * 插件
         */
        plugins: () => [
            /**
             * 处理css模块导入
             */
            postcss_import_1.default(),
            /**
             * 处理cssurl转换
             */
            postcss_url_1.default(),
            /**
             * 目标构建环境
             */
            postcss_preset_env_1.default({
                browsers: ['iOS >= 7', 'Android >= 4', 'last 2 versions']
            })
        ]
    };
    /**
     * 用户的postcss配置
     */
    const userPostcssConfig = cosmiconfig_1.cosmiconfigSync('postcss').search();
    let config = defaultConfig;
    if (userPostcssConfig) {
        log_1.default.info(`已找到用户额外的${chalk.green('Postcss')}配置，并合并默认配置`);
        config = userPostcssConfig.config;
        const { plugins } = userPostcssConfig.config;
        if (plugins && Array.isArray(plugins)) {
            const defaultPlugins = defaultConfig.plugins();
            if (Array.isArray(defaultPlugins)) {
                config.plugins = () => [...defaultPlugins, ...plugins];
            }
        }
    }
    return config;
};
