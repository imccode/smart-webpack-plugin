"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const transformErrors_1 = __importDefault(require("friendly-errors-webpack-plugin/src/core/transformErrors"));
const babelSyntax_1 = __importDefault(require("friendly-errors-webpack-plugin/src/transformers/babelSyntax"));
const moduleNotFound_1 = __importDefault(require("friendly-errors-webpack-plugin/src/transformers/moduleNotFound"));
const esLintError_1 = __importDefault(require("friendly-errors-webpack-plugin/src/transformers/esLintError"));
const utils_1 = __importDefault(require("friendly-errors-webpack-plugin/src/utils"));
const defaultTransformers = [babelSyntax_1.default, moduleNotFound_1.default, esLintError_1.default];
const transformers = utils_1.default.concat(defaultTransformers, []);
exports.default = (errors) => {
    const processedErrors = transformErrors_1.default(errors, transformers);
    return processedErrors.map(({ message }) => message).join('\n');
};
