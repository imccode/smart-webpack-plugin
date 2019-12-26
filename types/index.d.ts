import { Compiler, Configuration } from 'webpack';
import { SmartWebpackPluginOptions } from './types';
/**
 * smart webpack 插件
 */
declare class SmartWebpackPlugin {
    options: SmartWebpackPluginOptions;
    webpackConfig: Configuration;
    constructor(options?: SmartWebpackPluginOptions);
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler: Compiler): void;
}
export default SmartWebpackPlugin;
