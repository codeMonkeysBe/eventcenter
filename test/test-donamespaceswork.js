var assert = require('assert'),
    events = require('events'),
    eventcenter = require('../index.js');

var e = new events.EventEmitter();

var eventsReceived = { 
    test_namespace_1: 0,
    test_namespace_2: 0
};

var eventsToReceive = { 
    test_namespace_1: 1,
    test_namespace_2: 2
};


var eventsEmitted = [];

eventcenter.connect(e, ['event_1', 'event_2'], 'test_namespace_1');

eventcenter.connect(e, ['event_3', 'event_4'], 'test_namespace_2');

eventcenter.on('event', function(data){
    eventsReceived[data.namespace]++;
});

e.emit('event_1');
e.emit('event_3');
e.emit('event_4');

process.on('exit', function() {
    assert.deepEqual(eventsReceived, eventsToReceive, 'We should have received all events in all the right namespaces');
});



