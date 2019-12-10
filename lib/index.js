"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const asset_webpack_plugin_1 = __importDefault(require("./asset-webpack-plugin"));
exports.AssetWebpackPlugin = asset_webpack_plugin_1.default;
const lint_webpack_plugin_1 = __importDefault(require("./lint-webpack-plugin"));
exports.LintWebpackPlugin = lint_webpack_plugin_1.default;
const progress_webpack_plugin_1 = __importDefault(require("./progress-webpack-plugin"));
exports.ProgressWebpackPlugin = progress_webpack_plugin_1.default;
const log_1 = __importDefault(require("./log"));
const script_webpack_plugin_1 = __importDefault(require("./script-webpack-plugin"));
exports.ScriptWebpackPlugin = script_webpack_plugin_1.default;
const server_webpack_plugin_1 = __importDefault(require("./server-webpack-plugin"));
exports.ServerWebpackPlugin = server_webpack_plugin_1.default;
const style_webpack_plugin_1 = __importDefault(require("./style-webpack-plugin"));
exports.StyleWebpackPlugin = style_webpack_plugin_1.default;
const chalk = require("chalk");
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
        const { script, style, asset, lint, progress, server } = this.options;
        log_1.default.info(`当前构建环境：${chalk.green(mode)}，目标平台：${chalk.green(target)}`);
        if (script !== false) {
            compiler.options.plugins.push(new script_webpack_plugin_1.default(script));
        }
        if (style !== false) {
            compiler.options.plugins.push(new style_webpack_plugin_1.default(style));
        }
        if (asset !== false) {
            compiler.options.plugins.push(new asset_webpack_plugin_1.default(asset));
        }
        if (lint !== false) {
            compiler.options.plugins.push(new lint_webpack_plugin_1.default(lint));
        }
        // if (progress !== false) {
        //   compiler.options.plugins.push(new ProgressWebpackPlugin(progress))
        // }
        if (server !== false && mode === 'development') {
            compiler.options.plugins.push(new server_webpack_plugin_1.default(server));
        }
    }
}
exports.SmartWebpackPlugin = SmartWebpackPlugin;
exports.default = SmartWebpackPlugin;
module.exports = SmartWebpackPlugin;
