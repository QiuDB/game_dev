const logger = require('pomelo-logger').getLogger('pomelo', __filename);

let CharacterEvent = function() {};


CharacterEvent.prototype.addEventForCharacter = function(character) {
    /**
     * move Event handler
     */
    character.on('move', function(args) {
        logger.debug('catch character move Event:\n %o', args);
    });

	/**
	 * Attack event handler, the event handler will handle the attack result
	 */
    character.on('attack', function(args) {
        logger.debug('catch character attack event:\n %o', args);
    });
}