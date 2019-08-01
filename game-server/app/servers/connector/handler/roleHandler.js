const async = require('async');
const bearcat = require('bearcat');
const Consts = require('../../../consts/consts');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);

let RoleHandler = function(app) {
    this.app = app;
    this.playerDao = null;
    this.equipDao = null;
    this.bagDao = null;
};

RoleHandler.prototype.createPlayer = function(msg, session, next) {
    let uid = session.uid, name = msg.name, roleId = msg.roleId;
    if (!name || !roleId) {
        next(new Error('param invalid'));
        return;
    }

    let self = this;
    // check record by name
    self.playerDao.getPlayerByName(name, function(err, player) {
        if (!!err) {
            next(null, {code: Consts.MESSAGE.ERR});
            return;
        }

        if (!!player) {
            next(null, {code: Consts.MESSAGE.ERR});
            return;
        }

        // create new player
        self.playerDao.createPlayer(uid, name, roleId, function(err, player) {
            if (!!err) {
                logger.error('[register] fail to invoke createPlayer for ' + err.stack);
                next(null, {code: Consts.MESSAGE.ERR, error: err});
                return;
            }

            async.parallel([
                function(cb) {
                    equipDao.createEquipments(player.id, cb);
                },
                function(cb) {
                    bagDao.createBag(player.id, cb);
                },
                function(cb) {
                    player.learnSkill(1, cb);
                }
            ], function(err, results) {
                if (err) {
                    logger.error('learn skill error with player: ' + JSON.stringify(player.strip()) + ' stack' + err.stack);
                    next(null, {code: Consts.MESSAGE.ERR, error: err});
                    return;
                }
                afterLogin(self.app, msg, session, {id: uid}, player.strip(), next);
            })
        })
    })
}

let afterLogin = function(app, msg, session, user, player, next) {
    async.waterfall([
        function(cb) {
            session.bind(user.id, cb);
        },
        function(cb) {
            session.set('username', user.name);
            session.set('areaId', player.areaId);
            session.set('serverId', app.get('areaIdMap')[player.areaId]);
            session.set('playername', player.name);
            session.set('playerId', player.id);
            session.on('closed', onUserLeave);
            session.pushAll(cb);
        },
        function(cb) {
            app.rpc.chat.chatRemote.add(session, user.id, player.name, channelUtil.getGlobalChannelName(), cb);
        }
    ], function(err) {
        if (err) {
            next(null, {code: Consts.MESSAGE.ERR});
            return;
        }
        next(null, {code: Consts.MESSAGE.RES, user: user, player: player});
    })
}

var onUserLeave = function (session, reason) {
	if(!session || !session.uid) {
		return;
	}

	utils.myPrint('2 ~ OnUserLeave is running ...');
	var rpc= pomelo.app.rpc;
	rpc.area.playerRemote.playerLeave(session, {playerId: session.get('playerId'), areaId: session.get('areaId')}, null);
	rpc.chat.chatRemote.kick(session, session.uid, null);
};


module.exports = function(app) {
    return bearcat.getBean({
        id: 'roleHandler',
        func: RoleHandler,
        args: [{
            name: 'app',
            value: app
        }],
        props: [{
            name: 'playerDao',
            ref: 'playerDao'
        }, {
            name: 'equipDao',
            ref: 'equipDao'
        }, {
            name: 'bagDao',
            ref: 'bagDao'
        }]
    })
}