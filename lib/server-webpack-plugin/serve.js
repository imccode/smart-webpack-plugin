"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = __importDefault(require("koa"));
const koa_compress_1 = __importDefault(require("koa-compress"));
const koa_static_1 = __importDefault(require("koa-static"));
class Serve {
    constructor(options, compiler) {
        this.options = options;
        this.compiler = compiler;
        this.httpServer = new koa_1.default();
        this.initServer();
    }
    initServer() {
        this.httpServer.use(koa_static_1.default(this.compiler.options.output.path));
        if (this.options.compress) {
            this.httpServer.use(koa_compress_1.default());
        }
        this.httpServer.listen(this.options.port);
    }
}
exports.default = Serve;
