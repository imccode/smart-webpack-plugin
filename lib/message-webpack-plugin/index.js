"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const format_1 = __importDefault(require("./format"));
exports.formatWebpackMessages = format_1.default;
const pluginName = 'MessageWebpackPlugin';
/**
 * 消息webpack插件
 */
class MessageWebpackPlugin {
    constructor(options = {}) {
        this.options = {};
        this.options = { ...this.options, ...options };
    }
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler) {
        const isTTY = process.stdout.isTTY;
        const clearConsole = () => process.stdout.write(process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H');
        compiler.hooks.invalid.tap(pluginName, () => {
            if (isTTY && compiler.options.mode === 'development')
                clearConsole();
            console.log(`\n🛠 ${chalk_1.default.green('正在编译...')}`);
        });
        compiler.hooks.done.tap(pluginName, stats => {
            if (isTTY && compiler.options.mode === 'development')
                clearConsole();
            if (!stats.hasErrors() && !stats.hasWarnings()) {
                console.log(`\n✅ ${chalk_1.default.green('编译成功!')}`);
                this.options.success && this.options.success();
                return;
            }
            const message = format_1.default(stats.toJson({
                all: false,
                warnings: true,
                errors: true
            }));
            if (message.errors.length > 0) {
                console.log(`\n❌ ${chalk_1.default.red('编译失败！')}\n`);
                console.log(message.errors.join('\n\n'));
                this.options.errors && this.options.errors(stats.compilation.errors);
                return;
            }
            if (message.warnings.length > 0) {
                console.log(`\n❓${chalk_1.default.yellow('编译警告！')}\n`);
                console.log(message.warnings.join('\n\n'));
                this.options.warnings && this.options.warnings(stats.compilation.warnings);
                return;
            }
        });
    }
}
exports.MessageWebpackPlugin = MessageWebpackPlugin;
exports.default = MessageWebpackPlugin;
