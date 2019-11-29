import { AssetWebpackPluginOptions, FrameworkState } from 'index';
import { Compiler, Configuration } from 'webpack';
/**
 * 媒体资源webpack插件
 */
declare class AssetWebpackPlugin {
    options: AssetWebpackPluginOptions;
    webpackConfig: Configuration;
    private framework;
    constructor(options?: AssetWebpackPluginOptions, framework?: FrameworkState);
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler: Compiler): void;
}
export default AssetWebpackPlugin;
