import { AssetWebpackPluginOptions } from 'asset-webpack-plugin';
import { ServeWebpackPluginOptions } from 'serve-webpack-plugin';
import { MessageWebpackPluginOptions } from 'message-webpack-plugin';
import { StylesWebpackPluginOptions } from 'styles-webpack-plugin';
import { ScriptWebpackPluginOptions } from 'script-webpack-plugin';
export = SmartWebpackPlugin;
declare namespace SmartWebpackPlugin {
    /**
     * 使用了那些框架
     */
    interface FrameworkState {
        /**
         * 是否使用了vue框架
         */
        isVue?: boolean;
        /**
         * 是否使用了react框架
         */
        isReact?: boolean;
    }
    /**
     * CosmiconfigResult
     */
    type SmartCosmiconfigResult<T> = {
        /**
         * 配置
         */
        config: T;
        /**
         * 配置文件路径
         */
        filepath: string;
        /**
         * 配置是否为空
         */
        isEmpty?: boolean;
    } | null;
    /**
     * script-webpack-plugin 插件的可配参数
     */
    interface SmartWebpackPluginOptions {
        /**
         * script-webpack-plugin 脚本资源 插件的可配参数
         */
        script?: false | ScriptWebpackPluginOptions;
        /**
         * style-webpack-plugin 样式资源 插件的可配参数
         */
        style?: false | StylesWebpackPluginOptions;
        /**
         * asset-webpack-plugin 媒体资源 插件的可配参数
         */
        asset?: false | AssetWebpackPluginOptions;
        /**
         * lint-webpack-plugin 代码校验 插件的可配参数
         */
        lint?: false | LintWebpackPluginOptions;
        /**
         * serve-webpack-plugin 本地开发环境 插件的可配参数
         */
        serve?: false | ServeWebpackPluginOptions;
        /**
         * message-webpack-plugin webpack消息插件
         */
        message?: false | MessageWebpackPluginOptions;
    }
    /**
     * lint-webpack-plugin 代码校验 插件的可配参数
     */
    interface LintWebpackPluginOptions {
        /**
         * 是否在校验之前自动修复不规则的代码
         */
        fix?: boolean;
        /**
         * eslint配置规则
         */
        eslint?: false | {
            /**
             * 是否在校验之前自动修复不规则的代码
             */
            fix?: boolean;
            /**
             * 未来可能引入的配置
             */
            [key: string]: any;
        };
        /**
         * stylelint配置规则
         */
        stylelint?: false | {
            /**
             * 是否在校验之前自动修复不规则的代码
             */
            fix?: boolean;
            /**
             * 未来可能引入的配置
             */
            [key: string]: any;
        };
    }
}
