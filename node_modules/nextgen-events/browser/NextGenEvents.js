(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.NextGenEvents = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
(function (process,global,setImmediate){(function (){
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



// Some features needs a portable nextTick
const nextTick = process.browser ? window.setImmediate : process.nextTick ;



if ( ! global.__NEXTGEN_EVENTS__ ) {
	global.__NEXTGEN_EVENTS__ = {
		recursions: 0
	} ;
}

var globalData = global.__NEXTGEN_EVENTS__ ;



function NextGenEvents() {}
module.exports = NextGenEvents ;
NextGenEvents.prototype.__prototypeUID__ = 'nextgen-events/NextGenEvents' ;
NextGenEvents.prototype.__prototypeVersion__ = require( '../package.json' ).version ;



/* Basic features, more or less compatible with Node.js */



NextGenEvents.SYNC = -Infinity ;
NextGenEvents.DESYNC = -1 ;

NextGenEvents.defaultMaxListeners = Infinity ;



// Not part of the prototype, because it should not pollute userland's prototype.
// It has an eventEmitter as 'this' anyway (always called using call()).
NextGenEvents.init = function() {
	Object.defineProperty( this , '__ngev' , {
		configurable: true ,
		value: new NextGenEvents.Internal()
	} ) ;
} ;



NextGenEvents.Internal = function( from ) {
	this.nice = NextGenEvents.SYNC ;
	this.interruptible = false ;
	this.contexts = {} ;
	this.desync = setImmediate ;
	this.depth = 0 ;

	// States by events
	this.states = {} ;

	// State groups by events
	this.stateGroups = {} ;

	// Listeners by events
	this.listeners = {
		// Special events
		error: [] ,
		interrupt: [] ,
		newListener: [] ,
		removeListener: []
	} ;

	this.hasListenerPriority = false ;
	this.maxListeners = NextGenEvents.defaultMaxListeners ;

	if ( from ) {
		this.nice = from.nice ;
		this.interruptible = from.interruptible ;
		Object.assign( this.states , from.states ) ,
		Object.assign( this.stateGroups , from.stateGroups ) ,

		Object.keys( from.listeners ).forEach( eventName => {
			this.listeners[ eventName ] = from.listeners[ eventName ].slice() ;
		} ) ;

		// Copy all contexts
		Object.keys( from.contexts ).forEach( contextName => {
			var context = from.contexts[ contextName ] ;
			this.contexts[ contextName ] = {
				nice: context.nice ,
				ready: true ,
				status: context.status ,
				serial: context.serial ,
				scopes: {}
			} ;
		} ) ;
	}
} ;



NextGenEvents.initFrom = function( from ) {
	if ( ! from.__ngev ) { NextGenEvents.init.call( from ) ; }

	Object.defineProperty( this , '__ngev' , {
		configurable: true ,
		value: new NextGenEvents.Internal( from.__ngev )
	} ) ;
} ;



/*
	Merge listeners of duplicated event bus:
		* listeners that are present locally but not in all foreigner are removed (one of the foreigner has removed it)
		* listeners that are not present locally but present in at least one foreigner are copied

	Not sure if it will ever go public, it was a very specific use-case (Spellcast).
*/
NextGenEvents.mergeListeners = function( foreigners ) {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }

	// Backup the current listeners...
	var oldListeners = this.__ngev.listeners ;


	// Reset listeners...
	this.__ngev.listeners = {} ;

	Object.keys( oldListeners ).forEach( eventName => {
		this.__ngev.listeners[ eventName ] = [] ;
	} ) ;

	foreigners.forEach( foreigner => {
		if ( ! foreigner.__ngev ) { NextGenEvents.init.call( foreigner ) ; }

		Object.keys( foreigner.__ngev.listeners ).forEach( eventName => {
			if ( ! this.__ngev.listeners[ eventName ] ) { this.__ngev.listeners[ eventName ] = [] ; }
		} ) ;
	} ) ;


	// Now we can scan by eventName first
	Object.keys( this.__ngev.listeners ).forEach( eventName => {
		var i , iMax , blacklist = [] ;

		// First pass: find all removed listeners and add them to the blacklist
		if ( oldListeners[ eventName ] ) {
			oldListeners[ eventName ].forEach( listener => {
				for ( i = 0 , iMax = foreigners.length ; i < iMax ; i ++ ) {
					if (
						! foreigners[ i ].__ngev.listeners[ eventName ] ||
						foreigners[ i ].__ngev.listeners[ eventName ].indexOf( listener ) === -1
					) {
						blacklist.push( listener ) ;
						break ;
					}
				}
			} ) ;
		}

		// Second pass: add all listeners still not present and that are not blacklisted
		foreigners.forEach( foreigner => {

			foreigner.__ngev.listeners[ eventName ].forEach( listener => {
				if ( this.__ngev.listeners[ eventName ].indexOf( listener ) === -1 && blacklist.indexOf( listener ) === -1 ) {
					this.__ngev.listeners[ eventName ].push( listener ) ;
				}
			} ) ;
		} ) ;
	} ) ;
} ;



// Use it with .bind()
NextGenEvents.filterOutCallback = function( what , currentElement ) { return what !== currentElement ; } ;



// .addListener( eventName , [fn] , [options] )
NextGenEvents.prototype.addListener = function( eventName , fn , options ) {
	var listener , newListenerListeners ;

	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! this.__ngev.listeners[ eventName ] ) { this.__ngev.listeners[ eventName ] = [] ; }

	// Argument management
	if ( ! eventName || typeof eventName !== 'string' ) {
		throw new TypeError( ".addListener(): argument #0 should be a non-empty string" ) ;
	}

	if ( typeof fn === 'function' ) {
		listener = {} ;

		if ( ! options || typeof options !== 'object' ) { options = {} ; }
	}
	else if ( options === true && fn && typeof fn === 'object' ) {
		// We want to use the current object as the listener object (used by Spellcast's serializer)
		options = listener = fn ;
		fn = undefined ;
	}
	else {
		options = fn ;

		if ( ! options || typeof options !== 'object' ) {
			throw new TypeError( ".addListener(): a function or an object with a 'fn' property which value is a function should be provided" ) ;
		}

		fn = undefined ;
		listener = {} ;
	}


	listener.fn = fn || options.fn ;
	listener.id = options.id !== undefined ? options.id : listener.fn ;

	if ( options.unique ) {
		if ( this.__ngev.listeners[ eventName ].find( e => e.id === listener.id ) ) {
			// Not unique! Return now!
			return ;
		}
	}

	listener.once = !! options.once ;
	listener.async = !! options.async ;
	listener.eventObject = !! options.eventObject ;
	listener.nice = options.nice !== undefined ? Math.floor( options.nice ) : NextGenEvents.SYNC ;
	listener.priority = + options.priority || 0 ;
	listener.context = options.context && ( typeof options.context === 'string' || typeof options.context === 'object' ) ? options.context : null ;

	if ( typeof listener.fn !== 'function' ) {
		throw new TypeError( ".addListener(): a function or an object with a 'fn' property which value is a function should be provided" ) ;
	}

	// Implicit context creation
	if ( typeof listener.context === 'string' ) {
		listener.context = this.__ngev.contexts[ listener.context ] || this.addListenerContext( listener.context ) ;
	}

	// Note: 'newListener' and 'removeListener' event return an array of listener, but not the event name.
	// So the event's name can be retrieved in the listener itself.
	listener.event = eventName ;

	if ( this.__ngev.listeners.newListener.length ) {
		// Extra care should be taken with the 'newListener' event, we should avoid recursion
		// in the case that eventName === 'newListener', but inside a 'newListener' listener,
		// .listenerCount() should report correctly
		newListenerListeners = this.__ngev.listeners.newListener.slice() ;

		this.__ngev.listeners[ eventName ].push( listener ) ;

		// Return an array, because one day, .addListener() may support multiple event addition at once,
		// e.g.: .addListener( { request: onRequest, close: onClose, error: onError } ) ;
		NextGenEvents.emitEvent( {
			emitter: this ,
			name: 'newListener' ,
			args: [ [ listener ] ] ,
			listeners: newListenerListeners
		} ) ;

		if ( this.__ngev.states[ eventName ] ) { NextGenEvents.emitToOneListener( this.__ngev.states[ eventName ] , listener ) ; }

		return this ;
	}

	this.__ngev.listeners[ eventName ].push( listener ) ;

	if ( this.__ngev.hasListenerPriority ) {
		// order higher priority first
		this.__ngev.listeners[ eventName ].sort( ( a , b ) => b.priority - a.priority ) ;
	}

	if ( this.__ngev.listeners[ eventName ].length === this.__ngev.maxListeners + 1 ) {
		process.emitWarning(
			"Possible NextGenEvents memory leak detected. " + this.__ngev.listeners[ eventName ].length + ' ' +
			eventName + " listeners added. Use emitter.setMaxListeners() to increase limit" ,
			{ type: "MaxListenersExceededWarning" }
		) ;
	}

	if ( this.__ngev.states[ eventName ] ) { NextGenEvents.emitToOneListener( this.__ngev.states[ eventName ] , listener ) ; }

	return this ;
} ;

NextGenEvents.prototype.on = NextGenEvents.prototype.addListener ;



// Short-hand
// .once( eventName , [fn] , [options] )
NextGenEvents.prototype.once = function( eventName , fn , options ) {
	if ( fn && typeof fn === 'object' ) { fn.once = true ; }
	else if ( options && typeof options === 'object' ) { options.once = true ; }
	else { options = { once: true } ; }

	return this.addListener( eventName , fn , options ) ;
} ;



// .waitFor( eventName )
// A Promise-returning .once() variant, only the first arg is returned
NextGenEvents.prototype.waitFor = function( eventName ) {
	return new Promise( resolve => {
		this.addListener( eventName , ( firstArg ) => resolve( firstArg ) , { once: true } ) ;
	} ) ;
} ;



// .waitForAll( eventName )
// A Promise-returning .once() variant, all args are returned as an array
NextGenEvents.prototype.waitForAll = function( eventName ) {
	return new Promise( resolve => {
		this.addListener( eventName , ( ... args ) => resolve( args ) , { once: true } ) ;
	} ) ;
} ;



NextGenEvents.prototype.removeListener = function( eventName , id ) {
	if ( ! eventName || typeof eventName !== 'string' ) { throw new TypeError( ".removeListener(): argument #0 should be a non-empty string" ) ; }

	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }

	var listeners = this.__ngev.listeners[ eventName ] ;
	if ( ! listeners || ! listeners.length ) { return this ; }

	var i , removedListeners , removeCount = 0 ,
		length = listeners.length ,
		hasRemoveListener = this.__ngev.listeners.removeListener.length ;

	if ( hasRemoveListener ) { removedListeners = [] ; }

	// In-place remove (from the listener array)
	for ( i = 0 ; i < length ; i ++ ) {
		if ( listeners[ i ].id === id ) {
			removeCount ++ ;
			if ( hasRemoveListener ) { removedListeners.push( listeners[ i ] ) ; }
		}
		else if ( removeCount ) {
			listeners[ i - removeCount ] = listeners[ i ] ;
		}
	}

	// Adjust the length
	if ( removeCount ) { listeners.length -= removeCount ; }

	if ( hasRemoveListener && removedListeners.length ) {
		this.emit( 'removeListener' , removedListeners ) ;
	}

	return this ;
} ;

NextGenEvents.prototype.off = NextGenEvents.prototype.removeListener ;



NextGenEvents.prototype.removeAllListeners = function( eventName ) {
	var removedListeners ;

	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }

	if ( eventName ) {
		// Remove all listeners for a particular event

		if ( ! eventName || typeof eventName !== 'string' ) { throw new TypeError( ".removeAllListeners(): argument #0 should be undefined or a non-empty string" ) ; }

		if ( ! this.__ngev.listeners[ eventName ] ) { this.__ngev.listeners[ eventName ] = [] ; }

		removedListeners = this.__ngev.listeners[ eventName ] ;
		this.__ngev.listeners[ eventName ] = [] ;

		if ( removedListeners.length && this.__ngev.listeners.removeListener.length ) {
			this.emit( 'removeListener' , removedListeners ) ;
		}
	}
	else {
		// Remove all listeners for any events
		// 'removeListener' listeners cannot be triggered: they are already deleted
		this.__ngev.listeners = {
			// Special events
			error: [] ,
			interrupt: [] ,
			newListener: [] ,
			removeListener: []
		} ;
	}

	return this ;
} ;



NextGenEvents.listenerWrapper = function( listener , event , contextScope , serial , nice ) {
	var returnValue , listenerCallback ,
		eventMaster = event.master || event ,
		interruptible = !! event.master || event.emitter.__ngev.interruptible ;

	if ( eventMaster.interrupt ) { return ; }

	if ( listener.async ) {
		if ( contextScope ) {
			contextScope.ready = ! serial ;
		}

		if ( nice < 0 ) {
			if ( globalData.recursions >= -nice ) {
				event.emitter.__ngev.desync( NextGenEvents.listenerWrapper.bind( undefined , listener , event , contextScope , serial , NextGenEvents.SYNC ) ) ;
				return ;
			}
		}
		else {
			setTimeout( NextGenEvents.listenerWrapper.bind( undefined , listener , event , contextScope , serial , NextGenEvents.SYNC ) , nice ) ;
			return ;
		}

		listenerCallback = ( arg ) => {

			eventMaster.listenersDone ++ ;

			// Async interrupt
			if ( arg && interruptible && ! eventMaster.interrupt && event.name !== 'interrupt' ) {
				eventMaster.interrupt = arg ;

				if ( eventMaster.callback ) { NextGenEvents.emitCallback( event ) ; }

				event.emitter.emit( 'interrupt' , eventMaster.interrupt ) ;
			}
			else if ( eventMaster.listenersDone >= eventMaster.listeners.length && eventMaster.callback ) {
				NextGenEvents.emitCallback( event ) ;
			}

			// Process the queue if serialized
			if ( serial ) { NextGenEvents.processScopeQueue( contextScope , true , true ) ; }
		} ;

		if ( listener.eventObject ) { listener.fn( event , listenerCallback ) ; }
		else { returnValue = listener.fn( ... event.args , listenerCallback ) ; }
	}
	else {
		if ( nice < 0 ) {
			if ( globalData.recursions >= -nice ) {
				event.emitter.__ngev.desync( NextGenEvents.listenerWrapper.bind( undefined , listener , event , contextScope , serial , NextGenEvents.SYNC ) ) ;
				return ;
			}
		}
		else {
			setTimeout( NextGenEvents.listenerWrapper.bind( undefined , listener , event , contextScope , serial , NextGenEvents.SYNC ) , nice ) ;
			return ;
		}

		if ( listener.eventObject ) { listener.fn( event ) ; }
		else { returnValue = listener.fn( ... event.args ) ; }

		eventMaster.listenersDone ++ ;
	}

	// Interrupt if non-falsy return value, if the emitter is interruptible, not already interrupted (emit once),
	// and not within an 'interrupt' event.
	if ( returnValue && interruptible && ! eventMaster.interrupt && event.name !== 'interrupt' ) {
		eventMaster.interrupt = returnValue ;

		if ( eventMaster.callback ) { NextGenEvents.emitCallback( event ) ; }

		event.emitter.emit( 'interrupt' , eventMaster.interrupt ) ;
	}
	else if ( eventMaster.listenersDone >= eventMaster.listeners.length && eventMaster.callback ) {
		NextGenEvents.emitCallback( event ) ;
	}
} ;



// A unique event ID
var nextEventId = 0 ;



/*
	emit( [nice] , eventName , [arg1] , [arg2] , [...] , [emitCallback] )
*/
NextGenEvents.prototype.emit = function( ... args ) {
	var event = NextGenEvents.createEvent( this , ... args ) ;
	return NextGenEvents.emitEvent( event ) ;
} ;



// For performance, do not emit if there is no listener for that event,
// do not even return an Event object, do not throw if the event name is error,
// or whatever the .emit() process could do when there is no listener.
NextGenEvents.prototype.emitIfListener = function( ... args ) {
	var eventName = typeof args[ 0 ] === 'number' ? args[ 1 ] : args[ 0 ] ;
	if ( ! this.__ngev || ! this.__ngev.listeners[ eventName ] || ! this.__ngev.listeners[ eventName ].length ) { return null ; }
	var event = NextGenEvents.createEvent( this , ... args ) ;
	return NextGenEvents.emitEvent( event ) ;
} ;



NextGenEvents.prototype.waitForEmit = function( ... args ) {
	return new Promise( resolve => {
		this.emit( ... args , ( interrupt ) => resolve( interrupt ) ) ;
	} ) ;
} ;



// Create an event object
NextGenEvents.createEvent = function( emitter , ... args ) {
	var event = {
		emitter: emitter ,
		interrupt: null ,
		master: null ,	// For grouped-correlated events
		sync: true
	} ;

	// Arguments handling
	if ( typeof args[ 0 ] === 'number' ) {
		event.nice = Math.floor( args[ 0 ] ) ;
		event.name = args[ 1 ] ;

		if ( ! event.name || typeof event.name !== 'string' ) {
			throw new TypeError( ".emit(): when argument #0 is a number, argument #1 should be a non-empty string" ) ;
		}

		if ( typeof args[ args.length - 1 ] === 'function' ) {
			event.callback = args[ args.length - 1 ] ;
			event.args = args.slice( 2 , -1 ) ;
		}
		else {
			event.args = args.slice( 2 ) ;
		}
	}
	else {
		//event.nice = emitter.__ngev.nice ;
		event.name = args[ 0 ] ;

		if ( ! event.name || typeof event.name !== 'string' ) {
			throw new TypeError( ".emit(): argument #0 should be an number or a non-empty string" ) ;
		}

		if ( typeof args[ args.length - 1 ] === 'function' ) {
			event.callback = args[ args.length - 1 ] ;
			event.args = args.slice( 1 , -1 ) ;
		}
		else {
			event.args = args.slice( 1 ) ;
		}
	}

	return event ;
} ;



/*
	At this stage, 'event' should be an object having those properties:
		* emitter: the event emitter
		* name: the event name
		* args: array, the arguments of the event
		* nice: (optional) nice value
		* callback: (optional) a callback for emit
		* listeners: (optional) override the listeners array stored in __ngev
*/
NextGenEvents.emitEvent = function( event ) {
	// /!\ Any change here *MUST* be reflected to NextGenEvents.emitIntricatedEvents() /!\
	var self = event.emitter ,
		i , iMax , count = 0 , state , removedListeners ;

	if ( ! self.__ngev ) { NextGenEvents.init.call( self ) ; }

	state = self.__ngev.states[ event.name ] ;

	// This is a state event, register it now!
	if ( state !== undefined ) {
		if ( state && event.args.length === state.args.length &&
			event.args.every( ( arg , index ) => arg === state.args[ index ] ) ) {
			// The emitter is already in this exact state, skip it now!
			return ;
		}

		// Unset all states of that group
		self.__ngev.stateGroups[ event.name ].forEach( ( eventName ) => {
			self.__ngev.states[ eventName ] = null ;
		} ) ;

		self.__ngev.states[ event.name ] = event ;
	}

	if ( ! self.__ngev.listeners[ event.name ] ) { self.__ngev.listeners[ event.name ] = [] ; }

	event.id = nextEventId ++ ;
	event.listenersDone = 0 ;

	if ( event.nice === undefined || event.nice === null ) { event.nice = self.__ngev.nice ; }

	// Trouble arise when a listener is removed from another listener, while we are still in the loop.
	// So we have to COPY the listener array right now!
	if ( ! event.listeners ) { event.listeners = self.__ngev.listeners[ event.name ].slice() ; }

	// Increment globalData.recursions
	globalData.recursions ++ ;
	event.depth = self.__ngev.depth ++ ;
	removedListeners = [] ;

	try {
		// Emit the event to all listeners!
		for ( i = 0 , iMax = event.listeners.length ; i < iMax ; i ++ ) {
			count ++ ;
			NextGenEvents.emitToOneListener( event , event.listeners[ i ] , removedListeners ) ;
		}
	}
	catch ( error ) {
		// Catch error, just to decrement globalData.recursions, re-throw after that...
		globalData.recursions -- ;
		self.__ngev.depth -- ;
		throw error ;
	}

	// Decrement globalData.recursions
	globalData.recursions -- ;
	if ( ! event.callback ) { self.__ngev.depth -- ; }

	// Emit 'removeListener' after calling listeners
	if ( removedListeners.length && self.__ngev.listeners.removeListener.length ) {
		self.emit( 'removeListener' , removedListeners ) ;
	}


	// 'error' event is a special case: it should be listened for, or it will throw an error
	if ( ! count ) {
		if ( event.name === 'error' ) {
			if ( event.args[ 0 ] ) { throw event.args[ 0 ] ; }
			else { throw Error( "Uncaught, unspecified 'error' event." ) ; }
		}

		if ( event.callback ) { NextGenEvents.emitCallback( event ) ; }
	}

	// Leaving sync mode
	event.sync = false ;

	return event ;
} ;



/*
	Spellcast-specific:
	Send interruptible events with listener-priority across multiple emitters.
	If an event is interrupted, all event are interrupted too.
	It has limited feature-support: no state-event, no builtin-event (not even 'error').
*/
NextGenEvents.emitIntricatedEvents = function( array , callback ) {
	var i , iMax , count = 0 , removedListeners ;

	if ( ! Array.isArray( array ) ) {
		throw new TypeError( '.emitCorrelatedEvents() argument should be an array' ) ;
	}

	var listenerEventRows = [] ,
		context = {
			nice: NextGenEvents.DESYNC ,
			ready: true ,
			status: NextGenEvents.CONTEXT_ENABLED ,
			serial: true ,
			scopes: {}
		} ,
		master = {
			sync: false ,
			nice: NextGenEvents.DESYNC ,
			context ,
			interrupt: null ,
			listeners: listenerEventRows ,	// because we need eventMaster.listeners.length
			listenersDone: 0 ,
			depth: 0 ,
			callback
		} ;

	array.forEach( eventParams => {
		var event = NextGenEvents.createEvent( ... eventParams ) ;
		event.master = master ;

		if ( ! event.emitter.__ngev ) { NextGenEvents.init.call( event.emitter ) ; }

		if ( ! event.emitter.__ngev.listeners[ event.name ] ) { event.emitter.__ngev.listeners[ event.name ] = [] ; }
		event.listeners = event.emitter.__ngev.listeners[ event.name ].slice() ;

		event.id = nextEventId ++ ;
		//event.listenersDone = 0 ;
		//event.nice = master.nice ;

		event.listeners.forEach( listener => listenerEventRows.push( { event , listener } ) ) ;
	} ) ;


	// Sort listeners
	listenerEventRows.sort( ( a , b ) => b.listener.priority - a.listener.priority ) ;

	// Increment globalData.recursions
	globalData.recursions ++ ;

	removedListeners = [] ;

	try {
		// Emit the event to all listeners!
		for ( i = 0 , iMax = listenerEventRows.length ; i < iMax ; i ++ ) {
			count ++ ;
			NextGenEvents.emitToOneListener( listenerEventRows[ i ].event , listenerEventRows[ i ].listener , removedListeners ) ;
		}
	}
	catch ( error ) {
		// Catch error, just to decrement globalData.recursions, re-throw after that...
		globalData.recursions -- ;
		throw error ;
	}

	// Decrement globalData.recursions
	globalData.recursions -- ;

	if ( ! count && master.callback ) { NextGenEvents.emitCallback( event ) ; }

	// Leaving sync mode
	master.sync = false ;
} ;



// If removedListeners is not given, then one-time listener emit the 'removeListener' event,
// if given: that's the caller business to do it
NextGenEvents.emitToOneListener = function( event , listener , removedListeners ) {
	var self = event.emitter ,
		eventMaster = event.master || event ,
		context = event.master ? event.master.context : listener.context ,
		contextScope , serial , currentNice , emitRemoveListener = false ;

	if ( context ) {
		// If the listener context is disabled...
		if ( context.status === NextGenEvents.CONTEXT_DISABLED ) { return ; }

		// The nice value for this listener...
		currentNice = Math.max( eventMaster.nice , listener.nice , context.nice ) ;
		serial = context.serial ;
		contextScope = NextGenEvents.getContextScope( context , eventMaster.depth ) ;
	}
	else {
		currentNice = Math.max( eventMaster.nice , listener.nice ) ;
	}


	if ( listener.once ) {
		// We should remove the current listener RIGHT NOW because of recursive .emit() issues:
		// one listener may eventually fire this very same event synchronously during the current loop.
		self.__ngev.listeners[ event.name ] = self.__ngev.listeners[ event.name ].filter(
			NextGenEvents.filterOutCallback.bind( undefined , listener )
		) ;

		if ( removedListeners ) { removedListeners.push( listener ) ; }
		else { emitRemoveListener = true ; }
	}

	if ( context && ( context.status === NextGenEvents.CONTEXT_QUEUED || ! contextScope.ready ) ) {
		// Almost all works should be done by .emit(), and little few should be done by .processScopeQueue()
		contextScope.queue.push( { event: event , listener: listener , nice: currentNice } ) ;
	}
	else {
		NextGenEvents.listenerWrapper( listener , event , contextScope , serial , currentNice ) ;
	}

	// Emit 'removeListener' after calling the listener
	if ( emitRemoveListener && self.__ngev.listeners.removeListener.length ) {
		self.emit( 'removeListener' , [ listener ] ) ;
	}
} ;



NextGenEvents.emitCallback = function( event ) {
	var callback ;

	if ( event.master ) {
		callback = event.master.callback ;
		delete event.master.callback ;

		if ( event.master.sync ) {
			nextTick( () => callback( event.master.interrupt , event ) ) ;
		}
		else {
			callback( event.master.interrupt , event ) ;
		}

		return ;
	}

	callback = event.callback ;
	delete event.callback ;

	if ( event.sync && event.emitter.__ngev.nice !== NextGenEvents.SYNC ) {
		// Force desync if global nice value is not SYNC
		event.emitter.__ngev.desync( () => {
			event.emitter.__ngev.depth -- ;
			callback( event.interrupt , event ) ;
		} ) ;
	}
	else {
		event.emitter.__ngev.depth -- ;
		callback( event.interrupt , event ) ;
	}
} ;



NextGenEvents.prototype.listeners = function( eventName ) {
	if ( ! eventName || typeof eventName !== 'string' ) { throw new TypeError( ".listeners(): argument #0 should be a non-empty string" ) ; }

	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! this.__ngev.listeners[ eventName ] ) { this.__ngev.listeners[ eventName ] = [] ; }

	// Do not return the array, shallow copy it
	return this.__ngev.listeners[ eventName ].slice() ;
} ;



