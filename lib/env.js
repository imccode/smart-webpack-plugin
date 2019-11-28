"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queueLog_1 = __importDefault(require("./queueLog"));
const chalk = require("chalk");
/**
 * 返回当前node的环境信息
 */
//@ts-ignore
const NODE_ENV = process.env.NODE_ENV || 'production';
exports.NODE_ENV = NODE_ENV;
queueLog_1.default.info(`当前构建环境${chalk.green(NODE_ENV)}`);
