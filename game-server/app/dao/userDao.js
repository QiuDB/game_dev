const pomelo = require('pomelo');
const Code = require('../../../shared/code');
const authConfig = require('../../config/auth.json')

let UserDao = function() {
    this.utils = null;
    this.token = null;
};

/**
 * get user infomation by userId
 * @param {String} uid UserId
 * @param {function} cb Callback function
 */
UserDao.prototype.getUserByUid = function(uid, cb) {
    let sql = 'select * FROM User where id = ? limit 1';
    let opts = [uid];
    let self = this;
    pomelo.app.get('dbClient').query(sql, opts, function(err, res) {
        console.error('err: %o, res: %o', err, res)
        if (err) {
            self.utils.invokeCallback(cb, err.message);
            return;
        }

        if (res && res.length > 0) {
            self.utils.invokeCallback(cb, null, res[0]);
        } else {
            self.utils.invokeCallback(cb, 'user not exist');
        }
    });
};

UserDao.prototype.getUserByName = function(username, password, cb) {
    let sql = 'select * from User where name = ? and password = ? limit 1';
    let args = [username, password];
    let self = this;
    pomelo.app.get('dbClient').query(sql, args, function(err, res) {
        if (err) {
            self.utils.invokeCallback(cb, {code: Code.FAIL, message: err.message});
            return;
        }

        if (res && res.length > 0) {
            let token = self.token.create(res[0].id, Date.now(), require('../../config/auth.json').secret);
            console.error('res is %o, token is %j', res, token);
            self.utils.invokeCallback(cb, null, {
                token: token,
                uid: res.id
            });
        } else {
            self.utils.invokeCallback(cb, {code: Code.ENTRY.FA_USER_NOT_EXIST});
        }
    })
}
/**
 * Create a new user
 * @param (String) username
 * @param {String} password
 * @param {String} from Register source
 * @param {function} cb Call back function.
 */
UserDao.prototype.createUser = function(username, password, from, cb) {
    let sql = 'insert into User(name, password, `from`, loginCount, lastLoginTime) values(?,?,?,?,?)';
    let loginTime = Date.now();
    let loginCount = 1;
    let args = [username, password, from || '', loginCount, loginTime];
    let self = this;
    pomelo.app.get('dbClient').insert(sql, args, function(err, res) {
        if (err) {
            self.utils.invokeCallback(cb, {code: err.number, msg: err.message}, null);
            return;
        }

        console.error('createUser: %o', {
            id: ''+res.insertId,
            name: username,
            password: password,
            loginCount: loginCount,
            lastLoginTime: loginTime
        })
        self.utils.invokeCallback(cb, null, {
            id: ''+res.insertId, // id is string
            name: username,
            password: password,
            loginCount: loginCount,
            lastLoginTime: loginTime
        })
    })
};

module.exports = {
    id: 'userDao',
    func: UserDao,
    props: [{
        name: 'utils',
        ref: 'utils'
    }, {
        name: 'token',
        ref: 'token'
    }]
}