const logger = require('pomelo-logger').getLogger('pomelo', __filename);
const chokidar = require('chokidar');
const path = require('path');
const pomelo = require('pomelo');

const configPath = path.resolve(pomelo.app.getBase() + '/config/data');
let DataApi = function() {
    this.datas = null;
    let watcher = chokidar.watch(configPath);
    watcher.on('change', function(path) {
        logger.warn('File %j was changed', path);
    });

    watcher.on('add', function(path) {
        logger.warn('File %j was added', path);
    });
};

module.exports = {
    id: 'dataApi',
    func: DataApi
}