NextGenEvents.listenerCount = function( emitter , eventName ) {
	if ( ! emitter || ! ( emitter instanceof NextGenEvents ) ) { throw new TypeError( ".listenerCount(): argument #0 should be an instance of NextGenEvents" ) ; }
	return emitter.listenerCount( eventName ) ;
} ;



NextGenEvents.prototype.listenerCount = function( eventName ) {
	if ( ! eventName || typeof eventName !== 'string' ) { throw new TypeError( ".listenerCount(): argument #1 should be a non-empty string" ) ; }
	if ( ! this.__ngev || ! this.__ngev.listeners[ eventName ] ) { return 0 ; }
	return this.__ngev.listeners[ eventName ].length ;
} ;



NextGenEvents.prototype.setNice = function( nice ) {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	this.__ngev.nice = Math.floor( + nice || 0 ) ;
} ;



NextGenEvents.prototype.desyncUseNextTick = function( useNextTick ) {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	this.__ngev.desync = useNextTick ? nextTick : setImmediate ;
} ;



NextGenEvents.prototype.setInterruptible = function( isInterruptible ) {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	this.__ngev.interruptible = !! isInterruptible ;
} ;



NextGenEvents.prototype.setListenerPriority = function( hasListenerPriority ) {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	this.__ngev.hasListenerPriority = !! hasListenerPriority ;
} ;



