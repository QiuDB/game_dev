const bearcat = require('bearcat');
const Consts = require('../../consts/consts');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);

/**
 * Initialize a new 'Npc' with the given 'opts'.
 * Npc inherits Entity
 *
 * @param {Object} opts
 * @api public
 */
let Npc = function(opts) {
    bearcat.getFunction('entity').call(this, opts);

    this.opts = opts;
};

module.exports = {
    id: 'npc',
    func: Npc,
    scope: 'prototype',
    init: 'init',
    parent: 'entity',
    args: [{
        name: 'opts',
        type: 'Object'
    }]
}