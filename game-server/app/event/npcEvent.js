const logger = require('pomelo-logger').getLogger('pomelo', __filename);

/**
 * Handler npc event
 */
let NpcEvent = function() {};

NpcEvent.prototype.addEventForNpc = function(npc) {
    /**Handle npc talk event */
    npc.on('npcTalk', function(data) {
        logger.debug('catch npcTalk event:\n %o', data);
    });
};

module.exports = {
    id: 'npcEvent',
    func: NpcEvent
}