// Make two objects share the same event bus
NextGenEvents.share = function( source , target ) {
	if ( ! ( source instanceof NextGenEvents ) || ! ( target instanceof NextGenEvents ) ) {
		throw new TypeError( 'NextGenEvents.share() arguments should be instances of NextGenEvents' ) ;
	}

	if ( ! source.__ngev ) { NextGenEvents.init.call( source ) ; }

	Object.defineProperty( target , '__ngev' , {
		configurable: true ,
		value: source.__ngev
	} ) ;
} ;



NextGenEvents.reset = function( emitter ) {
	Object.defineProperty( emitter , '__ngev' , {
		configurable: true ,
		value: null
	} ) ;
} ;



NextGenEvents.prototype.getMaxListeners = function() {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	return this.__ngev.maxListeners ;
} ;



NextGenEvents.prototype.setMaxListeners = function( n ) {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	this.__ngev.maxListeners = typeof n === 'number' && ! Number.isNaN( n ) ? Math.floor( n ) : NextGenEvents.defaultMaxListeners ;
	return this ;
} ;



// Sometime useful as a no-op callback...
NextGenEvents.noop = () => undefined ;





/* Next Gen feature: states! */



// .defineStates( exclusiveState1 , [exclusiveState2] , [exclusiveState3] , ... )
NextGenEvents.prototype.defineStates = function( ... states ) {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }

	states.forEach( ( state ) => {
		this.__ngev.states[ state ] = null ;
		this.__ngev.stateGroups[ state ] = states ;
	} ) ;
} ;



