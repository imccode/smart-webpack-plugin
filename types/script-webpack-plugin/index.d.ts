import { ScriptWebpackPluginOptions } from 'index';
import { Compiler, Configuration } from 'webpack';
/**
 * 脚本webpack插件
 */
declare class ScriptWebpackPlugin {
    options: ScriptWebpackPluginOptions;
    webpackConfig: Configuration;
    constructor(options?: ScriptWebpackPluginOptions);
    /**
     * 注入vue的loader配置
     * @param compiler
     */
    injectVue(compiler: Compiler): void;
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
export default ScriptWebpackPlugin;
