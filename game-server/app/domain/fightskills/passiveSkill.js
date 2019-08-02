const bearcat = require('bearcat');

let PassiveSkill = function(opts) {
    bearcat.getFunction('buffskill').call(this, opts);
};

PassiveSkill.prototype.use = function(attacker, target) {

};

module.exports = {
    id: 'passiveSkill',
    func: PassiveSkill,
    scope: 'prototype',
    parent: 'buffskill'
}