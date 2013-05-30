var assert = require('assert'),
    events = require('events'),
    eventcenter = require('../index.js');

var e = new events.EventEmitter();

assert.throws( function() { 
    eventcenter.watch('notaneventemitter');
}, "It is not allowed to accept anything other than an EventEmitter instance");

assert.throws( function() { 
    eventcenter.watch(e);
    eventcenter.watch(e);
}, "It is not allowed to listen to the same EventEmitter twice");


