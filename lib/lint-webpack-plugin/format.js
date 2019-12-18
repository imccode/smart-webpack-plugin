"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const text_table_1 = __importDefault(require("text-table"));
const format = (results) => {
    let output = '';
    results.forEach(result => {
        output += text_table_1.default(result.messages.map(({ line, column, message, ruleId, fatal, severity }) => {
            const isError = fatal || severity === 2;
            return [
                chalk_1.default.bold(`Line ${line}:${column}`),
                message,
                chalk_1.default.underline[isError ? 'red' : 'yellow'](ruleId || '')
            ];
        }), {
            align: ['l', 'l', 'l']
        });
        output += '\n';
    });
    return output;
};
exports.default = format;
