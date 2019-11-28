"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const simple_progress_webpack_plugin_1 = __importDefault(require("simple-progress-webpack-plugin"));
exports.default = (options) => {
    const config = {
        plugins: [
            /**
             * 显示构建过程
             */
            new simple_progress_webpack_plugin_1.default({ format: 'minimal' })
        ]
    };
    return config;
};
