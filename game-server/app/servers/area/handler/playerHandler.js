const bearcat = require('bearcat');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);

let PlayerHandler = function(app) {
    this.app = app;
};

module.exports = function(app) {
    return bearcat.getBean({
        id: 'playerHandler',
        func: PlayerHandler,
        args: [{
            name: 'app',
            value: app
        }]
    })
}