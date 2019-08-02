const bearcat = require('bearcat');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);

/**
 * Initialize a new 'Bag' with the given 'opts'
 * Bag inherits Persistent
 *
 * @param {Object} opts
 * @api public
 */
let Bag = function(opts) {
    bearcat.getFunction('persistent').call(this, opts);
    this.itemCount = opts.itemCount || 20;
    this.items = opts.items || {};
};

module.exports = {
    id: 'id',
    func: Bag,
    scope: 'prototype',
    parent: 'presisten',
    args: [{
        name: 'opts',
        type: 'Object '
    }]
}