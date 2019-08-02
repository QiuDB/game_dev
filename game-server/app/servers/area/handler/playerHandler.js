const bearcat = require('bearcat');
const pomelo = require('pomelo');
const Consts = require('../../../consts/consts')
const logger = require('pomelo-logger').getLogger('pomelo', __filename);

let PlayerHandler = function (app) {
    this.app = app;
    this.playerDao = null;
};

/**
 * Player enter scene, and response the related information such as
 * playerInfo, areaInfo and mapData to client.
 *
 * @param {Object} msg
 * @param {Object} session
 * @param {Function} next
 * @api public
 */
PlayerHandler.enterSence = function (msg, session, next) {
    let area = session.area;
    let playerId = session.get('playerId');
    let areaId = session.get('areaId');
    let teamId = session.get('teamId') || consts.TEAM.TEAM_ID_NONE;
    let isCaptain = session.get('isCaptain');
    let isInTeamInstance = session.get('isInTeamInstance');
    let instanceId = session.get('instanceId');

    let self = this;
    self.playerDao.getPlayerAllInfo(playerId, function (err, player) {
        if (err || !player) {
            next(new Error('fail to get player from dao'), {
                route: msg.route,
                code: Consts.MESSAGE.ERR
            });
            return;
        }

        player.serverId = session.frontendId;
        player.teamId = teamId;
        player.isCaptain = isCaptain;
        player.isInTeamInstance = isInTeamInstance;
        player.instanceId = instanceId;
        areaId = player.areaId;

        let map = area.map;
        if (!map.isReachable(player.x, player.y)) {
            let pos = map.getBornPoint();
            player.setPosition(pos.x, pos.y);
        }

        if (!area.addEntity(player)) {
            next(new Error('fail to add user into area'), {
                route: msg.route,
                code: Consts.MESSAGE.ERR
            });
            return;
        }

        if (player.teamId > Consts.TEAM.TEAM_ID_NONE) {
            // send player's new info to the manger server(team manger)
            let memberInfo = player.toJSON4TeamMember();
            memberInfo.backendServerId = pomelo.app.getServerId();
            self.app.rpc.manger.teamRemote.updateMemberInfo(session, memberInfo, null)
        }

        // add to area channel
        self.app.rpc.chat.chatRemote.add(session, session.uid, player.name, channelUtil.getAreaChannelName(areaId), null);

        let data = {
            entities: area.getAreaInfo({ x: player.x, y: player.y }, player.range),
            curPlayer: player.toJSON(),
            map: map.toJSON()
        };
        next(null, data);
    })
};

module.exports = function (app) {
    return bearcat.getBean({
        id: 'playerHandler',
        func: PlayerHandler,
        args: [{
            name: 'app',
            value: app
        }],
        props: [{
            name: 'playerDao',
            ref: 'playerDao'
        }]
    })
}