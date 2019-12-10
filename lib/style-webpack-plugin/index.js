"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const webpackConfig_1 = __importDefault(require("./webpackConfig"));
/**
 * 样式webpack插件
 */
class StyleWebpackPlugin {
    constructor(options = {}) {
        this.options = {
            cacheDirectory: path_1.default.resolve(config_1.root, '.cache', 'style')
        };
        this.webpackConfig = {};
        this.options = {
            ...this.options,
            ...options,
            cssLoader: {
                ...this.options.cssLoader,
                ...(options.cssLoader || {})
            }
        };
    }
    /**
     * 注入默认配置
     * @param compiler
     */
    inject(compiler) {
        compiler.options.plugins.push(...this.webpackConfig.plugins);
    }
    /**
     * 注入默认Loader配置
     * @param compiler
     */
    injectRules(compiler) {
        compiler.options.module.rules.push(...this.webpackConfig.module.rules);
    }
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler) {
        this.options.cacheDirectory =
            compiler.options.mode === 'production' ? false : this.options.cacheDirectory;
        this.webpackConfig = webpackConfig_1.default(this.options, compiler);
        this.inject(compiler);
        if (config_1.isVue) {
            this.injectRules(compiler);
        }
        else {
            compiler.hooks.afterEnvironment.tap('StyleWebpackPlugin', () => this.injectRules(compiler));
        }
    }
}
exports.default = StyleWebpackPlugin;
