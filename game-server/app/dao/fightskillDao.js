const bearcat = require('bearcat');
const pomelo = require('pomelo');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);
const Utils = require('../utils/utils').Utils;

let FightskillDao = function() {};

FightskillDao.prototype.add = function(skill, cb) {
    let sql = 'insert into FightSkill (playerId, skillId, level, type) values (?, ?, ?, ?)';
    let args = [skill.playerId, skill.skillId, skill.level, skill.type];

    pomelo.app.get('dbClient').insert(sql, args, (err, result) => {
        if (!!err) {
            logger.error('playerId(%j) add fightskill for FightskillDao failed: %j', skill.playerId, err.message);
            Utils.instance().invokeCallbak(cb, err, null);
            return;
        }

        skill.id = result.insertId;
        let fightskill = bearcat.getBean('fightskill', skill);
        return Utils.instance().invokeCallbak(cb, null, fightskill);
    });
};

FightskillDao.prototype.update = function(val, cb) {
    let sql = 'update FightSkill set level = ? where id = ?';
    let args = [val.level, val.id];

    pomelo.app.get('dbClient').update(sql, args, cb);
};

FightskillDao.prototype.getFighSkillsByPlayerId = function(playerId, cb) {
    let sql = 'select * from FightSkill where playerId = ?';
    let args = [playerId];

    pomelo.app.get('dbClient').query(sql, args, (err, results) => {
        if (!!err) {
            logger.error('playerId(%j) getFightSkillsByPlayer for fightskillDao failed: %j', playerId, err.message);
            Utils.instance().invokeCallbak(cb, err, null);
            return;
        }

        let fightSkills = [];
        for (let i = 0, l = results.length; i < l; i++) {
            let result = results[i];
        }
    })
};

module.exports = {
    id: 'fightskillDao',
    func: FightskillDao,
}