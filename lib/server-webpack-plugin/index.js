"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const path_1 = __importDefault(require("path"));
const log_1 = __importDefault(require("../log"));
const utils_1 = require("../utils");
const wsServe_1 = __importDefault(require("./hot/wsServe"));
const serve_1 = __importDefault(require("./serve"));
const webpackConfig_1 = __importDefault(require("./webpackConfig"));
/**
 * server webpack插件
 */
class ServerWebpackPlugin {
    constructor(options = {}) {
        this.options = {
            port: 33333,
            compress: false,
            hot: true
        };
        this.webpackConfig = webpackConfig_1.default(this.options);
        this.options = { ...this.options, ...options };
    }
    /**
     * 注入默认热更新服务
     * @param compiler
     */
    injectHotServer(compiler) {
        const { entry } = compiler.options;
        const serve = new wsServe_1.default(this.options, compiler);
        const entryFileName = path_1.default.resolve(__dirname, `./hot/client?wsPort=${serve.wsPort || 55555}`);
        compiler.options.entry = utils_1.structureEntry(entry, entryFileName);
    }
    /**
     * 注入默认配置
     * @param compiler
     */
    inject(compiler) {
        const { plugins, devtool, watch, output, resolve } = this.webpackConfig;
        compiler.options.devtool = devtool;
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
        new serve_1.default(this.options, compiler);
        if (this.options.hot) {
            log_1.default.info(`已开启${chalk_1.default.green('Hot')}代码热更新`);
            this.injectHotServer(compiler);
        }
    }
}
exports.default = ServerWebpackPlugin;
