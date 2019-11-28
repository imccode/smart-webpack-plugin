"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_static_1 = __importDefault(require("koa-static"));
const koa_compress_1 = __importDefault(require("koa-compress"));
const ws_1 = __importDefault(require("ws"));
class Serve {
    constructor(options, compiler) {
        this.options = options;
        this.httpServer = new koa_1.default();
        this.initServer(compiler);
    }
    initServer(compiler) {
        this.wsServer = new ws_1.default.Server({
            noServer: false,
            port: 55551
        });
        this.httpServer.use(koa_static_1.default(compiler.options.output.path));
        if (this.options.compress) {
            this.httpServer.use(koa_compress_1.default());
        }
        this.httpServer.listen(this.options.port);
    }
    /**
     * 打开长连接
     */
    openWS() {
        this.wsServer.on('connection', ws => (this.ws = ws));
    }
    /**
     * 发送长连接数据-到客户端
     * @param data 发送的数据
     */
    sendWS(type, data) {
        return new Promise(resolve => {
            if (this.ws)
                this.ws
                    ? this.ws.send(JSON.stringify({
                        type,
                        data
                    }), (err) => resolve(err))
                    : resolve(new Error('长连接还未创建成功'));
        });
    }
    /**
     * 关闭长连接
     */
    closeWS() {
        this.wsServer.close();
    }
}
exports.default = Serve;
