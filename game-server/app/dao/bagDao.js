const pomelo = require('pomelo');
let logger = require('pomelo-logger').getLogger('pomelo', __filename);

let BagDao = function () {
    this.utils = null;
};

BagDao.prototype.createBag = function(playerId, cb) {
    let sql = 'insert into Bag (playerId, items, itemCount) values (?, ?, ?)';
    let args = [playerId, '{}', 20];

    pomelo.app.get('dbClient').insert(sql, args, (err, result) => {
        if (!!err) {
            logger.error('playerId(%j) create bag for bagDao failed: %j', playerId, err.message);
            this.utils.invokeCallback(cb, err, null);
            return;
        }

        let bag = bearcat.getBean('bag', {playerId: playerId, id: result.insertId});
        return this.utils.invokeCallback(cb, null, bag);
    })
}

BagDao.prototype.getBagByPlayerId = function(playerId, cb) {
    let sql = 'select * from Bag where playerId = ? limit 1';
    let args = [playerId];

    pomelo.app.get('dbClient').query(sql, args, (err, results) => {
        if (!!err) {
            logger.error('get bag by playerId(%j) for bagDao failed: %j', playerId, err.message);
            this.utils.invokeCallback(cb, err, null);
            return;
        }

        if (!results || results.length === 0) {
            this.utils.invokeCallback(cb, null, null);
            return;
        }

        let bag = bearcat.getBean('bag', {
            id: results[0].id,
            itemCount: results[0].itemCount,
            items: JSON.parse(results[0].items)
        });
        this.utils.invokeCallback(cb, null, bag);
    });
};

BagDao.prototype.update = function(bag, cb) {
    let sql = 'update Bag set items = ? where id = ?';
    let items = bag.items;
    if (typeof items !== 'string') {
        items = JSON.stringify(items);
    }

    let args = [items, bag.id];

    pomelo.app.get('dbClient').query(sql, args, cb);
};

BagDao.prototype.destroy = function(playerId, cb) {
    let sql = 'delete from Bag where playerId = ? limit 1';
    let args = [playerId];

    pomelo.app.get('dbClient').delete(sql, args, cb);
};

module.exports = {
    id: 'bagDao',
    func: BagDao,
    props: [{
        name: 'utils',
        ref: 'utils'
    }]
}