"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const env_1 = require("../env");
const webpackConfig_1 = __importDefault(require("./webpackConfig"));
/**
 * 脚本webpack插件
 */
class ScriptWebpackPlugin {
    constructor(options = {}) {
        this.options = {
            cacheDirectory: env_1.NODE_ENV === 'development' ? path_1.default.resolve(config_1.root, '.cache', 'script') : false,
            dropConsole: true
        };
        this.webpackConfig = {};
        this.options = { ...this.options, ...options };
        this.webpackConfig = webpackConfig_1.default(this.options);
    }
    /**
     * 注入vue的loader配置
     * @param compiler
     */
    injectVue(compiler) {
        if (config_1.isVue) {
            compiler.options.module.rules.push({
                test: /\.vue$/,
                loader: 'vue-loader'
            });
        }
    }
    /**
     * 注入默认配置
     * @param compiler
     */
    inject(compiler) {
        const { plugins, output, resolve, optimization } = this.webpackConfig;
        this.injectVue(compiler);
        compiler.options.output.filename = output.filename;
        compiler.options.output.chunkFilename = output.chunkFilename;
        compiler.options.resolve.extensions = Array.from(new Set([...compiler.options.resolve.extensions, ...resolve.extensions]));
        compiler.options.plugins.push(...plugins);
        if (env_1.NODE_ENV === 'production') {
            compiler.options.optimization = {
                ...compiler.options.optimization,
                ...optimization,
                splitChunks: {
                    ...compiler.options.optimization.splitChunks,
                    ...optimization.splitChunks
                }
            };
        }
    }
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler) {
        this.inject(compiler);
        compiler.hooks.afterEnvironment.tap('ScriptWebpackPlugin', () => {
            compiler.options.module.rules.push(...this.webpackConfig.module.rules);
        });
    }
}
exports.default = ScriptWebpackPlugin;
