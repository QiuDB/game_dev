const bearcat = require('bearcat');
const async = require('async');
const Code = require('../../../../../shared/code');

let Handler = function(app) {
  this.app = app;
  this.userDao = null;
};

module.exports = function(app) {
	return bearcat.getBean({
		id: 'entryHandler',
		func: Handler,
		args: [{
			name: 'app',
			value: app
		}],
		props: [{
			name: 'userDao',
			ref: 'userDao'
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
Handler.prototype.entry = function(msg, session, next) {
  let token = msg.token;
  if (!token) {
	  next(new Error('token invalid'), {code: Code.FAIL});
	  return;
  }

  let player, players;
  let self = this;
  async.waterfall([
	  function(cb) {
		  // auth token
		  self.app.rpc.authRemote.auth(session, token, function(code, user) {
			  if (code !== Code.OK) {
				next(null, {code: code});
				return;
			  }

			  if (!user) {
				next(null, {code: Code.ENTRY.FA_USER_NOT_EXIST});
				return;
			  }

			  // query player info by user id
			  let uid = user.id;

		  });
	  }
  ], function(err) {
	  if (err) {
		  next(err, {code: Code.FAIL});
		  return;
	  }
	  next(null, {code: Code.OK, player: players ? players[0] : null});
  })
};
