
let bearcat = require('bearcat');
const Consts = require('../../consts/consts');
/**
 * Initialize a new 'Player' with the given 'opts'.
 * Player inherits Character
 *
 * @param {Object} opts
 * @api public
 */

let Player = function(opts) {
    let Character = bearcat.getFunction('character');
    Character.call(this, opts);

    this.opts = opts;
};

Player.prototype.init = function() {
    let opts = this.opts;
    this.id = Number(opts.id);
    this.type = Consts.EntityType.PLAYER;
    this.userId = opts.userId;
    this.name = opts.name;
    this.equipments = opts.equipments;
    this.bag = opts.bag;
    this.skillPoint = opts.skillPoint || 0;
    // var _exp = dataApi.experience.findById(this.level+1);
    // if (!!_exp) {
    //   this.nextLevelExp = dataApi.experience.findById(this.level+1).exp;
    // } else {
    //   this.nextLevelExp = 999999999;
    // }
    // this.roleData = dataApi.role.findById(this.kindId);
    this.curTasks = opts.curTasks;
    this.range = opts.range || 2;
    // player's team id, default 0(not in any team).
    this.teamId = Consts.TEAM.TEAM_ID_NONE;
    // is the team captain, default false
    this.isCaptain = Consts.TEAM.NO;
    // game copy flag
    this.isInTeamInstance = false;
    this.instanceId = 0;
}

Player.prototype.toJSON = function() {
    // 获取基类数据
    let Character = bearcat.getFunction('character');
    let result = Character.prototype.toJSON.apply(this);

    result.id = this.id;
    result.type = this.type;
    result.userId = this.userId;
    result.name = this.name;

    return result;
}

module.exports = {
    id: 'player',
    func: Player,
    scope: 'prototype',
    parent: 'character',
    init: 'init',
    args: [{
        name: 'opts',
        type: 'Object'
    }],
    props: []
}