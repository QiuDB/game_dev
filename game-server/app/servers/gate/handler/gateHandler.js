const bearcat = require('bearcat');
const Code = require('../../../../../shared/code');

/**
 * Gate handler that dispatch user to connectors.
 */
let GateHandler = function(app) {
    this.app = app;
    this.dispatcher = null;
};

GateHandler.prototype.queryEntry = function(msg, session, next) {
    let uid = msg.uid;
    if (!uid) {
        next(null, {code: Code.FAIL});
        return;
    }

    let connectors = this.app.getServersByType('connector');
    if (!connectors || connectors.length === 0) {
        next(null, {code: Code.GATE.FA_NO_SERVER_AVAILABLE});
        return;
    }

    let res = this.dispatcher.dispatch(uid, connectors);
    next(null, {code: Code.OK, host: res.clientHost, port: res.clientPort});
}

module.exports = function(app) {
    return bearcat.getBean({
        id: 'gateHandler',
        func: GateHandler,
        args: [{
            name: 'app',
            value: app
        }],
        props: [{
            name: 'dispatcher',
            ref: 'dispatcher'
        }]
    })
}