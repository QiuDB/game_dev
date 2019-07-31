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

module.exports = {
    id: 'userDao',
    func: UserDao,
    props: [{
        name: 'utils',
        ref: 'utils'
    }]
}