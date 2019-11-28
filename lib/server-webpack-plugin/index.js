"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const options_1 = __importDefault(require("./options"));
const serve_1 = __importDefault(require("./serve"));
const webpackConfig_1 = __importDefault(require("./webpackConfig"));
const path_1 = __importDefault(require("path"));
const pluginName = 'ServerWebpackPlugin';
/**
 * server webpack插件
 */
class ServerWebpackPlugin {
    constructor(options = {}) {
        this.options = {
            ...options_1.default
        };
        this.webpackConfig = webpackConfig_1.default(this.options);
        this.options = { ...this.options, ...options };
    }
    /**
     * 构造一个新的entry
     */
    structureEntry(entry) {
        const entryFileName = path_1.default.resolve(__dirname, './client');
        console.log(entryFileName);
        let entryResult = [];
        if (typeof entry === 'string') {
            entryResult = [entry, entryFileName];
        }
        else if (Array.isArray(entry)) {
            entryResult = [...entry, entryFileName];
        }
        if (config_1.isReact) {
            entryResult = ['react-hot-loader/patch', ...entryResult];
        }
        return entryResult;
    }
    /**
     * 注入默认配置
     * @param compiler
     */
    inject(compiler) {
        const { plugins, mode, stats, devtool, watch, output, resolve } = this.webpackConfig;
        const { entry } = compiler.options;
        compiler.options.mode = mode;
        compiler.options.devtool = devtool;
        compiler.options.stats = stats;
        compiler.options.output.filename = output.filename;
        compiler.options.output.chunkFilename = output.chunkFilename;
        compiler.options.watch = watch;
        compiler.options.resolve.alias = {
            ...compiler.options.resolve.alias,
            ...resolve.alias
        };
        compiler.options.plugins.push(...plugins);
        if (typeof entry === 'object') {
            Object.keys(entry).forEach(key => {
                compiler.options.entry[key] = this.structureEntry(compiler.options.entry[key]);
            });
        }
        else if (typeof entry === 'function') {
            const entryConfig = entry();
            compiler.options.entry = {};
            if (typeof entryConfig === 'object') {
                Object.keys(entry).forEach(key => {
                    compiler.options.entry[key] = this.structureEntry(compiler.options.entry[key]);
                });
            }
        }
        else {
            compiler.options.entry = this.structureEntry(compiler.options.entry);
        }
    }
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler) {
        const { done, watchClose, watchRun } = compiler.hooks;
        this.inject(compiler);
        const serve = new serve_1.default(this.options, compiler);
        serve.openWS();
        /**
         * 编译(compilation)完成
         */
        done.tap(pluginName, stats => {
            serve.sendWS('update', stats.hash);
        });
        /**
         * 监听模式下，一个新的编译(compilation)触发之后，执行一个插件，但是是在实际编译开始之前
         */
        watchRun.tap(pluginName, () => {
            serve.sendWS('beforeUpdate');
        });
        /**
         * 监听模式停止
         */
        watchClose.tap(pluginName, () => {
            serve.sendWS('close');
            serve.closeWS();
        });
    }
}
exports.default = ServerWebpackPlugin;
