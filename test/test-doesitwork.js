var assert = require('assert'),
    events = require('events'),
    eventcenter = require('../index.js');

var e = new events.EventEmitter();

var events                  = [], 
    events_emitted          = [], 
    events_handled          = [], 
    center_events_handled   = [];

var i;

/*
 * Creating a bunch of random events
 */
for(i = 0; i < 100; i++ ){
    events.push( 'test_'+i );
}

events.forEach(function(eventName, i){
    e.on(eventName, function(){
        events_handled.push(eventName);
    });
});

/*
 * Watch the events with the eventcenter
 */
assert.doesNotThrow( function() { 
    eventcenter.watch(e);
}, "The eventcenter should accept an EventEmitter instance as watch parameter");


eventcenter.on('event', function(eventName){
        center_events_handled.push(eventName);
});


/*
 * Emit the events one by one
 */
events.forEach(function(eventName, i){
    e.emit(eventName);
    events_emitted.push(eventName);
});


process.on('exit', function() {

    assert.deepEqual(events, events_emitted, 
                     'We should have emitted all events');
    assert.deepEqual(events_emitted, events_handled, 
                     'The standard handler should have handled all the events');
    assert.deepEqual(events_handled, center_events_handled,
                     'The EventCenter should have handled all the events');

});


