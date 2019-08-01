const bearcat = require('bearcat');
const util = require('util');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);

let Character = function(opts) {
    let Entity = bearcat.getFunction('entity');
    Entity.call(this, opts);

    this.dataApi = null;

    this.orientation = opts.orientation;
    this.target = null;
    this.attackers = {};

    // the entity who hate me
    // I would notify my enemies to forget me when I disapear or die
    this.enemies = {};

    // the entity I hate
    // I would set my target as the entity that I hate most
    this.haters = {};

    this.died = false;
    this.hp = opts.hp;
    this.mp = opts.mp;
    this.maxHp = opts.maxHp;
    this.maxMp = opts.maxMp;
    this.level = opts.level;
    this.experience = opts.experience;
    this.attackValue = opts.attackValue;
    this.defenceValue = opts.defenceValue;
    this.totalAttackValue = opts.totalAttackValue || 0;
    this.totalDefenceValue = opts.totalDefenceValue || 0;
    this.hitRate = opts.hitRate;
    this.dodgeRate = opts.dodgeRate;
    this.walkSpeed = opts.walkSpeed;
    this.attackSpeed = opts.attackSpeed;
    this.isMoving = false;

    this.attackParam = 1;
    this.defenceParam = 1;
    this.equipmentParam = 1;
    this.buffs = [];
    this.curSkill = 1;  //default normal attack
    // this.characterData = this.dataApi.character().findById(this.kindId);
    this.fightSkills = {};
};

Character.prototype.toJSON = function() {
    let result = bearcat.getFunction('entity').prototype.toJSON.apply(this);

    result.hp = this.hp;
    result.mp = this.mp,
    result.walkSpeed = this.walkSpeed;

    return result;
}

module.exports = {
    id: 'character',
    func: Character,
    scope: 'prototype',
    parent: 'entity',
    props: [{
        name: 'dataApi',
        ref: 'dataApi'
    }]
}