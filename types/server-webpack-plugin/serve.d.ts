import { ServerWebpackPluginOptions, WSMessageType } from '../types';
import { Compiler } from 'webpack';
declare class Serve {
    private options;
    private socket;
    private httpServer;
    private wsServer;
    private compiler;
    wsPort: number;
    constructor(options: ServerWebpackPluginOptions, compiler: Compiler);
    initServer(): void;
    /**
     * 打开长连接
     */
    openWS(): void;
    /**
     * 发送长连接数据-到客户端
     * @param data 发送的数据
     */
    sendWS(type: WSMessageType, data?: any): void;
    /**
     * 关闭长连接
     */
    closeWS(): void;
    hooks(): void;
}
export default Serve;
