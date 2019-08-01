const pomelo = require('pomelo');
const bearcat = require('bearcat');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);
const Consts = require('../consts/consts');

let PlayerDao = function() {
    this.utils = null;
};

module.exports = {
    id : 'playerDao',
    func: PlayerDao,
    props: [{
        name: 'utils',
        ref: 'utils'
    }]
}

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