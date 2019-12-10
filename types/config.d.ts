/**
 * 当前工作目录
 */
declare const root: string;
/**
 * package.json配置
 */
declare const packageConfig: any;
/**
 * 是否使用了vue框架
 */
declare const isVue: string | undefined;
/**
 * 是否使用了react框架
 */
declare const isReact: string | undefined;
/**
 * 是否使用typescript语言
 */
declare const isTypescript: boolean;
export { root, packageConfig, isVue, isReact, isTypescript };
