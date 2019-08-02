const EventEmiter = require('events').EventEmitter;
const util = require('util');

/**
 * Persistent object, it is saved in database
 *
 * @param {Object} opts
 * @api public
 */
var Persistent = function(opts) {
    this.id = opts.id;
    this.type = opts.type;
    EventEmiter.call(this);
};

util.inherits(Persistent, EventEmiter);

Persistent.prototype.save = function() {
    this.emit('save');
};

module.exports = {
    id: 'persistent',
    func: Persistent
};