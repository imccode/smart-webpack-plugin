import { Compiler, Configuration } from 'webpack';
import { ServerWebpackPluginOptions } from '../types';
/**
 * server webpack插件
 */
declare class ServerWebpackPlugin {
    options: ServerWebpackPluginOptions;
    webpackConfig: Configuration;
    constructor(options?: ServerWebpackPluginOptions);
    /**
     * 注入默认热更新服务
     * @param compiler
     */
    injectHotServer(compiler: Compiler): void;
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
export default ServerWebpackPlugin;
