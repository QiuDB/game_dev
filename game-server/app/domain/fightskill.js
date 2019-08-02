const bearcat = require('bearcat');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);

let Fightskill = function(opts) {
    bearcat.getFunction('persistent').call(this, opts);

    this.dataApi = null;

    this.skillId = opts.skillId;
    this.level = opts.level;
    this.playerId = opts.playerId;
    this.skillData = DataApi.instance().fightskill().findById(this.skillId);
    this.name = this.skillData.name,
    this.coolDownTime = 0;
};

module.exports = {
    id: 'fightskill',
    func: Fightskill,
    scope: 'prototype',
    parent: 'persistent',
    args: [{
        name: 'opts',
        type: 'Object'
    }],
    props: [{
        name: 'dataApi',
        ref: 'dataApi'
    }]
}