const bearcat = require('bearcat');
const Consts = require('../../consts/consts');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);

/**
 * Initialize a new 'Equipment' with the given 'opts'.
 * Equipment inherits Entity
 *
 * @class ChannelService
 * @constructor
 * @param {Object} opts
 * @api public
 */
let Equipment = function(opts) {
    // 调用基类
    let Entity = bearcat.getFunction('entity');
    Entity.call(this, opts);

    this.opts = opts;
};

Equipment.prototype.init = function() {

    let opts = this.opts || {};

    this.type = Consts.EntityType.EQUIPMENT;
    this.name = opts.name;
    this.desc = opts.desc;
    this.englishDesc = opts.englishDesc;
    this.kind = opts.kind;
    this.attackValue = parseInt(opts.attackValue);
    this.defenceValue = parseInt(opts.defenceValue);
    this.price = opts.price;
    this.color = opts.color;
    this.heroLevel = opts.heroLevel;
    this.imgId = opts.imgId;
    this.playerId = opts.playerId;

    this.lifetime = 30000;
    this.time = Date.now();
    this.died = false;
}

/**
 * Equipment refresh every 'lifetime' millisecond
 *
 * @api public
 */
Equipment.prototype.update = function() {
    let next = Date.now();
    this.lifetime -= (next - this.time);

    this.time = next;
    this.died = (this.lifetime < 0) ? true : false;
}

Equipment.prototype.toJSON = function() {
    let result = bearcat.getFunction('entity').prototype.toJSON.apply(this);
    result.playerId = this.playerId;
    result.type = this.type;

    return result;
}

module.exports = {
    id: 'equipment',
    func: Equipment,
    init: 'init',
    scope: 'prototype',
    parent: 'entity',
    args: [{
        name: 'opts',
        type: 'Object'
    }]
}