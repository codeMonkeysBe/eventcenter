var assert = require('assert'),
    events = require('events'),
    eventcenter = require('../index.js');

var e = new events.EventEmitter();


/*
 * Invalid parameter ( watch excpects an instanceof EventEmitter
 */
assert.throws( function() { 
    eventcenter.watch('notaneventemitter');
});

/*
 * Can't listen to the same emitter twice
 */
assert.throws( function() { 
    eventcenter.watch(e);
    eventcenter.watch(e);
});


