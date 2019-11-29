import { LintWebpackPluginOptions } from 'index';
import { Compiler, Configuration } from 'webpack';
/**
 * 代码校验webpack插件
 */
declare class LintWebpackPlugin {
    options: LintWebpackPluginOptions;
    webpackConfig: Configuration;
    constructor(options?: LintWebpackPluginOptions);
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
export default LintWebpackPlugin;
