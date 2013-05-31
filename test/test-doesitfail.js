var assert = require('assert'),
    events = require('events'),
    eventcenter = require('../index.js');

var e = new events.EventEmitter();

assert.throws( function() { 
    eventcenter.connect('notaneventemitter');
}, "It is not allowed to accept anything other than an EventEmitter instance");

assert.throws( function() { 
    eventcenter.connect(e, ['testevent']);
    eventcenter.connect(e, ['testevent']);
}, "It is not allowed to listen to the same EventEmitter twice");


