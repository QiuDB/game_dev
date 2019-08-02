const bearcat = require('bearcat');
const Consts = require('../../consts/consts');
const logger = require('pomelo-logger').getLogger('pomelo', __filename);

let Team = function(teamId) {
    this.teamId = teamId;
};

Team.prototype.init = function() {

};

module.exports = {
    id: 'team',
    func: Team,
    scope: 'prototype',
    init: 'init',
    args: [{
        name: 'teamId',
        type: 'Number'
    }]
}