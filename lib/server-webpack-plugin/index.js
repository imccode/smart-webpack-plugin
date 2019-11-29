"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("../config");
const serve_1 = __importDefault(require("./serve"));
const webpackConfig_1 = __importDefault(require("./webpackConfig"));
const path_1 = __importDefault(require("path"));
/**
 * server webpack插件
 */
class ServerWebpackPlugin {
    constructor(options = {}) {
        this.options = {
            port: 8080,
            compress: false
        };
        this.webpackConfig = webpackConfig_1.default(this.options);
        this.options = { ...this.options, ...options };
    }
    /**
     * 构造一个新的entry
     */
    structureEntry(entry, wsPort) {
        const entryFileName = path_1.default.resolve(__dirname, `./client?wsPort=${wsPort || 55555}`);
        let entryResult = [];
        if (typeof entry === 'string') {
            entryResult = [entryFileName, entry];
        }
        else if (Array.isArray(entry)) {
            entryResult = [entryFileName, ...entry];
        }
        if (config_1.isReact) {
            entryResult.unshift('react-hot-loader/patch');
        }
        return entryResult;
    }
    /**
     * 注入默认热更新服务
     * @param compiler
     */
    injectHotServer(compiler) {
        const { entry } = compiler.options;
        const serve = new serve_1.default(this.options, compiler);
        if (typeof entry === 'object') {
            Object.keys(entry).forEach(key => {
                compiler.options.entry[key] = this.structureEntry(compiler.options.entry[key], serve.wsPort);
            });
        }
        else if (typeof entry === 'function') {
            const entryConfig = entry();
            compiler.options.entry = {};
            if (typeof entryConfig === 'object') {
                Object.keys(entry).forEach(key => {
                    compiler.options.entry[key] = this.structureEntry(compiler.options.entry[key], serve.wsPort);
                });
            }
        }
        else {
            compiler.options.entry = this.structureEntry(compiler.options.entry, serve.wsPort);
        }
    }
    /**
     * 注入默认配置
     * @param compiler
     */
    inject(compiler) {
        const { plugins, mode, stats, devtool, watch, output, resolve } = this.webpackConfig;
        compiler.options.mode = mode;
        compiler.options.performance = false;
        compiler.options.devtool = devtool;
        compiler.options.stats = stats;
        compiler.options.output.path = output.path;
        compiler.options.output.filename = output.filename;
        compiler.options.output.chunkFilename = output.chunkFilename;
        compiler.options.watch = watch;
        compiler.options.resolve.alias = {
            ...compiler.options.resolve.alias,
            ...resolve.alias
        };
        compiler.options.plugins.push(...plugins);
    }
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler) {
        this.inject(compiler);
        this.injectHotServer(compiler);
    }
}
exports.default = ServerWebpackPlugin;
