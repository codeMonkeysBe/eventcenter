# eventcenter

## How to use
```js
var events      = require('events'),
    eventcenter = require('eventcenter');

// Some emitter
var e = new events.EventEmitter();

// When a hello event fires
e.on('hello', function(){
    console.log('hello event fired');
});

// When a world event fires
e.on('world', function(){
    console.log('world event fired');
});

eventcenter.watch(e);

// Whenever an event fires (any event)
eventcenter.on('event', function(eventName){
    console.log('The eventcenter reports on the event: ' + eventName);
});

e.emit('hello');
e.emit('world');
```

## API

### eventcenter.watch(EventEmitter)
Listens to all events an instance of EventEmitter fires, then reports on those fired events

