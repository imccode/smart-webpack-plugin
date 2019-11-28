"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const querystring_1 = __importDefault(require("querystring"));
const pitcher_1 = __importDefault(require("vue-loader/lib/loaders/pitcher"));
const NormalModule_1 = __importDefault(require("webpack/lib/NormalModule"));
const RuleSet_1 = __importDefault(require("webpack/lib/RuleSet"));
const pluginName = 'VueWebpackPlugin';
const loaderName = 'vue-loader';
class VueWebpackPlugin {
    apply(compiler) {
        compiler.hooks.compilation.tap(pluginName, compilation => {
            let normalModuleLoader;
            if (Object.isFrozen(compilation.hooks)) {
                // webpack 5
                normalModuleLoader = NormalModule_1.default.getCompilationHooks(compilation).loader;
            }
            else {
                normalModuleLoader = compilation.hooks.normalModuleLoader;
            }
            normalModuleLoader.tap(pluginName, loaderContext => {
                loaderContext[loaderName] = true;
            });
        });
        const vueRules = new RuleSet_1.default([
            {
                test: /\.vue$/,
                use: [
                    {
                        loader: 'vue-loader'
                    }
                ]
            }
        ]).rules[0];
        const vueLoaderOptions = {
            cacheDirectory: undefined,
            cacheIdentifier: undefined
        };
        compiler.options.module.rules.push(...[
            {
                loader: pitcher_1.default,
                resourceQuery: query => {
                    const parsed = querystring_1.default.parse(query.slice(1));
                    return parsed.vue != null;
                },
                options: vueLoaderOptions
            },
            {
                ...vueRules,
                use: [
                    {
                        ...vueRules.use[0],
                        ident: 'vue-loader-options',
                        options: vueLoaderOptions
                    }
                ]
            }
        ]);
    }
}
exports.default = VueWebpackPlugin;
