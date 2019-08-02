const bearcat = require('bearcat');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);

let Equipments = function(opts) {
    bearcat.getFunction('persistent').call(this, opts);

    this.playerId = opts.playerId;
    this.weapon = opts.weapon || 0;
    this.armor = opts.armor || 0;
    this.helmet = opts.helmet || 0;
    this.necklace = opts.necklace || 0;
    this.ring = opts.ring || 0;
    this.belt = opts.belt || 0;
    this.shoes = opts.shoes || 0;
    this.legguard = opts.legguard || 0;
    this.amulet = opts.amulet || 0;
};

module.exports = {
    id: 'equipments',
    func: Equipments,
    lazy: true,
}