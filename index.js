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
EventCenter.prototype.connect = function( eventEmitter, eventsArray, namespace ){
    
    var that = this;
    var emitterId ;

    if ( !(eventEmitter instanceof events.EventEmitter ) ) {
        throw new Error(
            "Expected first argument to be instanceof events.EventEmitter"
        ) ;
    }
    
    if ( !(eventsArray instanceof Array ) ) {
        throw new Error(
            "Expected second argument to be instanceof Array"
        ) ;
    }

    namespace = this._createNamespace(namespace);

    /*
     * Add the EventEmitter to our local list of listened too event emitters
     */
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

EventCenter.prototype._createNamespace = function(namespace){

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



EventCenter.prototype._addToNamespace = function( eventEmitter, namespace ){

    var that = this;

    /*
     * Have we added this eventEmitter before ?
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
        eventEmitter.on( eventName, (function(eventName, namespace, emitterId){
                return function(){
                    that.emit("event", eventName, namespace, emitterId);
                };
            }(eventName, namespace, emitterId) )
        );

    });

};

module.exports = new EventCenter();
