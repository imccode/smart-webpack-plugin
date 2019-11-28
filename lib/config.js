"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * 当前工作目录
 */
const root = process.cwd();
exports.root = root;
/**
 * package.json配置
 */
const packageConfig = require(path_1.default.resolve(root, 'package.json'));
exports.packageConfig = packageConfig;
/**
 * 是否使用了vue框架
 */
const isVue = (packageConfig.dependencies && packageConfig.dependencies.vue) ||
    (packageConfig.devDependencies && packageConfig.devDependencies.vue);
exports.isVue = isVue;
/**
 * 是否使用了react框架
 */
const isReact = (packageConfig.dependencies && packageConfig.dependencies.react) ||
    (packageConfig.devDependencies && packageConfig.devDependencies.react);
exports.isReact = isReact;
/**
 * 是否使用typescript语言
 */
const isTypescript = fs_1.default.existsSync(path_1.default.resolve(root, 'tsconfig.json'));
exports.isTypescript = isTypescript;
