"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpackConfig_1 = __importDefault(require("./webpackConfig"));
/**
 * 媒体资源webpack插件
 */
class AssetWebpackPlugin {
    constructor(options = {}) {
        this.options = {
            esModule: false
        };
        this.webpackConfig = {};
        this.options = { ...this.options, ...options };
        this.webpackConfig = webpackConfig_1.default(this.options);
    }
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler) {
        compiler.hooks.afterEnvironment.tap('AssetWebpackPlugin', () => {
            compiler.options.module.rules.push(...this.webpackConfig.module.rules);
        });
    }
}
exports.default = AssetWebpackPlugin;
