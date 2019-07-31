const crypto = require('crypto');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);
/**
 * 参考资料：
 * https://itbilu.com/nodejs/core/EJOj6hBY.html
 * https://itbilu.com/nodejs/core/4ySMqlUF.html
 */

let Token = function() {

};

/**
 * Create token by uid. Encrypt uid and timestamp to get a token.
 *
 * @param  {String} uid user id
 * @param  {String|Number} timestamp
 * @param  {String} pwd encrypt password
 * @return {String}     token string
 */
Token.prototype.create = function(uid, timestamp, pwd) {
    let msg = uid + '|' + timestamp;
    let cipher = crypto.createCipher('aes256', pwd);
    let enc = cipher.update(msg, 'utf8', 'hex');
    enc += cipher.final('hex');
    return enc;
};

/**
 * Parse token to validate it and get the uid and timestamp.
 *
 * @param  {String} token token string
 * @param  {String} pwd   decrypt password
 * @return {Object}  uid and timestamp that exported from token. null for illegal token.
 */
Token.prototype.parse = function(token, pwd) {
    let decipher = crypto.createDecipher('aes256', pwd);
    let dec;
    try {
        dec = decipher.update(token, 'hex', 'utf8');
        dec += decipher.final('utf8');
    } catch (err) {
        logger.error('[token] fail to decrypt token: %j', token);
        return null;
    }

    let ts = dec.split('|');
    if (ts.length !== 2) {
        return null;
    }

    return {uid: ts[0], timestamp: parseInt(ts[1], 10)};
};

module.exports = {
    id: 'token',
    func: Token
}