"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const webpack_log_1 = __importDefault(require("webpack-log"));
/**
 * 延时队列消息
 */
class QueueLog {
    constructor(name) {
        /**
         * 存储消息数组
         */
        this.message = [];
        /**
         * webpackLog实体
         */
        this.self = {};
        this.self = webpack_log_1.default({ name });
    }
    /**
     * 返回存储消息长度
     */
    get length() {
        return this.message.length;
    }
    /**
     * 显示消息
     * @param message 消息文本
     * 蓝色
     */
    info(message) {
        this.message.push({
            type: 'info',
            text: message
        });
        return {
            apply() {
                this.self.info(message);
                this.message.length -= 1;
            }
        };
    }
    /**
     * 提示消息
     * @param message 消息文本
     * 黄色
     */
    warn(message) {
        this.message.push({
            type: 'warn',
            text: message
        });
        return {
            apply() {
                this.self.warn(message);
                this.message.length -= 1;
            }
        };
    }
    /**
     * 错误消息
     * @param message 消息文本
     * 红色
     */
    error(message) {
        this.message.push({
            type: 'error',
            text: message
        });
        return {
            apply() {
                this.self.error(message);
                this.message.length -= 1;
            }
        };
    }
    /**
     * 调试消息
     * @param message 消息文本
     * 紫色
     */
    debug(message) {
        this.message.push({
            type: 'debug',
            text: message
        });
        return {
            apply() {
                this.self.debug(message);
                this.message.length -= 1;
            }
        };
    }
    /**
     * 打印存储的消息
     */
    apply() {
        this.message.forEach(({ type, text }) => {
            this.self[type](text);
        });
        console.log('\n');
        this.message = [];
    }
}
exports.default = new QueueLog('smart-webpack-plugin');
