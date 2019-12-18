import { Compiler, Configuration } from 'webpack';
import { MessageWebpackPluginOptions } from '../types';
import formatWebpackMessages from './format';
/**
 * 消息webpack插件
 */
declare class MessageWebpackPlugin {
    options: MessageWebpackPluginOptions;
    webpackConfig: Configuration;
    constructor(options?: MessageWebpackPluginOptions);
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler: Compiler): void;
}
export { formatWebpackMessages, MessageWebpackPlugin };
export default MessageWebpackPlugin;
