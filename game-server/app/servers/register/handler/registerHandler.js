const bearcat = require('bearcat');
const Code = require('../../../../../shared/code');

let RegisterHandler = function(app) {
    this.app = app;
    this.utils = null;
};

module.exports = function(app) {
    return bearcat.getBean({
        id: 'registerHandler',
        func: RegisterHandler,
        args: [{
            name: 'app',
            value: app
        }],
        props: [{
            name: 'utils',
            ref: 'utils'
        }]
    })
};

RegisterHandler.prototype.login = function(msg, session, next) {
    let name = msg.name, password = msg.password;
    if (!name || !password) {
        next(null, {code: Code.FAIL, message: 'invalid name or passowrd'});
        return;
    }

    this.app.get('dbClient').getUserByName(name, password, next);
};

RegisterHandler.prototype.register = function(msg, session, next) {
    let name = msg.name, passowrd = msg.passowrd;
    if (!name || !passowrd) {
        next(null, {code: Code.FAIL, message: 'invalid name or password'});
        return;
    }

    this.app.get('dbClient').createUser(name, passowrd, next);
};
