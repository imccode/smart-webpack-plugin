import { Compiler } from 'webpack';
import { ServerWebpackPluginOptions, WSMessageType } from '../../types';
declare class WsServe {
    private options;
    private socket;
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
export default WsServe;