NextGenEvents.prototype.hasState = function( state ) {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	return !! this.__ngev.states[ state ] ;
} ;



NextGenEvents.prototype.getAllStates = function() {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	return Object.keys( this.__ngev.states ).filter( e => this.__ngev.states[ e ] ) ;
} ;





/* Next Gen feature: groups! */



NextGenEvents.groupAddListener = function( emitters , eventName , fn , options ) {
	// Manage arguments
	if ( typeof fn !== 'function' ) { options = fn ; fn = undefined ; }
	if ( ! options || typeof options !== 'object' ) { options = {} ; }

	fn = fn || options.fn ;
	delete options.fn ;

	// Preserve the listener ID, so groupRemoveListener() will work as expected
	options.id = options.id || fn ;

	emitters.forEach( ( emitter ) => {
		emitter.addListener( eventName , fn.bind( undefined , emitter ) , options ) ;
	} ) ;
} ;

NextGenEvents.groupOn = NextGenEvents.groupAddListener ;



// Once per emitter
NextGenEvents.groupOnce = function( emitters , eventName , fn , options ) {
	if ( fn && typeof fn === 'object' ) { fn.once = true ; }
	else if ( options && typeof options === 'object' ) { options.once = true ; }
	else { options = { once: true } ; }

	return this.groupAddListener( emitters , eventName , fn , options ) ;
} ;



