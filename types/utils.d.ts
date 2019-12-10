import { Entry, EntryFunc } from 'webpack';
/**
 * 获取本机ip数组
 */
declare const localIps: () => string[];
/**
 * 构造一个新的entry
 */
declare const structureEntry: (entry: string | string[] | Entry | EntryFunc, firstModule: string) => {};
/**
 * entry是否包含 条件module
 */
declare const includesEntry: (entry: string | string[] | Entry | EntryFunc, module: string) => any;
export { localIps, structureEntry, includesEntry };
