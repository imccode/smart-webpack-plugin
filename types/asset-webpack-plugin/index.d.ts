import { AssetWebpackPluginOptions } from '../types';
import { Compiler, Configuration } from 'webpack';
/**
 * 媒体资源webpack插件
 */
declare class AssetWebpackPlugin {
    options: AssetWebpackPluginOptions;
    webpackConfig: Configuration;
    constructor(options?: AssetWebpackPluginOptions);
    /**
     * 执行插件
     * @param compiler
     */
    apply(compiler: Compiler): void;
}
export default AssetWebpackPlugin;