// A Promise-returning .groupOnce() variant, it returns an array with only the first arg for each emitter's event
NextGenEvents.groupWaitFor = function( emitters , eventName ) {
	return Promise.all( emitters.map( emitter => emitter.waitFor( eventName ) ) ) ;
} ;



// A Promise-returning .groupOnce() variant, it returns an array of array for each emitter's event
NextGenEvents.groupWaitForAll = function( emitters , eventName ) {
	return Promise.all( emitters.map( emitter => emitter.waitForAll( eventName ) ) ) ;
} ;



// Globally once, only one event could be emitted, by the first emitter to emit
NextGenEvents.groupOnceFirst = function( emitters , eventName , fn , options ) {
	var fnWrapper , triggered = false ;

	// Manage arguments
	if ( typeof fn !== 'function' ) { options = fn ; fn = undefined ; }
	if ( ! options || typeof options !== 'object' ) { options = {} ; }

	fn = fn || options.fn ;
	delete options.fn ;

	// Preserve the listener ID, so groupRemoveListener() will work as expected
	options.id = options.id || fn ;

	fnWrapper = ( ... args ) => {
		if ( triggered ) { return ; }
		triggered = true ;
		NextGenEvents.groupRemoveListener( emitters , eventName , options.id ) ;
		fn( ... args ) ;
	} ;

	emitters.forEach( ( emitter ) => {
		emitter.once( eventName , fnWrapper.bind( undefined , emitter ) , options ) ;
	} ) ;
} ;



