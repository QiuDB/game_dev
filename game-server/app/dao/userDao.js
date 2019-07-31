const pomelo = require('pomelo');

let UserDao = function() {
    this.utils = null;
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

        self.utils.invokeCallback(cb, null, {
            id: res.insertId,
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
    }]
}