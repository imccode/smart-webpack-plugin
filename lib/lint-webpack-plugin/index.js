"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const options_1 = __importDefault(require("./options"));
const webpackConfig_1 = __importDefault(require("./webpackConfig"));
/**
 * 代码校验webpack插件
 */
class LintWebpackPlugin {
    constructor(options = {}) {
        this.options = options_1.default;
        this.webpackConfig = {};
        this.options = {
            ...this.options,
            ...options,
            eslint: options.eslint === false
                ? false
                : {
                    ...this.options.eslint,
                    ...(options.eslint || {})
                },
            stylelint: options.stylelint === false
                ? false
                : {
                    ...this.options.stylelint,
                    ...(options.stylelint || {})
                }
        };
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
        compiler.hooks.afterEnvironment.tap('LintWebpackPlugin', () => {
            compiler.options.module.rules.push(...this.webpackConfig.module.rules);
        });
    }
}
exports.default = LintWebpackPlugin;
