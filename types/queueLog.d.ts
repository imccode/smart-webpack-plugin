/**
 * 延时队列消息
 */
declare class QueueLog {
    /**
     * 存储消息数组
     */
    private message;
    /**
     * webpackLog实体
     */
    private self;
    /**
     * 返回存储消息长度
     */
    get length(): number;
    constructor(name: string);
    /**
     * 显示消息
     * @param message 消息文本
     * 蓝色
     */
    info(message: string): void;
    /**
     * 提示消息
     * @param message 消息文本
     * 黄色
     */
    warn(message: string): void;
    /**
     * 错误消息
     * @param message 消息文本
     * 红色
     */
    error(message: string): void;
    /**
     * 调试消息
     * @param message 消息文本
     * 紫色
     */
    debug(message: string): void;
    /**
     * 打印存储的消息
     */
    apply(): void;
}
declare const _default: QueueLog;
export default _default;
