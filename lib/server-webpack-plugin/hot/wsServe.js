"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
class WsServe {
    constructor(options, compiler) {
        this.options = options;
        this.compiler = compiler;
        this.initServer();
    }
    initServer() {
        const createWsServer = () => {
            try {
                this.wsPort = Math.floor(Math.random() * 10000 + 50000);
                this.wsServer = new ws_1.default.Server({
                    port: this.wsPort,
                    noServer: false
                });
            }
            catch (error) {
                createWsServer();
            }
        };
        createWsServer();
        this.openWS();
    }
    /**
     * 打开长连接
     */
    openWS() {
        this.wsServer.on('connection', socket => {
            this.socket = socket;
            this.hooks();
        });
    }
    /**
     * 发送长连接数据-到客户端
     * @param data 发送的数据
     */
    sendWS(type, data) {
        if (this.socket) {
            this.socket.send(JSON.stringify({ type, data }));
        }
    }
    /**
     * 关闭长连接
     */
    closeWS() {
        this.wsServer.close();
    }
    hooks() {
        const pluginName = 'ServerWebpackPlugin';
        const { done, invalid } = this.compiler.hooks;
        let lastHash;
        /**
         * 无效编译
         */
        invalid.tap(pluginName, (fileName, changeTime) => {
            this.sendWS('beforeUpdate', {
                fileName,
                changeTime
            });
        });
        /**
         * 编译完成
         */
        done.tap(pluginName, stats => {
            if (lastHash === stats.hash) {
                this.sendWS('invalidUpdate');
                return;
            }
            lastHash = stats.hash;
            if (stats.hasErrors()) {
                this.sendWS('error', stats.compilation.errors.map(({ module }) => module.resource).join(','));
                return;
            }
            this.sendWS('update', { hash: stats.hash, time: stats.endTime - stats.startTime });
        });
    }
}
exports.default = WsServe;
