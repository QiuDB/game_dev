const logger = require('pomelo-logger').getLogger('pomelo', __filename);
const chokidar = require('chokidar');
const path = require('path');
const pomelo = require('pomelo');

const configPath = path.resolve(pomelo.app.getBase() + '/config/data');
let DataApi = function() {
    this.datas = {};
    this.watcher = null;
};

DataApi.prototype.init = function() {
    let watcher = chokidar.watch(configPath);

    // 监听配置文件修改
    watcher.on('change', (path) => {
        this.watchFileChanged(path)
    })

    // 监听配置文件新增
    watcher.on('add', (path) => {
        this.watchFileAdded(path)
    });
};

DataApi.prototype.load = function(filepath) {
    // 获取文件名
    let filename = path.basename(filepath);
    // 去掉后缀
    if (!/\.json$/.test(filename)) {
        // 不是.json文件，不处理
        logger.error('配置文件不是json格式')
        return;
    }
    filename = filename.substr(0, filename.length - '.json'.length);

    this.datas[filename] = new DataApiUtil().init(require(filepath));
};

DataApi.prototype.area = function() {
    return this.datas.area;
};

DataApi.prototype.character = function() {
    return this.datas.character;
}

/**
 * 检测到文件变更时，删除缓存，重新加载配置文件
 * @param filepath 变更的文件路径
 */
DataApi.prototype.watchFileChanged = function(filepath) {
    if (require.cache[filepath]) {
        delete require.cache[filepath];
    }
    this.load(filepath);
};

/**
 * 检测到新增文件时，加载配置文件
 * @param filepath 新增文件的路径
 */
DataApi.prototype.watchFileAdded = function(filepath) {
    this.load(filepath);
}

let DataApiUtil = function() {
    this.data = null;
};

DataApiUtil.prototype.init = function(data) {
    let fields = {};
    data[1].forEach((i, k) => {
        fields[i] = k;
    });

    data.splice(0, 2);

    let result = {}, item;
    data.forEach((k) => {
        item = this.mapData(fields, k);
        result[item.id] = item;
    });

    this.data = result;
    return this;
};

DataApiUtil.prototype.mapData = function(fields, item) {
    let o = {};
    for (let k in fields) {
        o[k] = item[fields[k]];
    }
    return o;
};

DataApiUtil.prototype.findById = function(id) {
    return this.data[id];
};

DataApiUtil.prototype.all = function() {
    return this.data;
};

module.exports = {
    id: 'dataApi',
    func: DataApi,
    init: 'init'
}