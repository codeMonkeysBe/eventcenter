'use strict';

var util    = require("util"),
    events  = require("events");


/*
 * The eventcenter listens to all events an attached object emits
 * When an event occures, the evententer will emit the "event" event.
 */
function EventCenter( options ) {

    /*
     * Force construction with the new operator
     */
    if (!(this instanceof EventCenter)) {
        return new EventCenter( options );
    }

    /*
     * Call events.EventEmitter constructor on the local scope 
     * (we inherit from events.EventEmitter)
     */
    events.EventEmitter.call(this);

    this.stats = [];
    this._eventEmitters = [];

}

/*
 * EventCenter inherits the events.EventEmitter prototype
 */
util.inherits(EventCenter, events.EventEmitter); 

/*
 * Listen to all events an EventEmitter instance emits.
 */
EventCenter.prototype.watch = function( eventEmitter ){
    
    var that = this;
    var emitterId ;

    /*
     * If we aren't receiving an EventEmitter we emit an error
     */
    if ( !(eventEmitter instanceof events.EventEmitter ) ) {

        throw new Error("Expected instanceof events.EventEmitter") ;

    }

    /*
     * Add the EventEmitter to our local list of listened too event emitters
     */
    emitterId = that._add( eventEmitter ).id;

    /*
     * We added our emitter to our emitter list.
     * Next, we listen to all events the emitter can emit
     */
    if( emitterId ){
        that._listenTo( eventEmitter, emitterId );
    }

    /*
     * Chain us baby
     */
    return that;

};


EventCenter.prototype._add = function( eventEmitter ){

    var that = this;

    /*
     * Have we added this eventEmitter before ?
     */
    var isNotAddedBefore = that._eventEmitters.every( function( e ){
        return e !== eventEmitter ;
    });

    if ( isNotAddedBefore ){
        return { id: that._eventEmitters.push( eventEmitter ) };
    }

    throw new Error("Emitter already added") ;
    
};

EventCenter.prototype._listenTo = function( eventEmitter, emitterId ){

    var that = this;
    var availableEvents, eventName; 

    /*
     * Start listening to events this emitter might emit.
     */
    availableEvents = eventEmitter._events;

    /*
     * Loop over availableEvents and start listening to them
     */
    for (eventName in availableEvents) {

        if (!availableEvents.hasOwnProperty(eventName)) {
            continue;
        }

        /*
         * When an event is fired by the emitter, 
         * report back with an "event" event.
         */
        eventEmitter.on(eventName, function(eventName, emitterId){

            return function(){
                that.emit("event", eventName, emitterId);
            };

        }(eventName, emitterId));

    }


}

module.exports = new EventCenter();