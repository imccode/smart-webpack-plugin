declare type Log = {
    /**
     * 显示消息
     * @param message 消息文本
     * 蓝色
     */
    info(message: any): void;
    /**
     * 提示消息
     * @param message 消息文本
     * 黄色
     */
    warn(message: any): void;
    /**
     * 错误消息
     * @param message 消息文本
     * 红色
     */
    error(message: any): void;
    /**
     * 调试消息
     * @param message 消息文本
     * 紫色
     */
    debug(message: any): void;
};
declare const log: Log;
export default log;
