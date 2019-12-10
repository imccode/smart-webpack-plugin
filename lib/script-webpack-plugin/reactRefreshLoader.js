"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ReactRefreshLoader = function (content) {
    this.cacheable();
    return content + '\nif (module.hot) module.hot.accept();';
};
exports.default = ReactRefreshLoader;
module.exports = ReactRefreshLoader;
