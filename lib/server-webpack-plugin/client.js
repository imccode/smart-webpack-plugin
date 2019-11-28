"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const log = msg => console.warn('Smart-Webpack-Plugin: ' + msg);
class ClientSocket {
    constructor(options) {
        this.options = options;
        this.connect();
    }
    connect() {
        this.socket = new window.WebSocket(this.options.url, 'ws');
        this.socket.addEventListener('open', () => log('热更新初始化成功！'));
    }
    close() {
        this.socket && this.socket.close();
    }
    addEventListener(type, listener) {
        this.socket.addEventListener(type, listener);
    }
    removeEventListener(type, listener) {
        this.socket.removeEventListener(type, listener);
    }
}
const hotUpdate = async () => {
    // @ts-ignore
    const hot = module.hot;
    if (hot) {
        let updatedModules;
        const status = hot.status();
        if (['fail', 'abort'].includes(status)) {
            log('编译完成，整页重新加载！');
            window.location.reload();
            return;
        }
        if (status === 'idle') {
            try {
                updatedModules = await hot.check();
                if (!updatedModules)
                    return;
            }
            catch (error) {
                console.error(error);
                return;
            }
        }
        try {
            const outdatedModules = await hot.apply({
                ignoreUnaccepted: true,
                ignoreDeclined: true,
                ignoreErrored: true,
                onErrored(data) {
                    console.error('发生错误:\n', data);
                }
            });
            log('编译完成，页面局部已更新！');
            const unacceptedModules = updatedModules.filter(moduleId => outdatedModules && !outdatedModules.includes(moduleId));
            if (unacceptedModules.length > 0)
                window.location.reload();
        }
        catch (error) {
            console.error(error);
        }
    }
};
const client = buildHash => {
    const socket = new ClientSocket({
        url: 'ws://127.0.0.1:55551'
    });
    window.addEventListener('beforeunload', socket.close);
    socket.addEventListener('message', message => {
        const { type, data } = JSON.parse(message.data);
        switch (type) {
            case 'beforeUpdate':
                log('正在编译最新代码...');
                break;
            case 'update':
                buildHash === data ? log('代码无改变，暂不更新!') : hotUpdate();
                break;
        }
    });
};
(() => {
    let hash = '<unknown>';
    try {
        // @ts-ignore
        hash = __webpack_hash__;
    }
    catch (e) { }
    client(hash);
})();
