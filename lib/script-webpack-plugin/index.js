"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const utils_1 = require("../utils");
const webpackConfig_1 = __importDefault(require("./webpackConfig"));
const pluginName = 'ScriptWebpackPlugin';
/**
 * 脚本webpack插件
 */
class ScriptWebpackPlugin {
    constructor(options = {}) {
        this.options = {
            cacheDirectory: path_1.default.resolve(config_1.root, '.cache', 'script'),
            dropConsole: true,
            hot: true
        };
        this.webpackConfig = {};
        this.options = { ...this.options, ...options };
    }
    /**
     * 注入vue的loader配置
     * @param compiler
     */
    injectVue(compiler) {
        if (config_1.isVue) {
            compiler.options.module.rules.push({
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    hotReload: this.options.hot
                }
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
        if (compiler.options.mode === 'production') {
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
     * 注入热更新代码
     * @param compiler
     */
    injectHot(compiler) {
        compiler.hooks.normalModuleFactory.tap(pluginName, normalModuleFactory => {
            normalModuleFactory.hooks.afterResolve.tap(pluginName, data => {
                if (!/node_modules/.test(data.resource) &&
                    !data.rawRequest.includes('hot/client?wsPort') &&
                    utils_1.includesEntry(compiler.options.entry, data.rawRequest)) {
                    data.loaders.unshift({
                        loader: path_1.default.resolve(__dirname, './reactRefreshLoader')
                    });
                }
                return data;
            });
        });
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
        if (this.options.hot)
            this.injectHot(compiler);
        compiler.hooks.afterEnvironment.tap(pluginName, () => {
            compiler.options.module.rules.push(...this.webpackConfig.module.rules);
        });
    }
}
exports.default = ScriptWebpackPlugin;
