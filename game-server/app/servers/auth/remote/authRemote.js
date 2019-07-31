const bearcat = require('bearcat');
const Code = require('../../../../../shared/code');

let AuthRemote = function(app) {
    this.app = app;
    this.tokenService = null;

    const authConfig = this.app.get('authConfig');
    this.secret = authConfig.secret;
    this.expire = authConfig.expire;
};

AuthRemote.prototype.auth = function(token, cb) {
    let res = this.tokenService.parse(token, this.secret);
    if (!res) {
        cb(null, Code.ENTRY.FA_TOKEN_INVALID);
        return;
    }

    if (!this.checkExpire(res.expire)) {
        cb (null, Code.ENTRY.FA_TOKEN_EXPIRE);
        return;
    }

    cb(null, Code.OK, {});
}

/**
 * Check the token whether expire.
 *
 * @param  {Number} expire expire time
 * @return {Boolean}        true for not expire and false for expire
 */
AuthRemote.prototype.checkExpire = function(expire) {
    if (expire < 0) {
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
        }]
    })
}