"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
const net_1 = require("net");
/**
 * 获取本机ip数组
 */
const localIps = () => {
    let ips = [];
    const networks = os_1.networkInterfaces();
    Object.values(networks).forEach(item => {
        item.forEach(({ address }) => {
            if (net_1.isIPv4(address)) {
                ips.push(address);
            }
        });
    });
    return ips;
};
exports.localIps = localIps;
