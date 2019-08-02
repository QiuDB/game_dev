const pomelo = require('pomelo');
const Consts = require('../consts/consts');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);


let EventManger = function() {
    this.playerEvent = null;
    this.npcEvent = null;
    this.characerEvent = null;
};

/**
 * Listen event for event
 */
EventManger.prototype.addEvent = function(entity) {
    switch (entity.type) {
        case Consts.EntityType.PLAYER:
            this.playerEvent.addEventForPlayer(entity);
            this.characerEvent.addEventForCharacter(entity);
            break;
        case Consts.EntityType.MOB:
            this.characerEvent.addEventForCharacter(entity);
            break;
        case Consts.EntityType.NPC:
            this.npcEvent.addEventForNpc(entity);
            break;
    }
};

EventManger.prototype.addSaveEvent = function(player) {
    player.on('save', function() {
        logger.debug('catch save player event');
    });

    player.bag.on('save', function() {
        logger.debug('catch save player bag event');
    });

    player.equipments.on('save', function() {
        logger.debug('catch save player equipments event');
    })
}

module.exports = {
    id: 'eventManger',
    func: EventManger,
    props: [{
        name: 'playerEvent',
        ref: 'playerEvent'
    }, {
        name: 'npcEvent',
        ref: 'npcEvent'
    }, {
        name: 'characterEvent',
        ref: 'characterEvent'
    }]
}