const bearcat = require('bearcat');

let AttackBuffSkill = function(opts) {
    bearcat.getFunction('fightskill').call(this, opts);
};

AttackBuffSkill.prototype.use = function(attacker, target) {

};

module.exports = {
    id: 'attackBuffSkill',
    func: AttackBuffSkill,
    scope: 'prototype',
    parent: 'fightskill'
}