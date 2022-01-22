/*
	Next-Gen Events

	Copyright (c) 2015 - 2021 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;



function Proxy() {
	this.localServices = {} ;
	this.remoteServices = {} ;
	this.nextAckId = 1 ;
}

module.exports = Proxy ;

var NextGenEvents = require( './NextGenEvents.js' ) ;
var MESSAGE_TYPE = 'NextGenEvents/message' ;

function noop() {}



// Backward compatibility
Proxy.create = ( ... args ) => new Proxy( ... args ) ;



// Add a local service accessible remotely
Proxy.prototype.addLocalService = function( id , emitter , options ) {
	this.localServices[ id ] = LocalService.create( this , id , emitter , options ) ;
	return this.localServices[ id ] ;
} ;



// Add a remote service accessible locally
Proxy.prototype.addRemoteService = function( id ) {
	this.remoteServices[ id ] = RemoteService.create( this , id ) ;
	return this.remoteServices[ id ] ;
} ;



// Destroy the proxy
Proxy.prototype.destroy = function() {
	Object.keys( this.localServices ).forEach( ( id ) => {
		this.localServices[ id ].destroy() ;
		delete this.localServices[ id ] ;
	} ) ;

	Object.keys( this.remoteServices ).forEach( ( id ) => {
		this.remoteServices[ id ].destroy() ;
		delete this.remoteServices[ id ] ;
	} ) ;

	this.receive = this.send = noop ;
} ;



// Push an event message.
Proxy.prototype.push = function( message ) {
	if (
		message.__type !== MESSAGE_TYPE ||
		! message.service || typeof message.service !== 'string' ||
		! message.event || typeof message.event !== 'string' ||
		! message.method
	) {
		return ;
	}

	switch ( message.method ) {
		// Those methods target a remote service
		case 'event' :
			return this.remoteServices[ message.service ] && this.remoteServices[ message.service ].receiveEvent( message ) ;
		case 'ackEmit' :
			return this.remoteServices[ message.service ] && this.remoteServices[ message.service ].receiveAckEmit( message ) ;

		// Those methods target a local service
		case 'emit' :
			return this.localServices[ message.service ] && this.localServices[ message.service ].receiveEmit( message ) ;
		case 'listen' :
			return this.localServices[ message.service ] && this.localServices[ message.service ].receiveListen( message ) ;
		case 'ignore' :
			return this.localServices[ message.service ] && this.localServices[ message.service ].receiveIgnore( message ) ;
		case 'ackEvent' :
			return this.localServices[ message.service ] && this.localServices[ message.service ].receiveAckEvent( message ) ;

		default :
			return ;
	}
} ;



// This is the method to receive and decode data from the other side of the communication channel, most of time another proxy.
// In most case, this should be overwritten.
Proxy.prototype.receive = function( raw ) {
	this.push( raw ) ;
} ;



// This is the method used to send data to the other side of the communication channel, most of time another proxy.
// This MUST be overwritten in any case.
Proxy.prototype.send = function() {
	throw new Error( 'The send() method of the Proxy MUST be extended/overwritten' ) ;
} ;



/* Local Service */



function LocalService( proxy , id , emitter , options ) { return LocalService.create( proxy , id , emitter , options ) ; }
Proxy.LocalService = LocalService ;



LocalService.create = function( proxy , id , emitter , options ) {
	var self = Object.create( LocalService.prototype , {
		proxy: { value: proxy , enumerable: true } ,
		id: { value: id , enumerable: true } ,
		emitter: { value: emitter , writable: true , enumerable: true } ,
		internalEvents: { value: Object.create( NextGenEvents.prototype ) , writable: true , enumerable: true } ,
		events: { value: {} , enumerable: true } ,
		canListen: { value: !! options.listen , writable: true , enumerable: true } ,
		canEmit: { value: !! options.emit , writable: true , enumerable: true } ,
		canAck: { value: !! options.ack , writable: true , enumerable: true } ,
		canRpc: { value: !! options.rpc , writable: true , enumerable: true } ,
		destroyed: { value: false , writable: true , enumerable: true }
	} ) ;

	return self ;
} ;



// Destroy a service
LocalService.prototype.destroy = function() {
	Object.keys( this.events ).forEach( ( eventName ) => {
		this.emitter.off( eventName , this.events[ eventName ] ) ;
		delete this.events[ eventName ] ;
	} ) ;

	this.emitter = null ;
	this.destroyed = true ;
} ;



// Remote want to emit on the local service
LocalService.prototype.receiveEmit = function( message ) {
	if ( this.destroyed || ! this.canEmit || ( message.ack && ! this.canAck ) ) { return ; }

	var event = {
		emitter: this.emitter ,
		name: message.event ,
		args: message.args || []
	} ;

	if ( message.ack ) {
		event.callback = ( interruption ) => {

			this.proxy.send( {
				__type: MESSAGE_TYPE ,
				service: this.id ,
				method: 'ackEmit' ,
				ack: message.ack ,
				event: message.event ,
				interruption: interruption
			} ) ;
		} ;
	}

	NextGenEvents.emitEvent( event ) ;
} ;



