import { ServerWebpackPluginOptions } from 'index';
import { Compiler, Configuration, Entry, EntryFunc } from 'webpack';
/**
 * server webpack插件
 */
declare class ServerWebpackPlugin {
    options: ServerWebpackPluginOptions;
    webpackConfig: Configuration;
    constructor(options?: ServerWebpackPluginOptions);
    /**
     * 构造一个新的entry
     */
    structureEntry(entry: string | string[] | Entry | EntryFunc, wsPort: number): any[];
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