// A Promise-returning .groupOnceFirst() variant, only the first arg is returned
NextGenEvents.groupWaitForFirst = function( emitters , eventName ) {
	return new Promise( resolve => {
		NextGenEvents.groupOnceFirst( emitters , eventName , ( firstArg ) => resolve( firstArg ) ) ;
	} ) ;
} ;



// A Promise-returning .groupOnceFirst() variant, all args are returned as an array
NextGenEvents.groupWaitForFirstAll = function( emitters , eventName ) {
	return new Promise( resolve => {
		NextGenEvents.groupOnceFirst( emitters , eventName , ( ... args ) => resolve( args ) ) ;
	} ) ;
} ;



// Globally once, only one event could be emitted, by the last emitter to emit
NextGenEvents.groupOnceLast = function( emitters , eventName , fn , options ) {
	var fnWrapper , triggered = false , count = emitters.length ;

	// Manage arguments
	if ( typeof fn !== 'function' ) { options = fn ; fn = undefined ; }
	if ( ! options || typeof options !== 'object' ) { options = {} ; }

	fn = fn || options.fn ;
	delete options.fn ;

	// Preserve the listener ID, so groupRemoveListener() will work as expected
	options.id = options.id || fn ;

	fnWrapper = ( ... args ) => {
		if ( triggered ) { return ; }
		if ( -- count ) { return ; }

		// So this is the last emitter...

		triggered = true ;
		// No need to remove listeners: there are already removed anyway
		//NextGenEvents.groupRemoveListener( emitters , eventName , options.id ) ;
		fn( ... args ) ;
	} ;

	emitters.forEach( ( emitter ) => {
		emitter.once( eventName , fnWrapper.bind( undefined , emitter ) , options ) ;
	} ) ;
} ;



// A Promise-returning .groupGlobalWaitFor() variant, only the first arg is returned
NextGenEvents.groupWaitForLast = function( emitters , eventName ) {
	return new Promise( resolve => {
		NextGenEvents.groupOnceLast( emitters , eventName , ( firstArg ) => resolve( firstArg ) ) ;
	} ) ;
} ;



// A Promise-returning .groupGlobalWaitFor() variant, all args are returned as an array
NextGenEvents.groupWaitForLastAll = function( emitters , eventName ) {
	return new Promise( resolve => {
		NextGenEvents.groupOnceLast( emitters , eventName , ( ... args ) => resolve( args ) ) ;
	} ) ;
} ;



NextGenEvents.groupRemoveListener = function( emitters , eventName , id ) {
	emitters.forEach( ( emitter ) => {
		emitter.removeListener( eventName , id ) ;
	} ) ;
} ;

NextGenEvents.groupOff = NextGenEvents.groupRemoveListener ;



