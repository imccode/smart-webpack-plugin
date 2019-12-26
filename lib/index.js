"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asset_webpack_plugin_1 = __importDefault(require("asset-webpack-plugin"));
const chalk_1 = __importDefault(require("chalk"));
const message_webpack_plugin_1 = __importDefault(require("message-webpack-plugin"));
const script_webpack_plugin_1 = __importDefault(require("script-webpack-plugin"));
const serve_webpack_plugin_1 = __importDefault(require("serve-webpack-plugin"));
const styles_webpack_plugin_1 = __importDefault(require("styles-webpack-plugin"));
const lint_webpack_plugin_1 = __importDefault(require("./lint-webpack-plugin"));
const log_1 = __importDefault(require("./log"));
/**
 * smart webpack 插件
 */
class SmartWebpackPlugin {
    constructor(options = {}) {
        this.options = {};
        this.webpackConfig = {};
        this.options = { ...this.options, ...options };
    }
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler) {
        const { mode, target } = compiler.options;
        const { script, style, asset, lint, serve, message } = this.options;
        if (!['development', 'production'].includes(mode)) {
            console.log(`${chalk_1.default.red('请设置 mode 的值，确保为')} ${chalk_1.default.bold.green('development')} | ${chalk_1.default.bold.green('production')}`);
            process.exit(1);
        }
        log_1.default.info(`当前构建环境：${chalk_1.default.green(mode)}，目标平台：${chalk_1.default.green(target)}`);
        if (script !== false) {
            compiler.options.plugins.push(new script_webpack_plugin_1.default(script));
        }
        if (style !== false) {
            compiler.options.plugins.push(new styles_webpack_plugin_1.default(style));
        }
        if (asset !== false) {
            compiler.options.plugins.push(new asset_webpack_plugin_1.default(asset));
        }
        if (lint !== false) {
            compiler.options.plugins.push(new lint_webpack_plugin_1.default(lint));
        }
        if (message !== false) {
            compiler.options.plugins.push(new message_webpack_plugin_1.default(message));
        }
        if (serve !== false) {
            compiler.options.plugins.push(new serve_webpack_plugin_1.default(serve));
        }
    }
}
exports.default = SmartWebpackPlugin;
module.exports = SmartWebpackPlugin;
