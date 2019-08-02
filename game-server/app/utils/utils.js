let Utils = function () { };

Utils.instance = function() {
    return bearcat.getBean('utils');
}

/**
 * Check and invoke callback function
 */
Utils.prototype.invokeCallback = function (cb) {
    if (!!cb && typeof cb === 'function') {
        cb.apply(null, Array.prototype.slice.call(arguments, 1));
    }
};

module.exports = {
    id: 'utils',
    func: Utils
}