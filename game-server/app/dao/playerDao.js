const pomelo = require('pomelo');
const bearcat = require('bearcat');
const async = require('async');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);
const Consts = require('../consts/consts');

let PlayerDao = function() {
    this.utils = null;
    this.equipmentsDao = null;
    this.bagDao = null;
    this.fightskillDao = null;
    this.taskDao = null;
};

module.exports = {
    id : 'playerDao',
    func: PlayerDao,
    props: [{
        name: 'utils',
        ref: 'utils'
    }, {
        name: 'equipmentsDao',
        ref: 'equipmentsDao',
    }, {
        name: 'bagDao',
        ref: 'bagDao'
    }, {
        name: 'fightskillDao',
        ref: 'fightskillDao'
    }, {
        name: 'taskDao',
        ref: 'taskDao'
    }]
}

PlayerDao.prototype.getPlayer = function(playerId, cb) {
    let sql = 'select * from Player where id = ?';
    let args = [playerId];

    pomelo.app.get('dbClient').query(sql, args, (err, results) => {
        if (!!err) {
            this.utils.invokeCallback(cb, err.message, null)
            return;
        }

        if (!results || results.length === 0) {
            this.utils.invokeCallback(cb, null, null);
            return;
        }

        let player = bearcat.getBean('player', results[0]);
        logger.debug('player is %j', player);
        this.utils.invokeCallback(cb, null, player);
    })
};

PlayerDao.prototype.getPlayerByUid = function(uid, cb) {
    let sql = 'select * from Player where userId = ? limit 1';
    let args = [uid];
    let self = this;
    pomelo.app.get('dbClient').query(sql, args, function(err, res) {
        if (err) {
            self.utils.invokeCallback(cb, err.message, null);
            return;
        }

        if (!res || res.length === 0) {
            self.utils.invokeCallback(cb, null, null);
        } else {
            utils.invokeCallback(cb, null, res);
        }
    })
}

PlayerDao.prototype.createPlayer = function(uid, name, roleId, cb) {
    let sql = 'insert into Player (' +
            'userId, kindId, kindName, name, country, rank, level, experience, attackValue, defenceValue, hitRate,' +
            'dodgeRate, walkSpeed, attackSpeed, hp, mp, maxHp, maxMp, areaId, x, y, skillPoint) ' +
            'values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
    let character = bearcat.getBean('dataApi').character().findById(roleId);
    let role = {name: character.englishName, career: 'warrior', country: 1, gender: 'male'};
    let born = Consts.BornPlace;
    let x = born.x + Math.floor(Math.random() * born.width);
    let y = born.y + Math.floor(Math.random() + born.height);
    let areaId = Consts.PLAYER.initAreaId;
    let args = [uid, roleId, character.englishName, name, 1, 1, 1, 0, character.attackValue, character.defenceValue, character.hitRate,
        character.dodgeRate, character.walkSpeed, character.attackSpeed, character.hp, character.mp, character.hp, character.mp,
        areaId, x, y, 1];

    pomelo.app.get('dbClient').insert(sql, args, (err, res) => {
        if (err) {
            logger.error('create player failed! ' + err.message);
            self.utils.invokeCallback(cb, err.message, null);
            return;
        }

        let player = {
            id: '' + res.insertId,
            userId: '' + uid,
            kindId: roleId,
            kindName: role.name,
            areaId: areaId,
            roleName: name,
            rank: 1,
            level: 1,
            experience: 0,
            attackValue: character.attackValue,
            defenceValue: character.defenceValue,
            skillPoint: 1,
            hitRate: character.hitRate,
            dodgeRate: character.dodgeRate,
            walkSpeed: character.walkSpeed,
            attackSpeed: character.attackSpeed,
            equipments: {},
            bag: null
        }
        logger.debug('create player success: %o', player);
        this.utils.invokeCallback(cb, null, player);
    });
}

/**
 * query player record by name
 * @param {String} name
 */
PlayerDao.prototype.getPlayerByName = function(name, cb) {
    let sql = 'select * from Player where name = ? limit 1';
    let args = [name];
    let self = this;
    pomelo.app.get('dbClient').query(sql, args, function(err, res) {
        if (!!err) {
            logger.error('getPlayerByName error: %j', err.message);
            self.utils.invokeCallback(cb, err.message, null);
            return;
        }

        if (!res || res.length <= 0) {
            self.utils.invokeCallback(cb, null, null);
        }

        let player = bearcat.getBean('player', res[0]);
        logger.debug('player is %j', player)
        self.utils.invokeCallback(cb, null, player);
    })
};

/**
 * Get all the information of a player, include equipments, bag, skills, tasks.
 * @param {String} playerId
 * @param {function} cb
 */
PlayerDao.prototype.getPlayerAllInfo = function(playerId, cb) {
    let self = this;
    async.parallel([
        // get player info
        function(callback) {
            self.getPlayer(playerId, player, callback);
        },
        // get equipmemts
        function(callback) {
            self.equipmentsDao.getEquipmentsByPlayerId(playerId, callback);
        },
        // get bag
        function(callback) {
            self.bagDao.getBagByPlayerId(playerId, callback);
        },
        // get fightskills
        function(callback) {
            self.fightskillDao.getFightSkillsByPlayerId(playerId, callback);
        },
        // get tasks
        function(callback) {
            self.taskDao.getTasksByPlayerId(playerId, callback);
        }
    ], function(err, results) {
        let player = results[0];
        let equipments = results[1];
        let bag = results[2];
        let fightskills = results[3];
        let tasks = results[4];

        player.bag = bag;
        player.setEquipments(equipments);
        player.addFightSkills(fightskills);
        player.curTasks = tasks || {};

        if (!!err) {
            utils.invokeCallback(cb, err);
        }  else {
            utils.invokeCallback(cb, null, player);
        }
    })
};