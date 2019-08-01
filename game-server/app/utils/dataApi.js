const logger = require('pomelo-logger').getLogger('pomelo', __filename);
const chokidar = require('chokidar');
const path = require('path');
const pomelo = require('pomelo');

const configPath = path.resolve(pomelo.app.getBase() + '/config/data');
let DataApi = function() {
    this.datas = null;
    this.watcher = null;
};

DataApi.prototype.init = function() {
    let watcher = chokidar.watch(configPath, {
        ignoreInitial: true
    });

    // 监听配置文件修改
    watcher.on('change', (path) => {
        this.watchFileChanged(path)
    })

    // 监听配置文件新增
    watcher.on('add', (path) => {
        this.watchFileAdded(path)
    });
}

DataApi.prototype.watchFileChanged = function(filepath) {
    logger.warn('serverId %j, File %j was changed', pomelo.app.getServerId(), filepath);
};

DataApi.prototype.watchFileAdded = function(filepath) {
    logger.warn('serverId %j, File %j was added', pomelo.app.getServerId(), filepath);
}

module.exports = {
    id: 'dataApi',
    func: DataApi,
    init: 'init'
}