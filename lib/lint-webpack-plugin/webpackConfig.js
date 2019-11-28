"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cosmiconfig_1 = require("cosmiconfig");
const eslint_friendly_formatter_1 = __importDefault(require("eslint-friendly-formatter"));
const queueLog_1 = __importDefault(require("../queueLog"));
const stylelint_webpack_plugin_1 = __importDefault(require("stylelint-webpack-plugin"));
const config_1 = require("../config");
const chalk = require("chalk");
exports.default = (options) => {
    let regExpStr = config_1.isTypescript ? '.(t|j)s' : '.js';
    if (config_1.isVue) {
        regExpStr = '.(js|ts|vue)';
    }
    else if (config_1.isReact) {
        regExpStr += 'x?';
    }
    const config = {
        module: {
            rules: []
        },
        plugins: []
    };
    if (options.eslint) {
        /**
         * 用户的eslint配置
         */
        const userEslintConfig = cosmiconfig_1.cosmiconfigSync('eslint', {
            packageProp: 'eslintConfig',
            searchPlaces: [
                '.eslintrc.js',
                '.eslintrc.yaml',
                '.eslintrc.yml',
                '.eslintrc.json',
                '.eslintrc',
                'package.json'
            ]
        }).search();
        if (userEslintConfig) {
            queueLog_1.default.info(`已找到用户的${chalk.green('Eslint')}配置，并开启脚本代码校验`);
            /**
             * eslinter校验代码
             */
            config.module.rules.push({
                test: new RegExp(`${regExpStr}$`),
                enforce: 'pre',
                include: config_1.root,
                use: [
                    {
                        loader: 'eslint-loader',
                        options: {
                            fix: options.eslint.fix || options.fix,
                            /**
                             * 允许在用户项目根目录查找Eslit配置文件
                             */
                            useEslintrc: true,
                            /**
                             * 校验不通过，抛出错误提示
                             */
                            failOnError: true,
                            /**
                             * 校验前就行工具格式化
                             */
                            formatter: eslint_friendly_formatter_1.default
                        }
                    }
                ]
            });
        }
        else {
            queueLog_1.default.warn(`未找到用户的${chalk.green('Eslint')}配置，不开启脚本代码校验`);
        }
    }
    if (options.stylelint) {
        /**
         * 用户的stylelint配置
         */
        const userStylelintConfig = cosmiconfig_1.cosmiconfigSync('stylelint').search();
        if (userStylelintConfig) {
            queueLog_1.default.info(`已找到用户的${chalk.green('Stylelint')}配置，并开启样式代码校验`);
            config.plugins.push(
            /**
             * 处理stylelint样式校验
             */
            new stylelint_webpack_plugin_1.default({
                files: [`**/*.(${config_1.isVue ? 'vue|' : ''}css|scss)`],
                fix: options.stylelint.fix || options.fix
            }));
        }
        else {
            queueLog_1.default.warn(`未找到用户的${chalk.green('Stylelint')}配置，不开启样式代码校验`);
        }
    }
    return config;
};
