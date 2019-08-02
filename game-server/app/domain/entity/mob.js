const bearcat = require('bearcat');
const Consts = require('../../consts/consts');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);

let Mob = function(opts) {
    bearcat.getFunction('character').call(this, opts);
};

Mob.prototype.init = function() {
    let opts = this.opts || {};

    this.type = Consts.EntityType.MOB;
    this.spawningX = opts.x;
    this.spawningY = opts.y;
    this.level = parseInt(opts.level);
    this.armorLevel = opts.armorLevel;
    this.weaponLevel = opts.weaponLevel;
    this.zoneId = opts.zoneId;
}

module.exports = {
    id: 'mob',
    func: Mob,
    scope: 'prototype',
    parent: 'character',
    init: 'init',
    args: [{
        name: 'opts',
        type: 'Object'
    }]
}