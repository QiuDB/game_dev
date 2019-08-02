const bearcat = require('bearcat');

let BuffSkill = function(opts) {
    bearcat.getFunction('fightskill').call(this, opts);
};

BuffSkill.prototype.use = function(attacker, target) {

};

module.exports = {
    id: 'buffSkill',
    func: BuffSkill,
    scope: 'prototype',
    parent: 'fightskill'
}