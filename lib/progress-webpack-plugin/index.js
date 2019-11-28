"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpackConfig_1 = __importDefault(require("./webpackConfig"));
/**
 * 媒体资源webpack插件
 */
class ProgressWebpackPlugin {
    constructor(options = {}) {
        this.options = {};
        this.webpackConfig = {};
        this.options = { ...this.options, ...options };
        this.webpackConfig = webpackConfig_1.default(this.options);
    }
    /**
     * 注入默认配置
     * @param compiler
     */
    inject(compiler) {
        compiler.options.plugins.push(...this.webpackConfig.plugins);
    }
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler) {
        this.inject(compiler);
    }
}
exports.default = ProgressWebpackPlugin;
