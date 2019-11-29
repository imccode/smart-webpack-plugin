import { StyleWebpackPluginOptions } from 'index';
import { Compiler, Configuration } from 'webpack';
/**
 * 样式webpack插件
 */
declare class StyleWebpackPlugin {
    options: StyleWebpackPluginOptions;
    webpackConfig: Configuration;
    constructor(options?: StyleWebpackPluginOptions);
    /**
     * 注入默认配置
     * @param compiler
     */
    inject(compiler: Compiler): void;
    /**
     * 注入默认Loader配置
     * @param compiler
     */
    injectRules(compiler: Compiler): void;
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler: Compiler): void;
}
export default StyleWebpackPlugin;