// Remote want to listen to an event of the local service
LocalService.prototype.receiveListen = function( message ) {
	if ( this.destroyed || ! this.canListen || ( message.ack && ! this.canAck ) ) { return ; }

	if ( message.ack ) {
		if ( this.events[ message.event ] ) {
			if ( this.events[ message.event ].ack ) { return ; }

			// There is already an event, but not featuring ack, remove that listener now
			this.emitter.off( message.event , this.events[ message.event ] ) ;
		}

		this.events[ message.event ] = LocalService.forwardWithAck.bind( this ) ;
		this.events[ message.event ].ack = true ;
		this.emitter.on( message.event , this.events[ message.event ] , { eventObject: true , async: true } ) ;
	}
	else {
		if ( this.events[ message.event ] ) {
			if ( ! this.events[ message.event ].ack ) { return ; }

			// Remote want to downgrade:
			// there is already an event, but featuring ack so we remove that listener now
			this.emitter.off( message.event , this.events[ message.event ] ) ;
		}

		this.events[ message.event ] = LocalService.forward.bind( this ) ;
		this.events[ message.event ].ack = false ;
		this.emitter.on( message.event , this.events[ message.event ] , { eventObject: true } ) ;
	}
} ;



// Remote do not want to listen to that event of the local service anymore
LocalService.prototype.receiveIgnore = function( message ) {
	if ( this.destroyed || ! this.canListen ) { return ; }

	if ( ! this.events[ message.event ] ) { return ; }

	this.emitter.off( message.event , this.events[ message.event ] ) ;
	this.events[ message.event ] = null ;
} ;



//
LocalService.prototype.receiveAckEvent = function( message ) {
	if (
		this.destroyed || ! this.canListen || ! this.canAck || ! message.ack ||
		! this.events[ message.event ] || ! this.events[ message.event ].ack
	) {
		return ;
	}

	this.internalEvents.emit( 'ack' , message ) ;
} ;



// Send an event from the local service to remote
LocalService.forward = function( event ) {
	if ( this.destroyed ) { return ; }

	this.proxy.send( {
		__type: MESSAGE_TYPE ,
		service: this.id ,
		method: 'event' ,
		event: event.name ,
		args: event.args
	} ) ;
} ;

LocalService.forward.ack = false ;



// Send an event from the local service to remote, with ACK
LocalService.forwardWithAck = function( event , callback ) {
	if ( this.destroyed ) { return ; }

	if ( ! event.callback ) {
		// There is no emit callback, no need to ack this one
		this.proxy.send( {
			__type: MESSAGE_TYPE ,
			service: this.id ,
			method: 'event' ,
			event: event.name ,
			args: event.args
		} ) ;

		callback() ;
		return ;
	}

	var triggered = false ;
	var ackId = this.proxy.nextAckId ++ ;

	var onAck = ( message ) => {
		if ( triggered || message.ack !== ackId ) { return ; }	// Not our ack...
		//if ( message.event !== event ) { return ; }	// Do we care?
		triggered = true ;
		this.internalEvents.off( 'ack' , onAck ) ;
		callback() ;
	} ;

	this.internalEvents.on( 'ack' , onAck ) ;

	this.proxy.send( {
		__type: MESSAGE_TYPE ,
		service: this.id ,
		method: 'event' ,
		event: event.name ,
		ack: ackId ,
		args: event.args
	} ) ;
} ;

LocalService.forwardWithAck.ack = true ;



/* Remote Service */



function RemoteService( proxy , id ) { return RemoteService.create( proxy , id ) ; }
//RemoteService.prototype = Object.create( NextGenEvents.prototype ) ;
//RemoteService.prototype.constructor = RemoteService ;
Proxy.RemoteService = RemoteService ;



var EVENT_NO_ACK = 1 ;
var EVENT_ACK = 2 ;



RemoteService.create = function( proxy , id ) {
	var self = Object.create( RemoteService.prototype , {
		proxy: { value: proxy , enumerable: true } ,
		id: { value: id , enumerable: true } ,
		// This is the emitter where everything is routed to
		emitter: { value: Object.create( NextGenEvents.prototype ) , writable: true , enumerable: true } ,
		internalEvents: { value: Object.create( NextGenEvents.prototype ) , writable: true , enumerable: true } ,
		events: { value: {} , enumerable: true } ,
		destroyed: { value: false , writable: true , enumerable: true }

		/*	Useless for instance, unless some kind of service capabilities discovery mechanism exists
		canListen: { value: !! options.listen , writable: true , enumerable: true } ,
		canEmit: { value: !! options.emit , writable: true , enumerable: true } ,
		canAck: { value: !! options.ack , writable: true , enumerable: true } ,
		canRpc: { value: !! options.rpc , writable: true , enumerable: true } ,
		*/
	} ) ;

	return self ;
} ;



// Destroy a service
RemoteService.prototype.destroy = function() {
	this.emitter.removeAllListeners() ;
	this.emitter = null ;
	Object.keys( this.events ).forEach( ( eventName ) => { delete this.events[ eventName ] ; } ) ;
	this.destroyed = true ;
} ;



