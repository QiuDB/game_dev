const bearcat = require('bearcat');
const Consts = require('../../consts/consts');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);

let Item = function(opts) {

    bearcat.getFunction('entity').call(this, opts);

    this.opts = opts;
};

Item.prototype.init = function() {
    let opts = this.opts || {};

    this.type = Consts.EntityType.ITEM;
    this.name = opts.name;
    this.desc = opts.desc;
    this.englishDesc = opts.englishDesc;
    this.hp = opts.hp;
    this.mp = opts.mp;
    this.price = opts.price;
    this.heroLevel = opts.heroLevel;
    this.imgId = opts.imgId;
    this.lifetime = 30000;
    this.time = Date.now();
    this.playerId = opts.playerId;
    this.died = false;
};

Item.prototype.update = function() {
    let next = Date.now();
    this.lifetime -= (next - this.time);

    this.time = next;
    this.died = this.lifetime <= 0 ? true : false;
}

Item.prototype.toJSON = function() {
    let result = bearcat.getFunction('entity').prototype.apply(this);
    result.playerId = this.playerId;
    result.type = this.type;
}

module.exports = {
    id: 'item',
    func: Item,
    scope: 'prototype',
    init: 'init',
    parent: 'entity',
    args: [{
        name: 'opts',
        type: 'Object'
    }]
}