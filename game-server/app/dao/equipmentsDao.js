const pomelo = require('pomelo');
let logger = require('pomelo-logger').getLogger('pomelo', __filename);

let EquipmentsDao = function() {
    this.utils   = null;
    this.dataApi = null;
};

EquipmentsDao.prototype.createEquipments = function(playerId, cb) {
    let sql = 'insert into Equipments (playerId) values (?)';
    let args = [playerId];

    pomelo.app.get('dbClient').insert(sql, args, (err, result) => {
        if (err) {
            logger.error('create equipments for equipmentsDao failed: %j', err.message);
            this.utils.invokeCallback(cb, err.message, null);
            return;
        }
        let equip = bearcat.getBean('equipments', {id: result.insertId, playerId: playerId});
        this.utils.invokeCallback(cb, null, equip);
    })
};

EquipmentsDao.prototype.getEquipmentsForPlayer = function(playerId, cb) {
    let sql = 'select * from Equipments where playerId = ? limit 1';
    let args = [playerId];

    pomelo.app.get('dbClient').query(sql, args, (err, results) => {
        if (!!err) {
            logger.error('get equipments by playerId(%j) for equipmentsDao failed: %j', playerId, err.message);
            this.utils.invokeCallback(cb, err);
            return;
        }

        if (!results || results.length === 0) {
            this.utils.invokeCallback(cb, null, null);
        } else {
            let equip = bearcat.getBean('equipments', results[0]);
            this.utils.invokeCallback(cb, null, equip);
        }
    });
};

EquipmentsDao.prototype.update = function(val, cb) {
	var sql = 'update Equipments set weapon = ?, armor = ?, helmet = ?, necklace = ?, ring = ?, belt = ?, amulet = ?, legguard = ?, shoes = ?	where id = ?';
	var args = [val.weapon, val.armor, val.helmet, val.necklace, val.ring, val.belt, val.amulet, val.legguard, val.shoes, val.id];

    pomelo.app.get('dbclient').query(sql, args, cb);
};

/**
 * destroy equipment
 *
 * @param {number} playerId
 * @param {function} cb
 */
EquipmentsDao.prototype.destroy = function(playerId, cb) {
	var sql = 'delete from Equipments where playerId = ?';
	var args = [playerId];

	pomelo.app.get('dbclient').query(sql, args, cb);
};

module.exports = {
    id: 'equipmentsDao',
    func: EquipmentsDao,
    props: [{
        name: 'dataApi',
        ref: 'dataApi'
    }, {
        name: 'utils',
        ref: 'utils'
    }]
}