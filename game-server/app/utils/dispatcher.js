

const crc = require('crc');

let Dispatcher = function() {};

module.exports = {
    id: 'dispatcher',
    func: Dispatcher
};

Dispatcher.prototype.dispatch = function(uid, connectors) {
    let index = Math.abs(crc.crc32('' + uid)) % connectors.length;
    return {host: connectors[index].clientHost, port: connectors[index].clientPort};
}