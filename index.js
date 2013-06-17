'use strict';

var util    = require("util"),
    events  = require("events");


/*
 * The eventcenter listens to all events an attached object emits
 * When an event occures, the evententer will emit the "event" event.
 */
function EventCenter( options ) {

    var that = this;

    /*
     * Force construction with the new operator
     */
    if (!(that instanceof EventCenter)) {
        return new EventCenter( options );
    }

    /*
     * Preparing closures for use
     */
    that._constructClosures();

    /*
     * Call events.EventEmitter constructor on the local scope 
     * (we inherit from events.EventEmitter)
     */
    events.EventEmitter.call(that);

    /*
     * Holds a collection of eventEmitters we are subscribed to
     */
    that._eventEmitters = [];

}

/*
 * EventCenter inherits the events.EventEmitter prototype
 */
util.inherits(EventCenter, events.EventEmitter); 

/*
 * Listen to all events an EventEmitter instance emits.
 */
EventCenter.prototype.connect = function( eventEmitter, eventsArray, namespace ){
    
    var that = this;
    var emitterId ;

    if ( !(eventEmitter instanceof events.EventEmitter ) ) {
        throw new Error( "Expected first argument to be instanceof events.EventEmitter") ;
    }
    
    if ( !(eventsArray instanceof Array ) ) {
        throw new Error( "Expected second argument to be instanceof Array") ;
    }

    namespace = that._prepareNamespaceForUse(namespace);

    emitterId = that._addToNamespace( eventEmitter, namespace ).id;

    /*
     * We added our emitter to our emitter list.
     * Next, we listen to all events the emitter can emit
     */
    if( emitterId ){
        that._listenTo( eventEmitter, namespace, emitterId, eventsArray );
    }

    /*
     * Chain us baby
     */
    return that;

};

/*
 * Checks if a namespace exists, if not creates the namespace
 */
EventCenter.prototype._prepareNamespaceForUse = function(namespace){

    var that = this;

    namespace = namespace || 'default';

    /*
     * Does the namespace already exits?
     */
    if( that._eventEmitters[namespace] === undefined ){
        that._eventEmitters[namespace] = [];
    }

    return namespace;

};


/*
 * Adds an event emitter to a given namespace
 * Throws an error when we are already listening to the eventEmitter in the given namespace
 */
EventCenter.prototype._addToNamespace = function( eventEmitter, namespace ){

    var that = this;

    /*
     * Have we subscribed to this eventEmitter before ?
     */
    var isNotAddedBefore = that._eventEmitters[namespace].every( function( e ){
        return e !== eventEmitter ;
    });

    if ( isNotAddedBefore ){
        return { id: that._eventEmitters[namespace].push( eventEmitter ) };
    }

    throw new Error("Emitter already added in namespace") ;
    
};


EventCenter.prototype._listenTo = function( eventEmitter, namespace, emitterId, eventsArray ){

    var that = this;
    var eventName; 

    /*
     * Loop over eventsArray and start listening to them
     */
    eventsArray.forEach(function(eventName){

        /*
         * When an event is fired by the emitter, 
         * report back with an "event" event.
         */
        eventEmitter.on( 
                        eventName, 
                        that.emitEventEvent(eventName, namespace, emitterId) 
                       );

    });

};


EventCenter.prototype._constructClosures = function( ) {

    var that = this;

    /*
     * Will be executed on every event we encounter
     */
    that.emitEventEvent = function(eventName, namespace, emitterId){
        return function(){
            var emitObject = {
                event       :   eventName,  // The name of this event
                namespace   :   namespace,  // The namespace given when this eventEmitter was connected
                emitter     :   emitterId,  // The internal id of this emitter in the eventcenter
                data        :   arguments   // The arguments the event emitter passes to the closure
            };
            that.emit( "event",      emitObject );
            that.emit( namespace,    emitObject );
        };
    };

};

/*
 * EXPORTS
 */

module.exports = new EventCenter();

