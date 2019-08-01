const bearcat = require('bearcat');
const Code = require('../../../../../shared/code');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);

let AuthRemote = function(app) {
    this.app = app;
    this.tokenService = null;
    this.utilsService = null;
    this.userDao = null;

    const authConfig = this.app.get('authConfig');
    this.secret = authConfig.secret;
    this.expire = authConfig.expire;
};

AuthRemote.prototype.auth = function(token, cb) {
    let res = this.tokenService.parse(token, this.secret);
    logger.debug('after parse res is %o', res);
    if (!res) {
        this.utilsService.invokeCallback(cb, null, Code.ENTRY.FA_TOKEN_INVALID);
        return;
    }

    if (!this.checkExpire(res.timestamp)) {
        this.utilsService.invokeCallback(cb, null, Code.ENTRY.FA_TOKEN_EXPIRE);
        return;
    }

    logger.debug('token验证成功: %j', token)
    this.userDao.getUserByUid(res.uid, (err, user) => {
        if (!err) {
            this.utilsService.invokeCallback(cb, Code.FAIL, null);
            return;
        }

        if (!res) {
            this.utilsService.invokeCallback(cb, Code.OK, null);
            return;
        }

        this.utilsService.invokeCallback(cb, Code.OK, res);
    })
}

/**
 * Check the token whether expire.
 *
 * @param  {Number} expire expire time
 * @return {Boolean}        true for not expire and false for expire
 */
AuthRemote.prototype.checkExpire = function(expire) {
    if (this.expire < 0) {
        // negative expire mean never expire
        return true;
    }

    return (Date.now() - expire) < this.expire
};

module.exports = function(app) {
    return bearcat.getBean({
        id: 'authRemote',
        func: AuthRemote,
        args: [{
            name: 'app',
            value: app,
        }],
        props: [{
            name: 'tokenService',
            ref: 'token'
        }, {
            name: 'utilsService',
            ref: 'utils'
        }, {
            name: 'userDao',
            ref: 'userDao'
        }]
    })
}