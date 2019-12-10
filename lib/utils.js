"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("net");
const os_1 = require("os");
/**
 * 获取本机ip数组
 */
const localIps = () => {
    let ips = [];
    const networks = os_1.networkInterfaces();
    Object.values(networks).forEach(item => {
        item.forEach(({ address }) => {
            if (net_1.isIPv4(address) && address !== '127.0.0.1') {
                ips.push(address);
            }
        });
    });
    return ips;
};
exports.localIps = localIps;
/**
 * 构造一个新的entry
 */
const structureEntry = (entry, firstModule) => {
    if (typeof entry === 'string') {
        return [firstModule, entry];
    }
    else if (Array.isArray(entry)) {
        return [firstModule, ...entry];
    }
    else if (typeof entry === 'function') {
        // @ts-ignore
        return () => structureEntry(entry(), firstModule);
    }
    const newEntry = {};
    Object.keys(entry).forEach(key => {
        newEntry[key] = structureEntry(entry[key], firstModule);
    });
    return newEntry;
};
exports.structureEntry = structureEntry;
/**
 * entry是否包含 条件module
 */
const includesEntry = (entry, module) => {
    if (typeof entry === 'string' || Array.isArray(entry)) {
        return entry.includes(module);
    }
    else if (typeof entry === 'function') {
        // @ts-ignore
        return includesEntry(entry(), module);
    }
    for (let i = 0, len = Object.keys(entry).length; i < len; i++) {
        if (includesEntry(entry[i], module))
            return true;
    }
    return false;
};
exports.includesEntry = includesEntry;
