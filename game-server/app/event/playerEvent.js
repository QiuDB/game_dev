const logger = require('pomelo-logger').getLogger('pomelo', __filename);

/**
 * Handle player event
 */
let PlayerEvent = function() {};

PlayerEvent.prototype.addEventForPlayer = function(player) {
    /**
	 * Handler upgrade event for player, the message will be pushed only to the one who upgrade
	 */
    player.on('upgrade', function() {
        logger.debug('event.onUpgrade: ' + player.level + ' id: ' + player.id);
    });

    /**
	 * Handle pick item event for player, it will invoked when player pick item success
	 */
    player.on('pickItem', function(args) {
        logger.debug('catch player pickItem event:\n%o', args);
    });
};

module.exports = {
    id: 'playerEvent',
    func: PlayerEvent
}