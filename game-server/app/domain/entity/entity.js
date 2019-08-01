
const EventEmitter = require('events').EventEmitter;
const util = require('util');

let id = 1;

/**
 * Initialize a new 'Entity' with the given 'opts'.
 * Entity inherits EventEmitter
 *
 * @param {Object} opts
 * @api public
 */
let Entity = function(opts) {
    EventEmitter.call(this);
    this.entityId = id++;
    this.kindId = parseInt(opts.kindId);
    this.kindName = opts.kindName;
    this.englishName = opts.englishName;
    this.type = opts.type;
    this.x = opts.x;
    this.y = opts.y;

    this.areaId = parseInt(opts.areaId || 1);
    this.area = opts.area;
};

util.inherits(Entity, EventEmitter);

/**
 * Get entityId
 *
 * @return {Number}
 * @api public
 */
Entity.prototype.getEntityId = function() {
    return this.entityId;
};

/**
 * Get state
 *
 * @return {Object}
 * @api public
 */
Entity.prototype.getState = function() {
    return {x: this.x, y: this.y};
};

/**
 * Set positon of this entityId
 *
 * @param {Number} x
 * @param {Number} y
 * @api public
 */
Entity.prototype.setPosition = function(x, y) {
    this.x = x;
    this.y = y;
};

module.exports = {
    id: 'entity',
    func: Entity,
    scope: 'prototype',
    abstract: true
}