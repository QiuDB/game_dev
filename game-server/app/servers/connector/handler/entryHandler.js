const bearcat = require('bearcat');
const async = require('async');
const Code = require('../../../../../shared/code');

let Handler = function (app) {
	this.app = app;
	this.playerDao = null;
};

module.exports = function (app) {
	return bearcat.getBean({
		id: 'entryHandler',
		func: Handler,
		args: [{
			name: 'app',
			value: app
		}],
		props: [{
			name: 'playerDao',
			ref: 'playerDao'
		}, {
			name: 'utils',
			ref: 'utils'
		}]
	})
}

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function (msg, session, next) {
	let token = msg.token;
	if (!token) {
		next(new Error('token invalid'), { code: Code.FAIL });
		return;
	}

	let uid;
	let player, players;
	let self = this;
	async.waterfall([
		function (cb) {
			// auth token
			self.app.rpc.authRemote.auth(session, token, function (code, user) {
				if (code !== Code.OK) {
					next(null, { code: code });
					return;
				}

				if (!user) {
					next(null, { code: Code.ENTRY.FA_USER_NOT_EXIST });
					return;
				}

				cb(null, user)
			});
		},
		function (user, cb) {
			// query player info by user id
			uid = user.id;
			self.playerDao.getPlayerByUid(uid, function(err, res) {
				if (err) {
					next(new Error(err), {code: Code.FAIL});
					return;
				}

				players = res;

				cb(null);
			})
		},
		function(cb) {
			self.app.get('sessionService').kick(uid, cb);
		},
		function(cb) {
			session.bind(uid, cb);
		},
		function(cb) {
			if (!players || players.length === 0) {
				next(null, {code: Code.OK});
				return;
			}

			player = players[0];

			session.set('serverId', self.app.get('areaIdMap')[player.areaId]);
			session.set('playername', player.name);
			session.set('playerId', player.id);
			session.on('closed', onUserLeave.bind(null, self.app));
			session.pushAll(cb);
		},
		function(cb) {
			self.app.rpc.chat.chatRemote.add(session, player.userId, player.name,
				 channelUtil.getGlobalChannelName(), cb)
		}
	], function (err) {
		if (err) {
			next(err, { code: Code.FAIL });
			return;
		}
		next(null, { code: Code.OK, player: players ? players[0] : null });
	})
};

var onUserLeave = function (app, session, reason) {
	if (!session || !session.uid) {
		return;
	}

	app.rpc.playerRemote.playerLeave(session, {
		playerId: session.get('playerId'),
		instanceId: session.get('instanceId')
	}, function(err) {
		if (!!err) {
			logger.error('user leave error! %j', err);
		}
	});

	app.rpc.chatRemote.kick(session, session.uid, null);
}
