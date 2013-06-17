# eventcenter 
## How to use
```js
var events      = require('events'),
    eventcenter = require('eventcenter');

// Some emitter
var e = new events.EventEmitter();

// When a hello event fires
e.on('hello', function(){
    console.log('hello event emitted');
});

// When a world event fires
e.on('world', function(){
    console.log('world event emitted');
});

eventcenter.connect(e, ['world', 'hello'] );

// Whenever an event fires (any event)
eventcenter.on('event', function( e ){
    console.log('The eventcenter reports on the event: ' + e.event, e.data);
});


e.emit('hello');
e.emit('world');
```

## API

### eventcenter.connect( eventEmitter, eventsArray, namespace  )
Listens to all events an instance of EventEmitter fires, then reports on those fired events

