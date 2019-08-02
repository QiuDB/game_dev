const bearcat = require('bearcat');

let AttackSkill = function(opts) {
    bearcat.getFunction('fightskill').call(this, opts);
};

AttackSkill.prototype.use = function(attacker, target) {

};

module.exports = {
    id: 'attackSkill',
    func: AttackSkill,
    scope: 'prototype',
    parent: 'fightskill'
}