NextGenEvents.groupRemoveAllListeners = function( emitters , eventName ) {
	emitters.forEach( ( emitter ) => {
		emitter.removeAllListeners( eventName ) ;
	} ) ;
} ;



NextGenEvents.groupEmit = function( emitters , ... args ) {
	var eventName , nice , argStart = 1 , argEnd , count = emitters.length ,
		callback , callbackWrapper , callbackTriggered = false ;

	if ( typeof args[ args.length - 1 ] === 'function' ) {
		argEnd = -1 ;
		callback = args[ args.length - 1 ] ;

		callbackWrapper = ( interruption ) => {
			if ( callbackTriggered ) { return ; }

			if ( interruption ) {
				callbackTriggered = true ;
				callback( interruption ) ;
			}
			else if ( ! -- count ) {
				callbackTriggered = true ;
				callback() ;
			}
		} ;
	}

	if ( typeof args[ 0 ] === 'number' ) {
		argStart = 2 ;
		nice = typeof args[ 0 ] ;
	}

	eventName = args[ argStart - 1 ] ;
	args = args.slice( argStart , argEnd ) ;

	emitters.forEach( ( emitter ) => {
		NextGenEvents.emitEvent( {
			emitter: emitter ,
			name: eventName ,
			args: args ,
			nice: nice ,
			callback: callbackWrapper
		} ) ;
	} ) ;
} ;



NextGenEvents.groupWaitForEmit = function( emitters , ... args ) {
	return new Promise( resolve => {
		NextGenEvents.groupEmit( emitters , ... args , ( interrupt ) => resolve( interrupt ) ) ;
	} ) ;
} ;



NextGenEvents.groupDefineStates = function( emitters , ... args ) {
	emitters.forEach( ( emitter ) => {
		emitter.defineStates( ... args ) ;
	} ) ;
} ;



// Bad names, but since they make their way through the API documentation,
// it should be kept for backward compatibility, but they are DEPRECATED.
NextGenEvents.groupGlobalOnce = NextGenEvents.groupOnceFirst ;
NextGenEvents.groupGlobalOnceAll = NextGenEvents.groupOnceLast ;





/* Next Gen feature: contexts! */



NextGenEvents.CONTEXT_ENABLED = 0 ;
NextGenEvents.CONTEXT_DISABLED = 1 ;
NextGenEvents.CONTEXT_QUEUED = 2 ;



NextGenEvents.prototype.addListenerContext = function( contextName , options ) {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }

	if ( ! contextName || typeof contextName !== 'string' ) { throw new TypeError( ".addListenerContext(): argument #0 should be a non-empty string" ) ; }
	if ( ! options || typeof options !== 'object' ) { options = {} ; }

	var context = this.__ngev.contexts[ contextName ] ;

	if ( ! context ) {
		context = this.__ngev.contexts[ contextName ] = {
			nice: NextGenEvents.SYNC ,
			ready: true ,
			status: NextGenEvents.CONTEXT_ENABLED ,
			serial: false ,
			scopes: {}
		} ;
	}

	if ( options.nice !== undefined ) { context.nice = Math.floor( options.nice ) ; }
	if ( options.status !== undefined ) { context.status = options.status ; }
	if ( options.serial !== undefined ) { context.serial = !! options.serial ; }

	return context ;
} ;



NextGenEvents.prototype.getListenerContext = function( contextName ) {
	return this.__ngev.contexts[ contextName ] ;
} ;



NextGenEvents.getContextScope = function( context , scopeName ) {
	var scope = context.scopes[ scopeName ] ;

	if ( ! scope ) {
		scope = context.scopes[ scopeName ] = {
			ready: true ,
			queue: []
		} ;
	}

	return scope ;
} ;



NextGenEvents.prototype.disableListenerContext = function( contextName ) {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! contextName || typeof contextName !== 'string' ) { throw new TypeError( ".disableListenerContext(): argument #0 should be a non-empty string" ) ; }
	if ( ! this.__ngev.contexts[ contextName ] ) { this.addListenerContext( contextName ) ; }

	this.__ngev.contexts[ contextName ].status = NextGenEvents.CONTEXT_DISABLED ;

	return this ;
} ;



NextGenEvents.prototype.enableListenerContext = function( contextName ) {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! contextName || typeof contextName !== 'string' ) { throw new TypeError( ".enableListenerContext(): argument #0 should be a non-empty string" ) ; }
	if ( ! this.__ngev.contexts[ contextName ] ) { this.addListenerContext( contextName ) ; }

	var context = this.__ngev.contexts[ contextName ] ;

	context.status = NextGenEvents.CONTEXT_ENABLED ;

	Object.values( context.scopes ).forEach( contextScope => {
		if ( contextScope.queue.length > 0 ) { NextGenEvents.processScopeQueue( contextScope , context.serial ) ; }
	} ) ;

	return this ;
} ;



NextGenEvents.prototype.queueListenerContext = function( contextName ) {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! contextName || typeof contextName !== 'string' ) { throw new TypeError( ".queueListenerContext(): argument #0 should be a non-empty string" ) ; }
	if ( ! this.__ngev.contexts[ contextName ] ) { this.addListenerContext( contextName ) ; }

	this.__ngev.contexts[ contextName ].status = NextGenEvents.CONTEXT_QUEUED ;

	return this ;
} ;



NextGenEvents.prototype.serializeListenerContext = function( contextName , value ) {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! contextName || typeof contextName !== 'string' ) { throw new TypeError( ".serializeListenerContext(): argument #0 should be a non-empty string" ) ; }
	if ( ! this.__ngev.contexts[ contextName ] ) { this.addListenerContext( contextName ) ; }

	this.__ngev.contexts[ contextName ].serial = value === undefined ? true : !! value ;

	return this ;
} ;



