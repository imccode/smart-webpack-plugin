import { SmartWebpackPluginOptions } from './types';
import { Compiler, Configuration } from 'webpack';
import AssetWebpackPlugin from './asset-webpack-plugin';
import LintWebpackPlugin from './lint-webpack-plugin';
import ProgressWebpackPlugin from './progress-webpack-plugin';
import ScriptWebpackPlugin from './script-webpack-plugin';
import ServerWebpackPlugin from './server-webpack-plugin';
import StyleWebpackPlugin from './style-webpack-plugin';
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
export { SmartWebpackPlugin, ScriptWebpackPlugin, StyleWebpackPlugin, AssetWebpackPlugin, LintWebpackPlugin, ProgressWebpackPlugin, ServerWebpackPlugin };
