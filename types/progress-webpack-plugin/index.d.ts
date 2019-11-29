import { ProgressWebpackPluginOptions } from '../types';
import { Compiler, Configuration } from 'webpack';
/**
 * 媒体资源webpack插件
 */
declare class ProgressWebpackPlugin {
    options: ProgressWebpackPluginOptions;
    webpackConfig: Configuration;
    constructor(options?: ProgressWebpackPluginOptions);
    /**
     * 注入默认配置
     * @param compiler
     */
    inject(compiler: Compiler): void;
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler: Compiler): void;
}
export default ProgressWebpackPlugin;