NextGenEvents.prototype.setListenerContextNice = function( contextName , nice ) {
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! contextName || typeof contextName !== 'string' ) { throw new TypeError( ".setListenerContextNice(): argument #0 should be a non-empty string" ) ; }
	if ( ! this.__ngev.contexts[ contextName ] ) { this.addListenerContext( contextName ) ; }

	this.__ngev.contexts[ contextName ].nice = Math.floor( nice ) ;

	return this ;
} ;



NextGenEvents.prototype.destroyListenerContext = function( contextName ) {
	var i , length , context , eventName , newListeners , removedListeners = [] ;

	if ( ! contextName || typeof contextName !== 'string' ) { throw new TypeError( ".disableListenerContext(): argument #0 should be a non-empty string" ) ; }

	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }

	context = this.__ngev.contexts[ contextName ] ;
	if ( ! context ) { return ; }

	for ( eventName in this.__ngev.listeners ) {
		newListeners = null ;
		length = this.__ngev.listeners[ eventName ].length ;

		for ( i = 0 ; i < length ; i ++ ) {
			if ( this.__ngev.listeners[ eventName ][ i ].context === context ) {
				newListeners = [] ;
				removedListeners.push( this.__ngev.listeners[ eventName ][ i ] ) ;
			}
			else if ( newListeners ) {
				newListeners.push( this.__ngev.listeners[ eventName ][ i ] ) ;
			}
		}

		if ( newListeners ) { this.__ngev.listeners[ eventName ] = newListeners ; }
	}

	delete this.__ngev.contexts[ contextName ] ;

	if ( removedListeners.length && this.__ngev.listeners.removeListener.length ) {
		this.emit( 'removeListener' , removedListeners ) ;
	}

	return this ;
} ;



NextGenEvents.processScopeQueue = function( contextScope , serial , isCompletionCallback ) {
	var job , event , eventMaster , emitter ;

	if ( isCompletionCallback ) { contextScope.ready = true ; }

	// Increment recursion
	globalData.recursions ++ ;

	while ( contextScope.ready && contextScope.queue.length ) {
		job = contextScope.queue.shift() ;
		event = job.event ;
		eventMaster = event.master || event ;
		emitter = event.emitter ;

		// This event has been interrupted, drop it now!
		if ( eventMaster.interrupt ) { continue ; }

		NextGenEvents.listenerWrapper( job.listener , event , contextScope , serial , job.nice ) ;
	}

	// Decrement recursion
	globalData.recursions -- ;
} ;



// Backup for the AsyncTryCatch
NextGenEvents.on = NextGenEvents.prototype.on ;
NextGenEvents.once = NextGenEvents.prototype.once ;
NextGenEvents.off = NextGenEvents.prototype.off ;



if ( global.AsyncTryCatch ) {
	NextGenEvents.prototype.asyncTryCatchId = global.AsyncTryCatch.NextGenEvents.length ;
	global.AsyncTryCatch.NextGenEvents.push( NextGenEvents ) ;

	if ( global.AsyncTryCatch.substituted ) {
		global.AsyncTryCatch.substitute() ;
	}
}



// Load Proxy AT THE END (circular require)
NextGenEvents.Proxy = require( './Proxy.js' ) ;


}).call(this)}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"../package.json":6,"./Proxy.js":2,"_process":4,"timers":5}],2:[function(require,module,exports){
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


},{"./NextGenEvents.js":1}],3:[function(require,module,exports){
(function (process){(function (){
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



if ( typeof window.setImmediate !== 'function' ) {
	window.setImmediate = fn => setTimeout( fn , 0 ) ;
}

if ( ! process.emitWarning ) {
	// Looks like browserify don't have this
	process.emitWarning = () => undefined ;
}

module.exports = require( './NextGenEvents.js' ) ;
module.exports.isBrowser = true ;


}).call(this)}).call(this,require('_process'))
},{"./NextGenEvents.js":1,"_process":4}],4:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],5:[function(require,module,exports){
(function (setImmediate,clearImmediate){(function (){
var nextTick = require('process/browser.js').nextTick;
var apply = Function.prototype.apply;
var slice = Array.prototype.slice;
var immediateIds = {};
var nextImmediateId = 0;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) { timeout.close(); };

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(window, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// That's not how node.js implements it but the exposed api is the same.
exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
  var id = nextImmediateId++;
  var args = arguments.length < 2 ? false : slice.call(arguments, 1);

  immediateIds[id] = true;

  nextTick(function onNextTick() {
    if (immediateIds[id]) {
      // fn.call() is faster so we optimize for the common use-case
      // @see http://jsperf.com/call-apply-segu
      if (args) {
        fn.apply(null, args);
      } else {
        fn.call(null);
      }
      // Prevent ids from leaking
      exports.clearImmediate(id);
    }
  });

  return id;
};

exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
  delete immediateIds[id];
};
}).call(this)}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":4,"timers":5}],6:[function(require,module,exports){
module.exports={
  "name": "nextgen-events",
  "version": "1.5.1",
  "description": "The next generation of events handling for javascript! New: abstract away the network!",
  "main": "lib/NextGenEvents.js",
  "engines": {
    "node": ">=6.0.0"
  },
  "directories": {
    "test": "test",
    "bench": "bench"
  },
  "dependencies": {},
  "devDependencies": {
    "browserify": "^17.0.0",
    "uglify-js-es6": "^2.8.9",
    "ws": "^7.4.6"
  },
  "scripts": {
    "test": "tea-time -R dot"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/cronvel/nextgen-events.git"
  },
  "keywords": [
    "events",
    "async",
    "emit",
    "listener",
    "context",
    "series",
    "serialize",
    "namespace",
    "proxy",
    "network"
  ],
  "author": "Cédric Ronvel",
  "license": "MIT",
  "bugs": {
    "url": "https://github.com/cronvel/nextgen-events/issues"
  },
  "config": {
    "tea-time": {
      "coverDir": [
        "lib"
      ]
    }
  },
  "copyright": {
    "title": "Next-Gen Events",
    "years": [
      2015,
      2021
    ],
    "owner": "Cédric Ronvel"
  }
}

},{}]},{},[3])(3)
});