// Local code want to emit to remote service
RemoteService.prototype.emit = function( eventName , ... args ) {
	if ( this.destroyed ) { return ; }

	var callback , ackId , triggered ;

	if ( typeof eventName === 'number' ) { throw new TypeError( 'Cannot emit with a nice value on a remote service' ) ; }

	if ( typeof args[ args.length - 1 ] !== 'function' ) {
		this.proxy.send( {
			__type: MESSAGE_TYPE ,
			service: this.id ,
			method: 'emit' ,
			event: eventName ,
			args: args
		} ) ;

		return ;
	}

	callback = args.pop() ;
	ackId = this.proxy.nextAckId ++ ;
	triggered = false ;

	var onAck = ( message ) => {
		if ( triggered || message.ack !== ackId ) { return ; }	// Not our ack...
		//if ( message.event !== event ) { return ; }	// Do we care?
		triggered = true ;
		this.internalEvents.off( 'ack' , onAck ) ;
		callback( message.interruption ) ;
	} ;

	this.internalEvents.on( 'ack' , onAck ) ;

	this.proxy.send( {
		__type: MESSAGE_TYPE ,
		service: this.id ,
		method: 'emit' ,
		ack: ackId ,
		event: eventName ,
		args: args
	} ) ;
} ;



// Local code want to listen to an event of remote service
RemoteService.prototype.addListener = function( eventName , fn , options ) {
	if ( this.destroyed ) { return ; }

	// Manage arguments the same way NextGenEvents#addListener() does
	if ( typeof fn !== 'function' ) { options = fn ; fn = undefined ; }
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	options.fn = fn || options.fn ;

	this.emitter.addListener( eventName , options ) ;

	// No event was added...
	if ( ! this.emitter.__ngev.listeners[ eventName ] || ! this.emitter.__ngev.listeners[ eventName ].length ) { return ; }

	// If the event is successfully listened to and was not remotely listened...
	if ( options.async && this.events[ eventName ] !== EVENT_ACK ) {
		// We need to listen to or upgrade this event
		this.events[ eventName ] = EVENT_ACK ;

		this.proxy.send( {
			__type: MESSAGE_TYPE ,
			service: this.id ,
			method: 'listen' ,
			ack: true ,
			event: eventName
		} ) ;
	}
	else if ( ! options.async && ! this.events[ eventName ] ) {
		// We need to listen to this event
		this.events[ eventName ] = EVENT_NO_ACK ;

		this.proxy.send( {
			__type: MESSAGE_TYPE ,
			service: this.id ,
			method: 'listen' ,
			event: eventName
		} ) ;
	}
} ;

RemoteService.prototype.on = RemoteService.prototype.addListener ;

// This is a shortcut to this.addListener()
RemoteService.prototype.once = NextGenEvents.prototype.once ;



// Local code want to ignore an event of remote service
RemoteService.prototype.removeListener = function( eventName , id ) {
	if ( this.destroyed ) { return ; }

	this.emitter.removeListener( eventName , id ) ;

	// If no more listener are locally tied to with event and the event was remotely listened...
	if (
		( ! this.emitter.__ngev.listeners[ eventName ] || ! this.emitter.__ngev.listeners[ eventName ].length ) &&
		this.events[ eventName ]
	) {
		this.events[ eventName ] = 0 ;

		this.proxy.send( {
			__type: MESSAGE_TYPE ,
			service: this.id ,
			method: 'ignore' ,
			event: eventName
		} ) ;
	}
} ;

RemoteService.prototype.off = RemoteService.prototype.removeListener ;



// A remote service sent an event we are listening to, emit on the service representing the remote
RemoteService.prototype.receiveEvent = function( message ) {
	if ( this.destroyed || ! this.events[ message.event ] ) { return ; }

	var event = {
		emitter: this.emitter ,
		name: message.event ,
		args: message.args || []
	} ;

	if ( message.ack ) {
		event.callback = () => {

			this.proxy.send( {
				__type: MESSAGE_TYPE ,
				service: this.id ,
				method: 'ackEvent' ,
				ack: message.ack ,
				event: message.event
			} ) ;
		} ;
	}

	NextGenEvents.emitEvent( event ) ;

	var eventName = event.name ;

	// Here we should catch if the event is still listened to ('once' type listeners)
	//if ( this.events[ eventName ]	) // not needed, already checked at the begining of the function
	if ( ! this.emitter.__ngev.listeners[ eventName ] || ! this.emitter.__ngev.listeners[ eventName ].length ) {
		this.events[ eventName ] = 0 ;

		this.proxy.send( {
			__type: MESSAGE_TYPE ,
			service: this.id ,
			method: 'ignore' ,
			event: eventName
		} ) ;
	}
} ;



//
RemoteService.prototype.receiveAckEmit = function( message ) {
	if ( this.destroyed || ! message.ack || this.events[ message.event ] !== EVENT_ACK ) {
		return ;
	}

	this.internalEvents.emit( 'ack' , message ) ;
} ;

