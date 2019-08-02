const bearcat = require('bearcat');

let CommonAttackSkill = function (opts) {
    bearcat.getFunction('attackSkill').call(this, opts);
};

CommonAttackSkill.prototype.use = function (attacker, target) {

};

module.exports = {
    id: 'commonAttackSkill',
    func: CommonAttackSkill,
    scope: 'prototype',
    parent: 'attackSkill'
}