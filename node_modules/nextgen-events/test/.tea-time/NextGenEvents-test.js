(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
/*
	Next Gen Events
	
	Copyright (c) 2015 - 2016 Cédric Ronvel
	
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



function NextGenEvents() { return Object.create( NextGenEvents.prototype ) ; }
module.exports = NextGenEvents ;
NextGenEvents.prototype.__prototypeUID__ = 'nextgen-events/NextGenEvents' ;
NextGenEvents.prototype.__prototypeVersion__ = require( '../package.json' ).version ;

			/* Basic features, more or less compatible with Node.js */



NextGenEvents.SYNC = -Infinity ;

// Not part of the prototype, because it should not pollute userland's prototype.
// It has an eventEmitter as 'this' anyway (always called using call()).
NextGenEvents.init = function init()
{
	Object.defineProperty( this , '__ngev' , {
		configurable: true ,
		value: {
			nice: NextGenEvents.SYNC ,
			interruptible: false ,
			recursion: 0 ,
			contexts: {} ,
			
			// States by events
			states: {} ,
			
			// State groups by events
			stateGroups: {} ,
			
			// Listeners by events
			listeners: {
				// Special events
				error: [] ,
				interrupt: [] ,
				newListener: [] ,
				removeListener: []
			}
		}
	} ) ;
} ;



// Use it with .bind()
NextGenEvents.filterOutCallback = function( what , currentElement ) { return what !== currentElement ; } ;



// .addListener( eventName , [fn] , [options] )
NextGenEvents.prototype.addListener = function addListener( eventName , fn , options )
{
	var listener = {} , newListenerListeners ;
	
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! this.__ngev.listeners[ eventName ] ) { this.__ngev.listeners[ eventName ] = [] ; }
	
	if ( ! eventName || typeof eventName !== 'string' ) { throw new TypeError( ".addListener(): argument #0 should be a non-empty string" ) ; }
	if ( typeof fn !== 'function' ) { options = fn ; fn = undefined ; }
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	listener.fn = fn || options.fn ;
	listener.id = options.id !== undefined ? options.id : listener.fn ;
	listener.once = !! options.once ;
	listener.async = !! options.async ;
	listener.eventObject = !! options.eventObject ;
	listener.nice = options.nice !== undefined ? Math.floor( options.nice ) : NextGenEvents.SYNC ;
	listener.context = typeof options.context === 'string' ? options.context : null ;
	
	if ( typeof listener.fn !== 'function' )
	{
		throw new TypeError( ".addListener(): a function or an object with a 'fn' property which value is a function should be provided" ) ;
	}
	
	// Implicit context creation
	if ( listener.context && typeof listener.context === 'string' && ! this.__ngev.contexts[ listener.context ] )
	{
		this.addListenerContext( listener.context ) ;
	}
	
	// Note: 'newListener' and 'removeListener' event return an array of listener, but not the event name.
	// So the event's name can be retrieved in the listener itself.
	listener.event = eventName ;
	
	if ( this.__ngev.listeners.newListener.length )
	{
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
	
	if ( this.__ngev.states[ eventName ] ) { NextGenEvents.emitToOneListener( this.__ngev.states[ eventName ] , listener ) ; }
	
	return this ;
} ;

NextGenEvents.prototype.on = NextGenEvents.prototype.addListener ;



// Shortcut
// .once( eventName , [fn] , [options] )
NextGenEvents.prototype.once = function once( eventName , fn , options )
{
	if ( fn && typeof fn === 'object' ) { fn.once = true ; }
	else if ( options && typeof options === 'object' ) { options.once = true ; }
	else { options = { once: true } ; }
	
	return this.addListener( eventName , fn , options ) ;
} ;



NextGenEvents.prototype.removeListener = function removeListener( eventName , id )
{
	var i , length , newListeners = [] , removedListeners = [] ;
	
	if ( ! eventName || typeof eventName !== 'string' ) { throw new TypeError( ".removeListener(): argument #0 should be a non-empty string" ) ; }
	
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! this.__ngev.listeners[ eventName ] ) { this.__ngev.listeners[ eventName ] = [] ; }
	
	length = this.__ngev.listeners[ eventName ].length ;
	
	// It's probably faster to create a new array of listeners
	for ( i = 0 ; i < length ; i ++ )
	{
		if ( this.__ngev.listeners[ eventName ][ i ].id === id )
		{
			removedListeners.push( this.__ngev.listeners[ eventName ][ i ] ) ;
		}
		else
		{
			newListeners.push( this.__ngev.listeners[ eventName ][ i ] ) ;
		}
	}
	
	this.__ngev.listeners[ eventName ] = newListeners ;
	
	if ( removedListeners.length && this.__ngev.listeners.removeListener.length )
	{
		this.emit( 'removeListener' , removedListeners ) ;
	}
	
	return this ;
} ;

NextGenEvents.prototype.off = NextGenEvents.prototype.removeListener ;



NextGenEvents.prototype.removeAllListeners = function removeAllListeners( eventName )
{
	var removedListeners ;
	
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	
	if ( eventName )
	{
		// Remove all listeners for a particular event
		
		if ( ! eventName || typeof eventName !== 'string' ) { throw new TypeError( ".removeAllListeners(): argument #0 should be undefined or a non-empty string" ) ; }
		
		if ( ! this.__ngev.listeners[ eventName ] ) { this.__ngev.listeners[ eventName ] = [] ; }
		
		removedListeners = this.__ngev.listeners[ eventName ] ;
		this.__ngev.listeners[ eventName ] = [] ;
		
		if ( removedListeners.length && this.__ngev.listeners.removeListener.length )
		{
			this.emit( 'removeListener' , removedListeners ) ;
		}
	}
	else
	{
		// Remove all listeners for any events
		// 'removeListener' listeners cannot be triggered: they are already deleted
		this.__ngev.listeners = {} ;
	}
	
	return this ;
} ;



NextGenEvents.listenerWrapper = function listenerWrapper( listener , event , context )
{
	var returnValue , serial , listenerCallback ;
	
	if ( event.interrupt ) { return ; }
	
	if ( listener.async )
	{
		//serial = context && context.serial ;
		if ( context )
		{
			serial = context.serial ;
			context.ready = ! serial ;
		}
		
		listenerCallback = function( arg ) {
			
			event.listenersDone ++ ;
			
			// Async interrupt
			if ( arg && event.emitter.__ngev.interruptible && ! event.interrupt && event.name !== 'interrupt' )
			{
				event.interrupt = arg ;
				
				if ( event.callback )
				{
					event.callback( event.interrupt , event ) ;
					delete event.callback ;
				}
				
				event.emitter.emit( 'interrupt' , event.interrupt ) ;
			}
			else if ( event.listenersDone >= event.listeners.length && event.callback )
			{
				event.callback( undefined , event ) ;
				delete event.callback ;
			}
			
			// Process the queue if serialized
			if ( serial ) { NextGenEvents.processQueue.call( event.emitter , listener.context , true ) ; }
			
		} ;
		
		if ( listener.eventObject ) { listener.fn( event , listenerCallback ) ; }
		else { returnValue = listener.fn.apply( undefined , event.args.concat( listenerCallback ) ) ; }
	}
	else
	{
		if ( listener.eventObject ) { listener.fn( event ) ; }
		else { returnValue = listener.fn.apply( undefined , event.args ) ; }
		
		event.listenersDone ++ ;
	}
	
	// Interrupt if non-falsy return value, if the emitter is interruptible, not already interrupted (emit once),
	// and not within an 'interrupt' event.
	if ( returnValue && event.emitter.__ngev.interruptible && ! event.interrupt && event.name !== 'interrupt' )
	{
		event.interrupt = returnValue ;
		
		if ( event.callback )
		{
			event.callback( event.interrupt , event ) ;
			delete event.callback ;
		}
		
		event.emitter.emit( 'interrupt' , event.interrupt ) ;
	}
	else if ( event.listenersDone >= event.listeners.length && event.callback )
	{
		event.callback( undefined , event ) ;
		delete event.callback ;
	}
} ;



// A unique event ID
var nextEventId = 0 ;



/*
	emit( [nice] , eventName , [arg1] , [arg2] , [...] , [emitCallback] )
*/
NextGenEvents.prototype.emit = function emit()
{
	var event ;
	
	event = { emitter: this } ;
	
	// Arguments handling
	if ( typeof arguments[ 0 ] === 'number' )
	{
		event.nice = Math.floor( arguments[ 0 ] ) ;
		event.name = arguments[ 1 ] ;
		if ( ! event.name || typeof event.name !== 'string' ) { throw new TypeError( ".emit(): when argument #0 is a number, argument #1 should be a non-empty string" ) ; }
		
		if ( typeof arguments[ arguments.length - 1 ] === 'function' )
		{
			event.callback = arguments[ arguments.length - 1 ] ;
			event.args = Array.prototype.slice.call( arguments , 2 , -1 ) ;
		}
		else
		{
			event.args = Array.prototype.slice.call( arguments , 2 ) ;
		}
	}
	else
	{
		//event.nice = this.__ngev.nice ;
		event.name = arguments[ 0 ] ;
		if ( ! event.name || typeof event.name !== 'string' ) { throw new TypeError( ".emit(): argument #0 should be an number or a non-empty string" ) ; }
		event.args = Array.prototype.slice.call( arguments , 1 ) ;
		
		if ( typeof arguments[ arguments.length - 1 ] === 'function' )
		{
			event.callback = arguments[ arguments.length - 1 ] ;
			event.args = Array.prototype.slice.call( arguments , 1 , -1 ) ;
		}
		else
		{
			event.args = Array.prototype.slice.call( arguments , 1 ) ;
		}
	}
	
	return NextGenEvents.emitEvent( event ) ;
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
NextGenEvents.emitEvent = function emitEvent( event )
{
	var self = event.emitter ,
		i , iMax , count = 0 , state , removedListeners ;
	
	if ( ! self.__ngev ) { NextGenEvents.init.call( self ) ; }
	
	state = self.__ngev.states[ event.name ] ;
	
	// This is a state event, register it now!
	if ( state !== undefined )
	{
		
		if ( state && event.args.length === state.args.length &&
			event.args.every( function( arg , index ) { return arg === state.args[ index ] ; } ) )
		{
			// The emitter is already in this exact state, skip it now!
			return ;
		}
		
		// Unset all states of that group
		self.__ngev.stateGroups[ event.name ].forEach( function( eventName ) {
			self.__ngev.states[ eventName ] = null ;
		} ) ;
		
		self.__ngev.states[ event.name ] = event ;
	}
	
	if ( ! self.__ngev.listeners[ event.name ] ) { self.__ngev.listeners[ event.name ] = [] ; }
	
	event.id = nextEventId ++ ;
	event.listenersDone = 0 ;
	event.once = !! event.once ;
	
	if ( event.nice === undefined || event.nice === null ) { event.nice = self.__ngev.nice ; }
	
	// Trouble arise when a listener is removed from another listener, while we are still in the loop.
	// So we have to COPY the listener array right now!
	if ( ! event.listeners ) { event.listeners = self.__ngev.listeners[ event.name ].slice() ; }
	
	// Increment self.__ngev.recursion
	self.__ngev.recursion ++ ;
	removedListeners = [] ;
	
	// Emit the event to all listeners!
	for ( i = 0 , iMax = event.listeners.length ; i < iMax ; i ++ )
	{
		count ++ ;
		NextGenEvents.emitToOneListener( event , event.listeners[ i ] , removedListeners ) ;
	}
	
	// Decrement recursion
	self.__ngev.recursion -- ;
	
	// Emit 'removeListener' after calling listeners
	if ( removedListeners.length && self.__ngev.listeners.removeListener.length )
	{
		self.emit( 'removeListener' , removedListeners ) ;
	}
	
	
	// 'error' event is a special case: it should be listened for, or it will throw an error
	if ( ! count )
	{
		if ( event.name === 'error' )
		{
			if ( event.args[ 0 ] ) { throw event.args[ 0 ] ; }
			else { throw Error( "Uncaught, unspecified 'error' event." ) ; }
		}
		
		if ( event.callback )
		{
			event.callback( undefined , event ) ;
			delete event.callback ;
		}
	}
	
	return event ;
} ;



// If removedListeners is not given, then one-time listener emit the 'removeListener' event,
// if given: that's the caller business to do it
NextGenEvents.emitToOneListener = function emitToOneListener( event , listener , removedListeners )
{	
	var self = event.emitter ,
		context , currentNice , emitRemoveListener = false ;
	
	context = listener.context && self.__ngev.contexts[ listener.context ] ;
	
	// If the listener context is disabled...
	if ( context && context.status === NextGenEvents.CONTEXT_DISABLED ) { return ; }
	
	// The nice value for this listener...
	if ( context ) { currentNice = Math.max( event.nice , listener.nice , context.nice ) ; }
	else { currentNice = Math.max( event.nice , listener.nice ) ; }
	
	
	if ( listener.once )
	{
		// We should remove the current listener RIGHT NOW because of recursive .emit() issues:
		// one listener may eventually fire this very same event synchronously during the current loop.
		self.__ngev.listeners[ event.name ] = self.__ngev.listeners[ event.name ].filter(
			NextGenEvents.filterOutCallback.bind( undefined , listener )
		) ;
		
		if ( removedListeners ) { removedListeners.push( listener ) ; }
		else { emitRemoveListener = true ; }
	}
	
	if ( context && ( context.status === NextGenEvents.CONTEXT_QUEUED || ! context.ready ) )
	{
		// Almost all works should be done by .emit(), and little few should be done by .processQueue()
		context.queue.push( { event: event , listener: listener , nice: currentNice } ) ;
	}
	else
	{
		try {
			if ( currentNice < 0 )
			{
				if ( self.__ngev.recursion >= - currentNice )
				{
					setImmediate( NextGenEvents.listenerWrapper.bind( self , listener , event , context ) ) ;
				}
				else
				{
					NextGenEvents.listenerWrapper.call( self , listener , event , context ) ;
				}
			}
			else
			{
				setTimeout( NextGenEvents.listenerWrapper.bind( self , listener , event , context ) , currentNice ) ;
			}
		}
		catch ( error ) {
			// Catch error, just to decrement self.__ngev.recursion, re-throw after that...
			self.__ngev.recursion -- ;
			throw error ;
		}
	}
	
	// Emit 'removeListener' after calling the listener
	if ( emitRemoveListener && self.__ngev.listeners.removeListener.length )
	{
		self.emit( 'removeListener' , [ listener ] ) ;
	}
} ;



NextGenEvents.prototype.listeners = function listeners( eventName )
{
	if ( ! eventName || typeof eventName !== 'string' ) { throw new TypeError( ".listeners(): argument #0 should be a non-empty string" ) ; }
	
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! this.__ngev.listeners[ eventName ] ) { this.__ngev.listeners[ eventName ] = [] ; }
	
	// Do not return the array, shallow copy it
	return this.__ngev.listeners[ eventName ].slice() ;
} ;



NextGenEvents.listenerCount = function( emitter , eventName )
{
	if ( ! emitter || ! ( emitter instanceof NextGenEvents ) ) { throw new TypeError( ".listenerCount(): argument #0 should be an instance of NextGenEvents" ) ; }
	return emitter.listenerCount( eventName ) ;
} ;



NextGenEvents.prototype.listenerCount = function( eventName )
{
	if ( ! eventName || typeof eventName !== 'string' ) { throw new TypeError( ".listenerCount(): argument #1 should be a non-empty string" ) ; }
	
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! this.__ngev.listeners[ eventName ] ) { this.__ngev.listeners[ eventName ] = [] ; }
	
	return this.__ngev.listeners[ eventName ].length ;
} ;



NextGenEvents.prototype.setNice = function setNice( nice )
{
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	//if ( typeof nice !== 'number' ) { throw new TypeError( ".setNice(): argument #0 should be a number" ) ; }
	
	this.__ngev.nice = Math.floor( +nice || 0 ) ;
} ;



NextGenEvents.prototype.setInterruptible = function setInterruptible( value )
{
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	//if ( typeof nice !== 'number' ) { throw new TypeError( ".setNice(): argument #0 should be a number" ) ; }
	
	this.__ngev.interruptible = !! value ;
} ;



// Make two objects sharing the same event bus
NextGenEvents.share = function( source , target )
{
	if ( ! ( source instanceof NextGenEvents ) || ! ( target instanceof NextGenEvents ) )
	{
		throw new TypeError( 'NextGenEvents.share() arguments should be instances of NextGenEvents' ) ;
	}
	
	if ( ! source.__ngev ) { NextGenEvents.init.call( source ) ; }
	
	Object.defineProperty( target , '__ngev' , {
		configurable: true ,
		value: source.__ngev
	} ) ;
} ;



NextGenEvents.reset = function reset( emitter )
{
	Object.defineProperty( emitter , '__ngev' , {
        configurable: true ,
        value: null
	} ) ;
} ;



// There is no such thing in NextGenEvents, however, we need to be compatible with node.js events at best
NextGenEvents.prototype.setMaxListeners = function() {} ;

// Sometime useful as a no-op callback...
NextGenEvents.noop = function() {} ;





			/* Next Gen feature: states! */



// .defineStates( exclusiveState1 , [exclusiveState2] , [exclusiveState3] , ... )
NextGenEvents.prototype.defineStates = function defineStates()
{
	var self = this ,
		states = Array.prototype.slice.call( arguments ) ;
	
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	
	states.forEach( function( state ) {
		self.__ngev.states[ state ] = null ;
		self.__ngev.stateGroups[ state ] = states ;
	} ) ;
} ;



NextGenEvents.prototype.hasState = function hasState( state )
{
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	return !! this.__ngev.states[ state ] ;
} ;



NextGenEvents.prototype.getAllStates = function getAllStates()
{
	var self = this ;
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	return Object.keys( this.__ngev.states ).filter( function( e ) { return self.__ngev.states[ e ] ; } ) ;
} ;





			/* Next Gen feature: groups! */



NextGenEvents.groupAddListener = function groupAddListener( emitters , eventName , fn , options )
{
	// Manage arguments
	if ( typeof fn !== 'function' ) { options = fn ; fn = undefined ; }
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	fn = fn || options.fn ;
	delete options.fn ;
	
	// Preserve the listener ID, so groupRemoveListener() will work as expected
	options.id = options.id || fn ;
	
	emitters.forEach( function( emitter ) {
		emitter.addListener( eventName , fn.bind( undefined , emitter ) , options ) ;
	} ) ;
} ;

NextGenEvents.groupOn = NextGenEvents.groupAddListener ;



// Once per emitter
NextGenEvents.groupOnce = function groupOnce( emitters , eventName , fn , options )
{
	if ( fn && typeof fn === 'object' ) { fn.once = true ; }
	else if ( options && typeof options === 'object' ) { options.once = true ; }
	else { options = { once: true } ; }
	
	return this.groupAddListener( emitters , eventName , fn , options ) ;
} ;



// Globally once, only one event could be emitted, by the first emitter to emit
NextGenEvents.groupGlobalOnce = function groupGlobalOnce( emitters , eventName , fn , options )
{
	var fnWrapper , triggered = false ;
	
	// Manage arguments
	if ( typeof fn !== 'function' ) { options = fn ; fn = undefined ; }
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	fn = fn || options.fn ;
	delete options.fn ;
	
	// Preserve the listener ID, so groupRemoveListener() will work as expected
	options.id = options.id || fn ;
	
	fnWrapper = function() {
		if ( triggered ) { return ; }
		triggered = true ;
		NextGenEvents.groupRemoveListener( emitters , eventName , options.id ) ;
		fn.apply( undefined , arguments ) ;
	} ;
	
	emitters.forEach( function( emitter ) {
		emitter.once( eventName , fnWrapper.bind( undefined , emitter ) , options ) ;
	} ) ;
} ;



// Globally once, only one event could be emitted, by the last emitter to emit
NextGenEvents.groupGlobalOnceAll = function groupGlobalOnceAll( emitters , eventName , fn , options )
{
	var fnWrapper , triggered = false , count = emitters.length ;
	
	// Manage arguments
	if ( typeof fn !== 'function' ) { options = fn ; fn = undefined ; }
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	fn = fn || options.fn ;
	delete options.fn ;
	
	// Preserve the listener ID, so groupRemoveListener() will work as expected
	options.id = options.id || fn ;
	
	fnWrapper = function() {
		if ( triggered ) { return ; }
		if ( -- count ) { return ; }
		
		// So this is the last emitter...
		
		triggered = true ;
		// No need to remove listeners: there are already removed anyway
		//NextGenEvents.groupRemoveListener( emitters , eventName , options.id ) ;
		fn.apply( undefined , arguments ) ;
	} ;
	
	emitters.forEach( function( emitter ) {
		emitter.once( eventName , fnWrapper.bind( undefined , emitter ) , options ) ;
	} ) ;
} ;



NextGenEvents.groupRemoveListener = function groupRemoveListener( emitters , eventName , id )
{
	emitters.forEach( function( emitter ) {
		emitter.removeListener( eventName , id ) ;
	} ) ;
} ;

NextGenEvents.groupOff = NextGenEvents.groupRemoveListener ;



NextGenEvents.groupRemoveAllListeners = function groupRemoveAllListeners( emitters , eventName )
{
	emitters.forEach( function( emitter ) {
		emitter.removeAllListeners( eventName ) ;
	} ) ;
} ;



NextGenEvents.groupEmit = function groupEmit( emitters )
{
	var eventName , nice , argStart = 2 , argEnd , args , count = emitters.length ,
		callback , callbackWrapper , callbackTriggered = false ;
	
	if ( typeof arguments[ arguments.length - 1 ] === 'function' )
	{
		argEnd = -1 ;
		callback = arguments[ arguments.length - 1 ] ;
		
		callbackWrapper = function( interruption ) {
			if ( callbackTriggered ) { return ; }
			
			if ( interruption )
			{
				callbackTriggered = true ;
				callback( interruption ) ;
			}
			else if ( ! -- count )
			{
				callbackTriggered = true ;
				callback() ;
			}
		} ;
	}
	
	if ( typeof arguments[ 1 ] === 'number' )
	{
		argStart = 3 ;
		nice = typeof arguments[ 1 ] ;
	}
	
	eventName = arguments[ argStart - 1 ] ;
	args = Array.prototype.slice.call( arguments , argStart , argEnd ) ;
	
	emitters.forEach( function( emitter ) {
		NextGenEvents.emitEvent( {
			emitter: emitter ,
			name: eventName ,
			args: args ,
			nice: nice ,
			callback: callbackWrapper
		} ) ;
	} ) ;
} ;



NextGenEvents.groupDefineStates = function groupDefineStates( emitters )
{
	var args = Array.prototype.slice.call( arguments , 1 ) ;
	
	emitters.forEach( function( emitter ) {
		emitter.defineStates.apply( emitter , args ) ;
	} ) ;
} ;





			/* Next Gen feature: contexts! */



NextGenEvents.CONTEXT_ENABLED = 0 ;
NextGenEvents.CONTEXT_DISABLED = 1 ;
NextGenEvents.CONTEXT_QUEUED = 2 ;



NextGenEvents.prototype.addListenerContext = function addListenerContext( contextName , options )
{
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	
	if ( ! contextName || typeof contextName !== 'string' ) { throw new TypeError( ".addListenerContext(): argument #0 should be a non-empty string" ) ; }
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	if ( ! this.__ngev.contexts[ contextName ] )
	{
		// A context IS an event emitter too!
		this.__ngev.contexts[ contextName ] = Object.create( NextGenEvents.prototype ) ;
		this.__ngev.contexts[ contextName ].nice = NextGenEvents.SYNC ;
		this.__ngev.contexts[ contextName ].ready = true ;
		this.__ngev.contexts[ contextName ].status = NextGenEvents.CONTEXT_ENABLED ;
		this.__ngev.contexts[ contextName ].serial = false ;
		this.__ngev.contexts[ contextName ].queue = [] ;
	}
	
	if ( options.nice !== undefined ) { this.__ngev.contexts[ contextName ].nice = Math.floor( options.nice ) ; }
	if ( options.status !== undefined ) { this.__ngev.contexts[ contextName ].status = options.status ; }
	if ( options.serial !== undefined ) { this.__ngev.contexts[ contextName ].serial = !! options.serial ; }
	
	return this ;
} ;



NextGenEvents.prototype.disableListenerContext = function disableListenerContext( contextName )
{
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! contextName || typeof contextName !== 'string' ) { throw new TypeError( ".disableListenerContext(): argument #0 should be a non-empty string" ) ; }
	if ( ! this.__ngev.contexts[ contextName ] ) { this.addListenerContext( contextName ) ; }
	
	this.__ngev.contexts[ contextName ].status = NextGenEvents.CONTEXT_DISABLED ;
	
	return this ;
} ;



NextGenEvents.prototype.enableListenerContext = function enableListenerContext( contextName )
{
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! contextName || typeof contextName !== 'string' ) { throw new TypeError( ".enableListenerContext(): argument #0 should be a non-empty string" ) ; }
	if ( ! this.__ngev.contexts[ contextName ] ) { this.addListenerContext( contextName ) ; }
	
	this.__ngev.contexts[ contextName ].status = NextGenEvents.CONTEXT_ENABLED ;
	
	if ( this.__ngev.contexts[ contextName ].queue.length > 0 ) { NextGenEvents.processQueue.call( this , contextName ) ; }
	
	return this ;
} ;



NextGenEvents.prototype.queueListenerContext = function queueListenerContext( contextName )
{
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! contextName || typeof contextName !== 'string' ) { throw new TypeError( ".queueListenerContext(): argument #0 should be a non-empty string" ) ; }
	if ( ! this.__ngev.contexts[ contextName ] ) { this.addListenerContext( contextName ) ; }
	
	this.__ngev.contexts[ contextName ].status = NextGenEvents.CONTEXT_QUEUED ;
	
	return this ;
} ;



NextGenEvents.prototype.serializeListenerContext = function serializeListenerContext( contextName , value )
{
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! contextName || typeof contextName !== 'string' ) { throw new TypeError( ".serializeListenerContext(): argument #0 should be a non-empty string" ) ; }
	if ( ! this.__ngev.contexts[ contextName ] ) { this.addListenerContext( contextName ) ; }
	
	this.__ngev.contexts[ contextName ].serial = value === undefined ? true : !! value ;
	
	return this ;
} ;



NextGenEvents.prototype.setListenerContextNice = function setListenerContextNice( contextName , nice )
{
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	if ( ! contextName || typeof contextName !== 'string' ) { throw new TypeError( ".setListenerContextNice(): argument #0 should be a non-empty string" ) ; }
	if ( ! this.__ngev.contexts[ contextName ] ) { this.addListenerContext( contextName ) ; }
	
	this.__ngev.contexts[ contextName ].nice = Math.floor( nice ) ;
	
	return this ;
} ;



NextGenEvents.prototype.destroyListenerContext = function destroyListenerContext( contextName )
{
	var i , length , eventName , newListeners , removedListeners = [] ;
	
	if ( ! contextName || typeof contextName !== 'string' ) { throw new TypeError( ".disableListenerContext(): argument #0 should be a non-empty string" ) ; }
	
	if ( ! this.__ngev ) { NextGenEvents.init.call( this ) ; }
	
	// We don't care if a context actually exists, all listeners tied to that contextName will be removed
	
	for ( eventName in this.__ngev.listeners )
	{
		newListeners = null ;
		length = this.__ngev.listeners[ eventName ].length ;
		
		for ( i = 0 ; i < length ; i ++ )
		{
			if ( this.__ngev.listeners[ eventName ][ i ].context === contextName )
			{
				newListeners = [] ;
				removedListeners.push( this.__ngev.listeners[ eventName ][ i ] ) ;
			}
			else if ( newListeners )
			{
				newListeners.push( this.__ngev.listeners[ eventName ][ i ] ) ;
			}
		}
		
		if ( newListeners ) { this.__ngev.listeners[ eventName ] = newListeners ; }
	}
	
	if ( this.__ngev.contexts[ contextName ] ) { delete this.__ngev.contexts[ contextName ] ; }
	
	if ( removedListeners.length && this.__ngev.listeners.removeListener.length )
	{
		this.emit( 'removeListener' , removedListeners ) ;
	}
	
	return this ;
} ;



// To be used with .call(), it should not pollute the prototype
NextGenEvents.processQueue = function processQueue( contextName , isCompletionCallback )
{
	var context , job ;
	
	// The context doesn't exist anymore, so just abort now
	if ( ! this.__ngev.contexts[ contextName ] ) { return ; }
	
	context = this.__ngev.contexts[ contextName ] ;
	
	if ( isCompletionCallback ) { context.ready = true ; }
	
	// Should work on serialization here
	
	//console.log( ">>> " , context ) ;
	
	// Increment recursion
	this.__ngev.recursion ++ ;
	
	while ( context.ready && context.queue.length )
	{
		job = context.queue.shift() ;
		
		// This event has been interrupted, drop it now!
		if ( job.event.interrupt ) { continue ; }
		
		try {
			if ( job.nice < 0 )
			{
				if ( this.__ngev.recursion >= - job.nice )
				{
					setImmediate( NextGenEvents.listenerWrapper.bind( this , job.listener , job.event , context ) ) ;
				}
				else
				{
					NextGenEvents.listenerWrapper.call( this , job.listener , job.event , context ) ;
				}
			}
			else
			{
				setTimeout( NextGenEvents.listenerWrapper.bind( this , job.listener , job.event , context ) , job.nice ) ;
			}
		}
		catch ( error ) {
			// Catch error, just to decrement this.__ngev.recursion, re-throw after that...
			this.__ngev.recursion -- ;
			throw error ;
		}
	}
	
	// Decrement recursion
	this.__ngev.recursion -- ;
} ;



// Backup for the AsyncTryCatch
NextGenEvents.on = NextGenEvents.prototype.on ;
NextGenEvents.once = NextGenEvents.prototype.once ;
NextGenEvents.off = NextGenEvents.prototype.off ;



if ( global.AsyncTryCatch )
{
	NextGenEvents.prototype.asyncTryCatchId = global.AsyncTryCatch.NextGenEvents.length ;
	global.AsyncTryCatch.NextGenEvents.push( NextGenEvents ) ;
	
	if ( global.AsyncTryCatch.substituted )
	{
		//console.log( 'live subsitute' ) ;
		global.AsyncTryCatch.substitute() ;
	}
}



// Load Proxy AT THE END (circular require)
NextGenEvents.Proxy = require( './Proxy.js' ) ;


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../package.json":5,"./Proxy.js":2}],2:[function(require,module,exports){
/*
	Next Gen Events
	
	Copyright (c) 2015 - 2016 Cédric Ronvel
	
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



// Create the object && export it
function Proxy() { return Proxy.create() ; }
module.exports = Proxy ;

var NextGenEvents = require( './NextGenEvents.js' ) ;
var MESSAGE_TYPE = 'NextGenEvents/message' ;

function noop() {}



Proxy.create = function create()
{
	var self = Object.create( Proxy.prototype , {
		localServices: { value: {} , enumerable: true } ,
		remoteServices: { value: {} , enumerable: true } ,
		nextAckId: { value: 1 , writable: true , enumerable: true } ,
	} ) ;
	
	return self ;
} ;



// Add a local service accessible remotely
Proxy.prototype.addLocalService = function addLocalService( id , emitter , options )
{
	this.localServices[ id ] = LocalService.create( this , id , emitter , options ) ;
	return this.localServices[ id ] ;
} ;



// Add a remote service accessible locally
Proxy.prototype.addRemoteService = function addRemoteService( id )
{
	this.remoteServices[ id ] = RemoteService.create( this , id ) ;
	return this.remoteServices[ id ] ;
} ;



// Destroy the proxy
Proxy.prototype.destroy = function destroy()
{
	var self = this ;
	
	Object.keys( this.localServices ).forEach( function( id ) {
		self.localServices[ id ].destroy() ;
		delete self.localServices[ id ] ;
	} ) ;
	
	Object.keys( this.remoteServices ).forEach( function( id ) {
		self.remoteServices[ id ].destroy() ;
		delete self.remoteServices[ id ] ;
	} ) ;
	
	this.receive = this.send = noop ;
} ;



// Push an event message.
Proxy.prototype.push = function push( message )
{
	if (
		message.__type !== MESSAGE_TYPE ||
		! message.service || typeof message.service !== 'string' ||
		! message.event || typeof message.event !== 'string' ||
		! message.method
	)
	{
		return ;
	}
	
	switch ( message.method )
	{
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
			
		default:
		 	return ;
	}
} ;



// This is the method to receive and decode data from the other side of the communication channel, most of time another proxy.
// In most case, this should be overwritten.
Proxy.prototype.receive = function receive( raw )
{
	this.push( raw ) ;
} ;



// This is the method used to send data to the other side of the communication channel, most of time another proxy.
// This MUST be overwritten in any case.
Proxy.prototype.send = function send()
{
	throw new Error( 'The send() method of the Proxy MUST be extended/overwritten' ) ;
} ;



			/* Local Service */



function LocalService( proxy , id , emitter , options ) { return LocalService.create( proxy , id , emitter , options ) ; }
Proxy.LocalService = LocalService ;



LocalService.create = function create( proxy , id , emitter , options )
{
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
		destroyed: { value: false , writable: true , enumerable: true } ,
	} ) ;
	
	return self ;
} ;



// Destroy a service
LocalService.prototype.destroy = function destroy()
{
	var self = this ;
	
	Object.keys( this.events ).forEach( function( eventName ) {
		self.emitter.off( eventName , self.events[ eventName ] ) ;
		delete self.events[ eventName ] ;
	} ) ;
	
	this.emitter = null ;
	this.destroyed = true ;
} ;



// Remote want to emit on the local service
LocalService.prototype.receiveEmit = function receiveEmit( message )
{
	if ( this.destroyed || ! this.canEmit || ( message.ack && ! this.canAck ) ) { return ; }
	
	var self = this ;
	
	var event = {
		emitter: this.emitter ,
		name: message.event ,
		args: message.args || [] 
	} ;
	
	if ( message.ack )
	{
		event.callback = function ack( interruption ) {
			
			self.proxy.send( {
				__type: MESSAGE_TYPE ,
				service: self.id ,
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
LocalService.prototype.receiveListen = function receiveListen( message )
{
	if ( this.destroyed || ! this.canListen || ( message.ack && ! this.canAck ) ) { return ; }
	
	if ( message.ack )
	{
		if ( this.events[ message.event ] )
		{
			if ( this.events[ message.event ].ack ) { return ; }
			
			// There is already an event, but not featuring ack, remove that listener now
			this.emitter.off( message.event , this.events[ message.event ] ) ;
		}
		
		this.events[ message.event ] = LocalService.forwardWithAck.bind( this ) ;
		this.events[ message.event ].ack = true ;
		this.emitter.on( message.event , this.events[ message.event ] , { eventObject: true , async: true } ) ;
	}
	else
	{
		if ( this.events[ message.event ] )
		{
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
LocalService.prototype.receiveIgnore = function receiveIgnore( message )
{
	if ( this.destroyed || ! this.canListen ) { return ; }
	
	if ( ! this.events[ message.event ] ) { return ; }
	
	this.emitter.off( message.event , this.events[ message.event ] ) ;
	this.events[ message.event ] = null ;
} ;



// 
LocalService.prototype.receiveAckEvent = function receiveAckEvent( message )
{
	if (
		this.destroyed || ! this.canListen || ! this.canAck || ! message.ack ||
		! this.events[ message.event ] || ! this.events[ message.event ].ack
	)
	{
		return ;
	}
	
	this.internalEvents.emit( 'ack' , message ) ;
} ;



// Send an event from the local service to remote
LocalService.forward = function forward( event )
{
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
LocalService.forwardWithAck = function forwardWithAck( event , callback )
{
	if ( this.destroyed ) { return ; }
	
	var self = this ;
	
	if ( ! event.callback )
	{
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
	
	var onAck = function onAck( message ) {
		if ( triggered || message.ack !== ackId ) { return ; }	// Not our ack...
		//if ( message.event !== event ) { return ; }	// Do we care?
		triggered = true ;
		self.internalEvents.off( 'ack' , onAck ) ;
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



RemoteService.create = function create( proxy , id )
{
	var self = Object.create( RemoteService.prototype , {
		proxy: { value: proxy , enumerable: true } ,
		id: { value: id , enumerable: true } ,
		// This is the emitter where everything is routed to
		emitter: { value: Object.create( NextGenEvents.prototype ) , writable: true , enumerable: true } ,
		internalEvents: { value: Object.create( NextGenEvents.prototype ) , writable: true , enumerable: true } ,
		events: { value: {} , enumerable: true } ,
		destroyed: { value: false , writable: true , enumerable: true } ,
		
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
RemoteService.prototype.destroy = function destroy()
{
	var self = this ;
	this.emitter.removeAllListeners() ;
	this.emitter = null ;
	Object.keys( this.events ).forEach( function( eventName ) { delete self.events[ eventName ] ; } ) ;
	this.destroyed = true ;
} ;



// Local code want to emit to remote service
RemoteService.prototype.emit = function emit( eventName )
{
	if ( this.destroyed ) { return ; }
	
	var self = this , args , callback , ackId , triggered ;
	
	if ( typeof eventName === 'number' ) { throw new TypeError( 'Cannot emit with a nice value on a remote service' ) ; }
	
	if ( typeof arguments[ arguments.length - 1 ] !== 'function' )
	{
		args = Array.prototype.slice.call( arguments , 1 ) ;
		
		this.proxy.send( {
			__type: MESSAGE_TYPE ,
			service: this.id ,
			method: 'emit' ,
			event: eventName ,
			args: args
		} ) ;
		
		return ;
	}
	
	args = Array.prototype.slice.call( arguments , 1 , -1 ) ;
	callback = arguments[ arguments.length - 1 ] ;
	ackId = this.proxy.nextAckId ++ ;
	triggered = false ;
	
	var onAck = function onAck( message ) {
		if ( triggered || message.ack !== ackId ) { return ; }	// Not our ack...
		//if ( message.event !== event ) { return ; }	// Do we care?
		triggered = true ;
		self.internalEvents.off( 'ack' , onAck ) ;
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
RemoteService.prototype.addListener = function addListener( eventName , fn , options )
{
	if ( this.destroyed ) { return ; }
	
	// Manage arguments the same way NextGenEvents#addListener() does
	if ( typeof fn !== 'function' ) { options = fn ; fn = undefined ; }
	if ( ! options || typeof options !== 'object' ) { options = {} ; }
	options.fn = fn || options.fn ;
	
	this.emitter.addListener( eventName , options ) ;
	
	// No event was added...
	if ( ! this.emitter.__ngev.listeners[ eventName ] || ! this.emitter.__ngev.listeners[ eventName ].length ) { return ; }
	
	// If the event is successfully listened to and was not remotely listened...
	if ( options.async && this.events[ eventName ] !== EVENT_ACK )
	{
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
	else if ( ! options.async && ! this.events[ eventName ] )
	{
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
RemoteService.prototype.removeListener = function removeListener( eventName , id )
{
	if ( this.destroyed ) { return ; }
	
	this.emitter.removeListener( eventName , id ) ;
	
	// If no more listener are locally tied to with event and the event was remotely listened...
	if (
		( ! this.emitter.__ngev.listeners[ eventName ] || ! this.emitter.__ngev.listeners[ eventName ].length ) &&
		this.events[ eventName ]
	)
	{
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
RemoteService.prototype.receiveEvent = function receiveEvent( message )
{
	var self = this ;
	
	if ( this.destroyed || ! this.events[ message.event ] ) { return ; }
	
	var event = {
		emitter: this.emitter ,
		name: message.event ,
		args: message.args || [] 
	} ;
	
	if ( message.ack )
	{
		event.callback = function ack() {
			
			self.proxy.send( {
				__type: MESSAGE_TYPE ,
				service: self.id ,
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
	if ( ! this.emitter.__ngev.listeners[ eventName ] || ! this.emitter.__ngev.listeners[ eventName ].length )
	{
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
RemoteService.prototype.receiveAckEmit = function receiveAckEmit( message )
{
	if ( this.destroyed || ! message.ack || this.events[ message.event ] !== EVENT_ACK )
	{
		return ;
	}
	
	this.internalEvents.emit( 'ack' , message ) ;
} ;



},{"./NextGenEvents.js":1}],3:[function(require,module,exports){
/*
	Next Gen Events
	
	Copyright (c) 2015 - 2016 Cédric Ronvel
	
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

/* global window */



if ( typeof window.setImmediate !== 'function' )
{
	window.setImmediate = function setImmediate( fn ) {
		setTimeout( fn , 0 ) ;
	} ;
}

module.exports = require( './NextGenEvents.js' ) ;
module.exports.isBrowser = true ;

},{"./NextGenEvents.js":1}],4:[function(require,module,exports){
(function (Buffer){
(function (global, module) {

  var exports = module.exports;

  /**
   * Exports.
   */

  module.exports = expect;
  expect.Assertion = Assertion;

  /**
   * Exports version.
   */

  expect.version = '0.3.1';

  /**
   * Possible assertion flags.
   */

  var flags = {
      not: ['to', 'be', 'have', 'include', 'only']
    , to: ['be', 'have', 'include', 'only', 'not']
    , only: ['have']
    , have: ['own']
    , be: ['an']
  };

  function expect (obj) {
    return new Assertion(obj);
  }

  /**
   * Constructor
   *
   * @api private
   */

  function Assertion (obj, flag, parent) {
    this.obj = obj;
    this.flags = {};

    if (undefined != parent) {
      this.flags[flag] = true;

      for (var i in parent.flags) {
        if (parent.flags.hasOwnProperty(i)) {
          this.flags[i] = true;
        }
      }
    }

    var $flags = flag ? flags[flag] : keys(flags)
      , self = this;

    if ($flags) {
      for (var i = 0, l = $flags.length; i < l; i++) {
        // avoid recursion
        if (this.flags[$flags[i]]) continue;

        var name = $flags[i]
          , assertion = new Assertion(this.obj, name, this)

        if ('function' == typeof Assertion.prototype[name]) {
          // clone the function, make sure we dont touch the prot reference
          var old = this[name];
          this[name] = function () {
            return old.apply(self, arguments);
          };

          for (var fn in Assertion.prototype) {
            if (Assertion.prototype.hasOwnProperty(fn) && fn != name) {
              this[name][fn] = bind(assertion[fn], assertion);
            }
          }
        } else {
          this[name] = assertion;
        }
      }
    }
  }

  /**
   * Performs an assertion
   *
   * @api private
   */

  Assertion.prototype.assert = function (truth, msg, error, expected) {
    var msg = this.flags.not ? error : msg
      , ok = this.flags.not ? !truth : truth
      , err;

    if (!ok) {
      err = new Error(msg.call(this));
      if (arguments.length > 3) {
        err.actual = this.obj;
        err.expected = expected;
        err.showDiff = true;
      }
      throw err;
    }

    this.and = new Assertion(this.obj);
  };

  /**
   * Check if the value is truthy
   *
   * @api public
   */

  Assertion.prototype.ok = function () {
    this.assert(
        !!this.obj
      , function(){ return 'expected ' + i(this.obj) + ' to be truthy' }
      , function(){ return 'expected ' + i(this.obj) + ' to be falsy' });
  };

  /**
   * Creates an anonymous function which calls fn with arguments.
   *
   * @api public
   */

  Assertion.prototype.withArgs = function() {
    expect(this.obj).to.be.a('function');
    var fn = this.obj;
    var args = Array.prototype.slice.call(arguments);
    return expect(function() { fn.apply(null, args); });
  };

  /**
   * Assert that the function throws.
   *
   * @param {Function|RegExp} callback, or regexp to match error string against
   * @api public
   */

  Assertion.prototype.throwError =
  Assertion.prototype.throwException = function (fn) {
    expect(this.obj).to.be.a('function');

    var thrown = false
      , not = this.flags.not;

    try {
      this.obj();
    } catch (e) {
      if (isRegExp(fn)) {
        var subject = 'string' == typeof e ? e : e.message;
        if (not) {
          expect(subject).to.not.match(fn);
        } else {
          expect(subject).to.match(fn);
        }
      } else if ('function' == typeof fn) {
        fn(e);
      }
      thrown = true;
    }

    if (isRegExp(fn) && not) {
      // in the presence of a matcher, ensure the `not` only applies to
      // the matching.
      this.flags.not = false;
    }

    var name = this.obj.name || 'fn';
    this.assert(
        thrown
      , function(){ return 'expected ' + name + ' to throw an exception' }
      , function(){ return 'expected ' + name + ' not to throw an exception' });
  };

  /**
   * Checks if the array is empty.
   *
   * @api public
   */

  Assertion.prototype.empty = function () {
    var expectation;

    if ('object' == typeof this.obj && null !== this.obj && !isArray(this.obj)) {
      if ('number' == typeof this.obj.length) {
        expectation = !this.obj.length;
      } else {
        expectation = !keys(this.obj).length;
      }
    } else {
      if ('string' != typeof this.obj) {
        expect(this.obj).to.be.an('object');
      }

      expect(this.obj).to.have.property('length');
      expectation = !this.obj.length;
    }

    this.assert(
        expectation
      , function(){ return 'expected ' + i(this.obj) + ' to be empty' }
      , function(){ return 'expected ' + i(this.obj) + ' to not be empty' });
    return this;
  };

  /**
   * Checks if the obj exactly equals another.
   *
   * @api public
   */

  Assertion.prototype.be =
  Assertion.prototype.equal = function (obj) {
    this.assert(
        obj === this.obj
      , function(){ return 'expected ' + i(this.obj) + ' to equal ' + i(obj) }
      , function(){ return 'expected ' + i(this.obj) + ' to not equal ' + i(obj) });
    return this;
  };

  /**
   * Checks if the obj sortof equals another.
   *
   * @api public
   */

  Assertion.prototype.eql = function (obj) {
    this.assert(
        expect.eql(this.obj, obj)
      , function(){ return 'expected ' + i(this.obj) + ' to sort of equal ' + i(obj) }
      , function(){ return 'expected ' + i(this.obj) + ' to sort of not equal ' + i(obj) }
      , obj);
    return this;
  };

  /**
   * Assert within start to finish (inclusive).
   *
   * @param {Number} start
   * @param {Number} finish
   * @api public
   */

  Assertion.prototype.within = function (start, finish) {
    var range = start + '..' + finish;
    this.assert(
        this.obj >= start && this.obj <= finish
      , function(){ return 'expected ' + i(this.obj) + ' to be within ' + range }
      , function(){ return 'expected ' + i(this.obj) + ' to not be within ' + range });
    return this;
  };

  /**
   * Assert typeof / instance of
   *
   * @api public
   */

  Assertion.prototype.a =
  Assertion.prototype.an = function (type) {
    if ('string' == typeof type) {
      // proper english in error msg
      var n = /^[aeiou]/.test(type) ? 'n' : '';

      // typeof with support for 'array'
      this.assert(
          'array' == type ? isArray(this.obj) :
            'regexp' == type ? isRegExp(this.obj) :
              'object' == type
                ? 'object' == typeof this.obj && null !== this.obj
                : type == typeof this.obj
        , function(){ return 'expected ' + i(this.obj) + ' to be a' + n + ' ' + type }
        , function(){ return 'expected ' + i(this.obj) + ' not to be a' + n + ' ' + type });
    } else {
      // instanceof
      var name = type.name || 'supplied constructor';
      this.assert(
          this.obj instanceof type
        , function(){ return 'expected ' + i(this.obj) + ' to be an instance of ' + name }
        , function(){ return 'expected ' + i(this.obj) + ' not to be an instance of ' + name });
    }

    return this;
  };

  /**
   * Assert numeric value above _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.greaterThan =
  Assertion.prototype.above = function (n) {
    this.assert(
        this.obj > n
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n }
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n });
    return this;
  };

  /**
   * Assert numeric value below _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.lessThan =
  Assertion.prototype.below = function (n) {
    this.assert(
        this.obj < n
      , function(){ return 'expected ' + i(this.obj) + ' to be below ' + n }
      , function(){ return 'expected ' + i(this.obj) + ' to be above ' + n });
    return this;
  };

  /**
   * Assert string value matches _regexp_.
   *
   * @param {RegExp} regexp
   * @api public
   */

  Assertion.prototype.match = function (regexp) {
    this.assert(
        regexp.exec(this.obj)
      , function(){ return 'expected ' + i(this.obj) + ' to match ' + regexp }
      , function(){ return 'expected ' + i(this.obj) + ' not to match ' + regexp });
    return this;
  };

  /**
   * Assert property "length" exists and has value of _n_.
   *
   * @param {Number} n
   * @api public
   */

  Assertion.prototype.length = function (n) {
    expect(this.obj).to.have.property('length');
    var len = this.obj.length;
    this.assert(
        n == len
      , function(){ return 'expected ' + i(this.obj) + ' to have a length of ' + n + ' but got ' + len }
      , function(){ return 'expected ' + i(this.obj) + ' to not have a length of ' + len });
    return this;
  };

  /**
   * Assert property _name_ exists, with optional _val_.
   *
   * @param {String} name
   * @param {Mixed} val
   * @api public
   */

  Assertion.prototype.property = function (name, val) {
    if (this.flags.own) {
      this.assert(
          Object.prototype.hasOwnProperty.call(this.obj, name)
        , function(){ return 'expected ' + i(this.obj) + ' to have own property ' + i(name) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have own property ' + i(name) });
      return this;
    }

    if (this.flags.not && undefined !== val) {
      if (undefined === this.obj[name]) {
        throw new Error(i(this.obj) + ' has no property ' + i(name));
      }
    } else {
      var hasProp;
      try {
        hasProp = name in this.obj
      } catch (e) {
        hasProp = undefined !== this.obj[name]
      }

      this.assert(
          hasProp
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name) });
    }

    if (undefined !== val) {
      this.assert(
          val === this.obj[name]
        , function(){ return 'expected ' + i(this.obj) + ' to have a property ' + i(name)
          + ' of ' + i(val) + ', but got ' + i(this.obj[name]) }
        , function(){ return 'expected ' + i(this.obj) + ' to not have a property ' + i(name)
          + ' of ' + i(val) });
    }

    this.obj = this.obj[name];
    return this;
  };

  /**
   * Assert that the array contains _obj_ or string contains _obj_.
   *
   * @param {Mixed} obj|string
   * @api public
   */

  Assertion.prototype.string =
  Assertion.prototype.contain = function (obj) {
    if ('string' == typeof this.obj) {
      this.assert(
          ~this.obj.indexOf(obj)
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
    } else {
      this.assert(
          ~indexOf(this.obj, obj)
        , function(){ return 'expected ' + i(this.obj) + ' to contain ' + i(obj) }
        , function(){ return 'expected ' + i(this.obj) + ' to not contain ' + i(obj) });
    }
    return this;
  };

  /**
   * Assert exact keys or inclusion of keys by using
   * the `.own` modifier.
   *
   * @param {Array|String ...} keys
   * @api public
   */

  Assertion.prototype.key =
  Assertion.prototype.keys = function ($keys) {
    var str
      , ok = true;

    $keys = isArray($keys)
      ? $keys
      : Array.prototype.slice.call(arguments);

    if (!$keys.length) throw new Error('keys required');

    var actual = keys(this.obj)
      , len = $keys.length;

    // Inclusion
    ok = every($keys, function (key) {
      return ~indexOf(actual, key);
    });

    // Strict
    if (!this.flags.not && this.flags.only) {
      ok = ok && $keys.length == actual.length;
    }

    // Key string
    if (len > 1) {
      $keys = map($keys, function (key) {
        return i(key);
      });
      var last = $keys.pop();
      str = $keys.join(', ') + ', and ' + last;
    } else {
      str = i($keys[0]);
    }

    // Form
    str = (len > 1 ? 'keys ' : 'key ') + str;

    // Have / include
    str = (!this.flags.only ? 'include ' : 'only have ') + str;

    // Assertion
    this.assert(
        ok
      , function(){ return 'expected ' + i(this.obj) + ' to ' + str }
      , function(){ return 'expected ' + i(this.obj) + ' to not ' + str });

    return this;
  };

  /**
   * Assert a failure.
   *
   * @param {String ...} custom message
   * @api public
   */
  Assertion.prototype.fail = function (msg) {
    var error = function() { return msg || "explicit failure"; }
    this.assert(false, error, error);
    return this;
  };

  /**
   * Function bind implementation.
   */

  function bind (fn, scope) {
    return function () {
      return fn.apply(scope, arguments);
    }
  }

  /**
   * Array every compatibility
   *
   * @see bit.ly/5Fq1N2
   * @api public
   */

  function every (arr, fn, thisObj) {
    var scope = thisObj || global;
    for (var i = 0, j = arr.length; i < j; ++i) {
      if (!fn.call(scope, arr[i], i, arr)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Array indexOf compatibility.
   *
   * @see bit.ly/a5Dxa2
   * @api public
   */

  function indexOf (arr, o, i) {
    if (Array.prototype.indexOf) {
      return Array.prototype.indexOf.call(arr, o, i);
    }

    if (arr.length === undefined) {
      return -1;
    }

    for (var j = arr.length, i = i < 0 ? i + j < 0 ? 0 : i + j : i || 0
        ; i < j && arr[i] !== o; i++);

    return j <= i ? -1 : i;
  }

  // https://gist.github.com/1044128/
  var getOuterHTML = function(element) {
    if ('outerHTML' in element) return element.outerHTML;
    var ns = "http://www.w3.org/1999/xhtml";
    var container = document.createElementNS(ns, '_');
    var xmlSerializer = new XMLSerializer();
    var html;
    if (document.xmlVersion) {
      return xmlSerializer.serializeToString(element);
    } else {
      container.appendChild(element.cloneNode(false));
      html = container.innerHTML.replace('><', '>' + element.innerHTML + '<');
      container.innerHTML = '';
      return html;
    }
  };

  // Returns true if object is a DOM element.
  var isDOMElement = function (object) {
    if (typeof HTMLElement === 'object') {
      return object instanceof HTMLElement;
    } else {
      return object &&
        typeof object === 'object' &&
        object.nodeType === 1 &&
        typeof object.nodeName === 'string';
    }
  };

  /**
   * Inspects an object.
   *
   * @see taken from node.js `util` module (copyright Joyent, MIT license)
   * @api private
   */

  function i (obj, showHidden, depth) {
    var seen = [];

    function stylize (str) {
      return str;
    }

    function format (value, recurseTimes) {
      // Provide a hook for user-specified inspect functions.
      // Check that value is an object with an inspect function on it
      if (value && typeof value.inspect === 'function' &&
          // Filter out the util module, it's inspect function is special
          value !== exports &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
        return value.inspect(recurseTimes);
      }

      // Primitive types cannot have properties
      switch (typeof value) {
        case 'undefined':
          return stylize('undefined', 'undefined');

        case 'string':
          var simple = '\'' + json.stringify(value).replace(/^"|"$/g, '')
                                                   .replace(/'/g, "\\'")
                                                   .replace(/\\"/g, '"') + '\'';
          return stylize(simple, 'string');

        case 'number':
          return stylize('' + value, 'number');

        case 'boolean':
          return stylize('' + value, 'boolean');
      }
      // For some reason typeof null is "object", so special case here.
      if (value === null) {
        return stylize('null', 'null');
      }

      if (isDOMElement(value)) {
        return getOuterHTML(value);
      }

      // Look up the keys of the object.
      var visible_keys = keys(value);
      var $keys = showHidden ? Object.getOwnPropertyNames(value) : visible_keys;

      // Functions without properties can be shortcutted.
      if (typeof value === 'function' && $keys.length === 0) {
        if (isRegExp(value)) {
          return stylize('' + value, 'regexp');
        } else {
          var name = value.name ? ': ' + value.name : '';
          return stylize('[Function' + name + ']', 'special');
        }
      }

      // Dates without properties can be shortcutted
      if (isDate(value) && $keys.length === 0) {
        return stylize(value.toUTCString(), 'date');
      }
      
      // Error objects can be shortcutted
      if (value instanceof Error) {
        return stylize("["+value.toString()+"]", 'Error');
      }

      var base, type, braces;
      // Determine the object type
      if (isArray(value)) {
        type = 'Array';
        braces = ['[', ']'];
      } else {
        type = 'Object';
        braces = ['{', '}'];
      }

      // Make functions say that they are functions
      if (typeof value === 'function') {
        var n = value.name ? ': ' + value.name : '';
        base = (isRegExp(value)) ? ' ' + value : ' [Function' + n + ']';
      } else {
        base = '';
      }

      // Make dates with properties first say the date
      if (isDate(value)) {
        base = ' ' + value.toUTCString();
      }

      if ($keys.length === 0) {
        return braces[0] + base + braces[1];
      }

      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return stylize('' + value, 'regexp');
        } else {
          return stylize('[Object]', 'special');
        }
      }

      seen.push(value);

      var output = map($keys, function (key) {
        var name, str;
        if (value.__lookupGetter__) {
          if (value.__lookupGetter__(key)) {
            if (value.__lookupSetter__(key)) {
              str = stylize('[Getter/Setter]', 'special');
            } else {
              str = stylize('[Getter]', 'special');
            }
          } else {
            if (value.__lookupSetter__(key)) {
              str = stylize('[Setter]', 'special');
            }
          }
        }
        if (indexOf(visible_keys, key) < 0) {
          name = '[' + key + ']';
        }
        if (!str) {
          if (indexOf(seen, value[key]) < 0) {
            if (recurseTimes === null) {
              str = format(value[key]);
            } else {
              str = format(value[key], recurseTimes - 1);
            }
            if (str.indexOf('\n') > -1) {
              if (isArray(value)) {
                str = map(str.split('\n'), function (line) {
                  return '  ' + line;
                }).join('\n').substr(2);
              } else {
                str = '\n' + map(str.split('\n'), function (line) {
                  return '   ' + line;
                }).join('\n');
              }
            }
          } else {
            str = stylize('[Circular]', 'special');
          }
        }
        if (typeof name === 'undefined') {
          if (type === 'Array' && key.match(/^\d+$/)) {
            return str;
          }
          name = json.stringify('' + key);
          if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
            name = name.substr(1, name.length - 2);
            name = stylize(name, 'name');
          } else {
            name = name.replace(/'/g, "\\'")
                       .replace(/\\"/g, '"')
                       .replace(/(^"|"$)/g, "'");
            name = stylize(name, 'string');
          }
        }

        return name + ': ' + str;
      });

      seen.pop();

      var numLinesEst = 0;
      var length = reduce(output, function (prev, cur) {
        numLinesEst++;
        if (indexOf(cur, '\n') >= 0) numLinesEst++;
        return prev + cur.length + 1;
      }, 0);

      if (length > 50) {
        output = braces[0] +
                 (base === '' ? '' : base + '\n ') +
                 ' ' +
                 output.join(',\n  ') +
                 ' ' +
                 braces[1];

      } else {
        output = braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
      }

      return output;
    }
    return format(obj, (typeof depth === 'undefined' ? 2 : depth));
  }

  expect.stringify = i;

  function isArray (ar) {
    return Object.prototype.toString.call(ar) === '[object Array]';
  }

  function isRegExp(re) {
    var s;
    try {
      s = '' + re;
    } catch (e) {
      return false;
    }

    return re instanceof RegExp || // easy case
           // duck-type for context-switching evalcx case
           typeof(re) === 'function' &&
           re.constructor.name === 'RegExp' &&
           re.compile &&
           re.test &&
           re.exec &&
           s.match(/^\/.*\/[gim]{0,3}$/);
  }

  function isDate(d) {
    return d instanceof Date;
  }

  function keys (obj) {
    if (Object.keys) {
      return Object.keys(obj);
    }

    var keys = [];

    for (var i in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, i)) {
        keys.push(i);
      }
    }

    return keys;
  }

  function map (arr, mapper, that) {
    if (Array.prototype.map) {
      return Array.prototype.map.call(arr, mapper, that);
    }

    var other= new Array(arr.length);

    for (var i= 0, n = arr.length; i<n; i++)
      if (i in arr)
        other[i] = mapper.call(that, arr[i], i, arr);

    return other;
  }

  function reduce (arr, fun) {
    if (Array.prototype.reduce) {
      return Array.prototype.reduce.apply(
          arr
        , Array.prototype.slice.call(arguments, 1)
      );
    }

    var len = +this.length;

    if (typeof fun !== "function")
      throw new TypeError();

    // no value to return if no initial value and an empty array
    if (len === 0 && arguments.length === 1)
      throw new TypeError();

    var i = 0;
    if (arguments.length >= 2) {
      var rv = arguments[1];
    } else {
      do {
        if (i in this) {
          rv = this[i++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++i >= len)
          throw new TypeError();
      } while (true);
    }

    for (; i < len; i++) {
      if (i in this)
        rv = fun.call(null, rv, this[i], i, this);
    }

    return rv;
  }

  /**
   * Asserts deep equality
   *
   * @see taken from node.js `assert` module (copyright Joyent, MIT license)
   * @api private
   */

  expect.eql = function eql(actual, expected) {
    // 7.1. All identical values are equivalent, as determined by ===.
    if (actual === expected) {
      return true;
    } else if ('undefined' != typeof Buffer
      && Buffer.isBuffer(actual) && Buffer.isBuffer(expected)) {
      if (actual.length != expected.length) return false;

      for (var i = 0; i < actual.length; i++) {
        if (actual[i] !== expected[i]) return false;
      }

      return true;

      // 7.2. If the expected value is a Date object, the actual value is
      // equivalent if it is also a Date object that refers to the same time.
    } else if (actual instanceof Date && expected instanceof Date) {
      return actual.getTime() === expected.getTime();

      // 7.3. Other pairs that do not both pass typeof value == "object",
      // equivalence is determined by ==.
    } else if (typeof actual != 'object' && typeof expected != 'object') {
      return actual == expected;
    // If both are regular expression use the special `regExpEquiv` method
    // to determine equivalence.
    } else if (isRegExp(actual) && isRegExp(expected)) {
      return regExpEquiv(actual, expected);
    // 7.4. For all other Object pairs, including Array objects, equivalence is
    // determined by having the same number of owned properties (as verified
    // with Object.prototype.hasOwnProperty.call), the same set of keys
    // (although not necessarily the same order), equivalent values for every
    // corresponding key, and an identical "prototype" property. Note: this
    // accounts for both named and indexed properties on Arrays.
    } else {
      return objEquiv(actual, expected);
    }
  };

  function isUndefinedOrNull (value) {
    return value === null || value === undefined;
  }

  function isArguments (object) {
    return Object.prototype.toString.call(object) == '[object Arguments]';
  }

  function regExpEquiv (a, b) {
    return a.source === b.source && a.global === b.global &&
           a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
  }

  function objEquiv (a, b) {
    if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
      return false;
    // an identical "prototype" property.
    if (a.prototype !== b.prototype) return false;
    //~~~I've managed to break Object.keys through screwy arguments passing.
    //   Converting to array solves the problem.
    if (isArguments(a)) {
      if (!isArguments(b)) {
        return false;
      }
      a = pSlice.call(a);
      b = pSlice.call(b);
      return expect.eql(a, b);
    }
    try{
      var ka = keys(a),
        kb = keys(b),
        key, i;
    } catch (e) {//happens when one is a string literal and the other isn't
      return false;
    }
    // having the same number of owned properties (keys incorporates hasOwnProperty)
    if (ka.length != kb.length)
      return false;
    //the same set of keys (although not necessarily the same order),
    ka.sort();
    kb.sort();
    //~~~cheap key test
    for (i = ka.length - 1; i >= 0; i--) {
      if (ka[i] != kb[i])
        return false;
    }
    //equivalent values for every corresponding key, and
    //~~~possibly expensive deep test
    for (i = ka.length - 1; i >= 0; i--) {
      key = ka[i];
      if (!expect.eql(a[key], b[key]))
         return false;
    }
    return true;
  }

  var json = (function () {
    "use strict";

    if ('object' == typeof JSON && JSON.parse && JSON.stringify) {
      return {
          parse: nativeJSON.parse
        , stringify: nativeJSON.stringify
      }
    }

    var JSON = {};

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    function date(d, key) {
      return isFinite(d.valueOf()) ?
          d.getUTCFullYear()     + '-' +
          f(d.getUTCMonth() + 1) + '-' +
          f(d.getUTCDate())      + 'T' +
          f(d.getUTCHours())     + ':' +
          f(d.getUTCMinutes())   + ':' +
          f(d.getUTCSeconds())   + 'Z' : null;
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

  // If the string contains no control characters, no quote characters, and no
  // backslash characters, then we can safely slap some quotes around it.
  // Otherwise we must also replace the offending characters with safe escape
  // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string' ? c :
                '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }


    function str(key, holder) {

  // Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

  // If the value has a toJSON method, call it to obtain a replacement value.

        if (value instanceof Date) {
            value = date(key);
        }

  // If we were called with a replacer function, then call the replacer to
  // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

  // What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

  // JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

  // If the value is a boolean or null, convert it to a string. Note:
  // typeof null does not produce 'null'. The case is included here in
  // the remote chance that this gets fixed someday.

            return String(value);

  // If the type is 'object', we might be dealing with an object or an array or
  // null.

        case 'object':

  // Due to a specification blunder in ECMAScript, typeof null is 'object',
  // so watch out for that case.

            if (!value) {
                return 'null';
            }

  // Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

  // Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

  // The value is an array. Stringify every element. Use null as a placeholder
  // for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

  // Join all of the elements together, separated with commas, and wrap them in
  // brackets.

                v = partial.length === 0 ? '[]' : gap ?
                    '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
                    '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

  // If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

  // Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

  // Join all of the member texts together, separated with commas,
  // and wrap them in braces.

            v = partial.length === 0 ? '{}' : gap ?
                '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
                '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

  // If the JSON object does not yet have a stringify method, give it one.

    JSON.stringify = function (value, replacer, space) {

  // The stringify method takes a value and an optional replacer, and an optional
  // space parameter, and returns a JSON text. The replacer can be a function
  // that can replace values, or an array of strings that will select the keys.
  // A default replacer method can be provided. Use of the space parameter can
  // produce text that is more easily readable.

        var i;
        gap = '';
        indent = '';

  // If the space parameter is a number, make an indent string containing that
  // many spaces.

        if (typeof space === 'number') {
            for (i = 0; i < space; i += 1) {
                indent += ' ';
            }

  // If the space parameter is a string, it will be used as the indent string.

        } else if (typeof space === 'string') {
            indent = space;
        }

  // If there is a replacer, it must be a function or an array.
  // Otherwise, throw an error.

        rep = replacer;
        if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                typeof replacer.length !== 'number')) {
            throw new Error('JSON.stringify');
        }

  // Make a fake root object containing our value under the key of ''.
  // Return the result of stringifying the value.

        return str('', {'': value});
    };

  // If the JSON object does not yet have a parse method, give it one.

    JSON.parse = function (text, reviver) {
    // The parse method takes a text and an optional reviver function, and returns
    // a JavaScript value if the text is a valid JSON text.

        var j;

        function walk(holder, key) {

    // The walk method is used to recursively walk the resulting structure so
    // that modifications can be made.

            var k, v, value = holder[key];
            if (value && typeof value === 'object') {
                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = walk(value, k);
                        if (v !== undefined) {
                            value[k] = v;
                        } else {
                            delete value[k];
                        }
                    }
                }
            }
            return reviver.call(holder, key, value);
        }


    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.

        text = String(text);
        cx.lastIndex = 0;
        if (cx.test(text)) {
            text = text.replace(cx, function (a) {
                return '\\u' +
                    ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            });
        }

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.

    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

        if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                    .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                    .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    // In the third stage we use the eval function to compile the text into a
    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
    // in JavaScript: it can begin a block or an object literal. We wrap the text
    // in parens to eliminate the ambiguity.

            j = eval('(' + text + ')');

    // In the optional fourth stage, we recursively walk the new structure, passing
    // each name/value pair to a reviver function for possible transformation.

            return typeof reviver === 'function' ?
                walk({'': j}, '') : j;
        }

    // If the text is not JSON parseable, then a SyntaxError is thrown.

        throw new SyntaxError('JSON.parse');
    };

    return JSON;
  })();

  if ('undefined' != typeof window) {
    window.expect = module.exports;
  }

})(
    this
  , 'undefined' != typeof module ? module : {exports: {}}
);

}).call(this,require("buffer").Buffer)
},{"buffer":7}],5:[function(require,module,exports){
module.exports={
  "name": "nextgen-events",
  "version": "0.9.7",
  "description": "The next generation of events handling for javascript! New: abstract away the network!",
  "main": "lib/NextGenEvents.js",
  "directories": {
    "test": "test"
  },
  "dependencies": {},
  "devDependencies": {
    "browserify": "^13.0.1",
    "expect.js": "^0.3.1",
    "jshint": "^2.9.2",
    "mocha": "^2.5.3",
    "uglify-js": "^2.6.2",
    "ws": "^1.1.1"
  },
  "scripts": {
    "test": "mocha -R dot"
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
  "copyright": {
    "title": "Next-Gen Events",
    "years": [
      2015,
      2016
    ],
    "owner": "Cédric Ronvel"
  }
}
},{}],6:[function(require,module,exports){
(function (process,global){
/*
	Next Gen Events
	
	Copyright (c) 2015 - 2016 Cédric Ronvel
	
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

/* jshint unused:false */
/* global describe, it, before, after */



var NextGenEvents ;

if ( process.browser )   
{
	NextGenEvents = require( '../lib/browser.js' ) ;
}
else
{
	NextGenEvents = require( '../lib/NextGenEvents.js' ) ;
}



var expect = require( 'expect.js' ) ;





			/* Helpers */



var genericListener = function( tag , stats , fn ) {
	
	//console.log( 'Listener #' + tag + ' received an event with arguments: ' , arguments ) ;
	
	if ( ! stats.count[ tag ] ) { stats.count[ tag ] = 1 ; }
	else { stats.count[ tag ] ++ ; }
	
	stats.orders.push( tag ) ;
	
	if ( fn ) { fn.apply( undefined , Array.prototype.slice.call( arguments , 3 ) ) ; }
} ;



function asyncEventTest( emitterNice , emitNice , listenerNice , contextNice , finish )
{
	var order = [] ;
	var emitter = new NextGenEvents() ;
	
	if ( emitterNice !== undefined ) { emitter.setNice( emitterNice ) ; }
	
	if ( contextNice !== undefined ) { emitter.addListenerContext( 'context' , { nice: contextNice } ) ; }
	
	var listener = {
		context: 'context' ,
		fn: function() {
			order.push( 'listener' ) ;
			expect( arguments.length ).to.be( 3 ) ;
			expect( arguments[ 0 ] ).to.be( 'one' ) ;
			expect( arguments[ 1 ] ).to.be( 'two' ) ;
			expect( arguments[ 2 ] ).to.be( 'three' ) ;
		}
	} ;
	
	if ( listenerNice ) { listener.nice = listenerNice ; }
	
	emitter.on( 'event' , listener ) ;
	
	if ( emitNice ) { emitter.emit( emitNice , 'event' , 'one' , 'two' , 'three' ) ; }
	else { emitter.emit( 'event' , 'one' , 'two' , 'three' ) ; }
	
	setImmediate( function() { order.push( 'setImmediate' ) ; } ) ;
	setTimeout( function() { order.push( 'setTimeout25' ) ; } , 25 ) ;
	setTimeout( function() { order.push( 'setTimeout50' ) ; } , 50 ) ;
	
	// Finish
	setTimeout( function() {
		finish( order ) ;
	} , 80 ) ;
	
	order.push( 'flow' ) ;
}





			/* Tests */



describe( "Basic synchronous event-emitting (node-compatible)" , function() {
	
	//var NextGenEvents = require( 'events' ).EventEmitter ;
	
	it( "should add one listener and emit should trigger it, using 'new'" , function() {
		
		var bus = new NextGenEvents() ;
		
		var triggered = 0 ;
		
		bus.on( 'hello' , function() { triggered ++ ; } ) ;
		
		bus.emit( 'hello' ) ;
		
		expect( triggered ).to.be( 1 ) ;
	} ) ;
	
	it( "should add one listener and emit should trigger it, using 'Object.create()'" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var triggered = 0 ;
		
		bus.on( 'hello' , function() { triggered ++ ; } ) ;
		
		bus.emit( 'hello' ) ;
		
		expect( triggered ).to.be( 1 ) ;
	} ) ;
	
	it( "should emit without argument" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var triggered = 0 ;
		
		bus.on( 'hello' , function() {
			triggered ++ ;
			expect( arguments.length ).to.be( 0 ) ;
		} ) ;
		
		bus.emit( 'hello' ) ;
		
		expect( triggered ).to.be( 1 ) ;
	} ) ;
	
	it( "should emit with argument" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var triggered = 0 ;
		
		bus.on( 'hello' , function( arg1 , arg2 ) {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
		} ) ;
		
		bus.emit( 'hello' , 'world' , '!' ) ;
		
		expect( triggered ).to.be( 1 ) ;
	} ) ;
	
	it( "should emit synchronously (nice =-2) with argument" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var triggered = 0 ;
		
		bus.on( 'hello' , function( arg1 , arg2 ) {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
		} ) ;
		
		bus.emit( -2 , 'hello' , 'world' , '!' ) ;
		
		expect( triggered ).to.be( 1 ) ;
	} ) ;
	
	it( "should emit asynchronously (setTimeout 10ms) with argument" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var triggered = 0 ;
		
		bus.on( 'hello' , function( arg1 , arg2 ) {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			done() ;
		} ) ;
		
		bus.emit( 10 , 'hello' , 'world' , '!' ) ;
	} ) ;
	
	it( "should emit asynchronously (setTimeout 0ms) with argument" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var triggered = 0 ;
		
		bus.on( 'hello' , function( arg1 , arg2 ) {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			done() ;
		} ) ;
		
		bus.emit( 10 , 'hello' , 'world' , '!' ) ;
	} ) ;
	
	it( "should emit asynchronously (setImmediate) with argument" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var triggered = 0 ;
		
		bus.on( 'hello' , function( arg1 , arg2 ) {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			done() ;
		} ) ;
		
		bus.emit( -1 , 'hello' , 'world' , '!' ) ;
	} ) ;
	
	it( "should add many basic listeners for many events, and multiple emits should trigger only relevant listener" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var onFoo1 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
		var triggered = { foo1: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ;
		
		// 1 listener for 'foo'
		bus.on( 'foo' , onFoo1 = function() { triggered.foo1 ++ ; } ) ;
		
		// 2 listeners for 'bar'
		bus.on( 'bar' , onBar1 = function() { triggered.bar1 ++ ; } ) ;
		bus.on( 'bar' , onBar2 = function() { triggered.bar2 ++ ; } ) ;
		
		// 3 listeners for 'baz'
		bus.on( 'baz' , onBaz1 = function() { triggered.baz1 ++ ; } ) ;
		bus.on( 'baz' , onBaz2 = function() { triggered.baz2 ++ ; } ) ;
		bus.on( 'baz' , onBaz3 = function() { triggered.baz3 ++ ; } ) ;
		
		bus.emit( 'foo' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ) ;
		
		bus.emit( 'bar' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ) ;
		
		bus.emit( 'baz' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;
		
		bus.emit( 'qux' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;
		
		bus.emit( 'foo' ) ;
		bus.emit( 'foo' ) ;
		expect( triggered ).to.eql( { foo1: 3 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;
		
		bus.emit( 'qux' ) ;
		bus.emit( 'qux' ) ;
		expect( triggered ).to.eql( { foo1: 3 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;
		
		bus.emit( 'baz' ) ;
		bus.emit( 'baz' ) ;
		expect( triggered ).to.eql( { foo1: 3 , bar1: 1 , bar2: 1 , baz1: 3 , baz2: 3 , baz3: 3 , qux: 0 } ) ;
	} ) ;
	
	it( "should add and remove listeners" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var onFoo1 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
		var triggered = { foo1: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ;
		
		// 1 listener for 'foo'
		bus.on( 'foo' , onFoo1 = function() { triggered.foo1 ++ ; } ) ;
		
		// 2 listeners for 'bar'
		bus.on( 'bar' , onBar1 = function() { triggered.bar1 ++ ; } ) ;
		bus.on( 'bar' , onBar2 = function() { triggered.bar2 ++ ; } ) ;
		
		// 3 listeners for 'baz'
		bus.on( 'baz' , onBaz1 = function() { triggered.baz1 ++ ; } ) ;
		bus.on( 'baz' , onBaz2 = function() { triggered.baz2 ++ ; } ) ;
		bus.on( 'baz' , onBaz3 = function() { triggered.baz3 ++ ; } ) ;
		
		bus.emit( 'foo' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ) ;
		
		bus.emit( 'bar' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ) ;
		
		bus.removeListener( 'bar' , onBar2 ) ;
		bus.emit( 'bar' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 2 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ) ;
		
		bus.removeListener( 'bar' , onBar2 ) ;
		bus.emit( 'bar' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 3 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ) ;
		
		bus.removeListener( 'foo' , onBar1 ) ; // Not listening for this event!
		bus.removeListener( 'bar' , function() {} ) ; // Not event registered
		bus.emit( 'foo' ) ;
		bus.emit( 'bar' ) ;
		expect( triggered ).to.eql( { foo1: 2 , bar1: 4 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ) ;
	} ) ;
	
	it( ".removeAllListeners() should remove all listeners for an event" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var onFoo1 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
		var triggered = { foo1: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ;
		
		// 1 listener for 'foo'
		bus.on( 'foo' , onFoo1 = function() { triggered.foo1 ++ ; } ) ;
		
		// 2 listeners for 'bar'
		bus.on( 'bar' , onBar1 = function() { triggered.bar1 ++ ; } ) ;
		bus.on( 'bar' , onBar2 = function() { triggered.bar2 ++ ; } ) ;
		
		// 3 listeners for 'baz'
		bus.on( 'baz' , onBaz1 = function() { triggered.baz1 ++ ; } ) ;
		bus.on( 'baz' , onBaz2 = function() { triggered.baz2 ++ ; } ) ;
		bus.on( 'baz' , onBaz3 = function() { triggered.baz3 ++ ; } ) ;
		
		bus.emit( 'foo' ) ;
		bus.emit( 'bar' ) ;
		bus.emit( 'baz' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;
		
		bus.removeAllListeners( 'bar' ) ;
		bus.emit( 'bar' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;
		
		bus.emit( 'foo' ) ;
		expect( triggered ).to.eql( { foo1: 2 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;
		
		bus.removeAllListeners( 'baz' ) ;
		bus.emit( 'foo' ) ;
		bus.emit( 'bar' ) ;
		bus.emit( 'baz' ) ;
		expect( triggered ).to.eql( { foo1: 3 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;
	} ) ;
	
	it( ".removeAllListeners() without argument should remove all listeners for all events" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var onFoo1 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
		var triggered = { foo1: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0 } ;
		
		// 1 listener for 'foo'
		bus.on( 'foo' , onFoo1 = function() { triggered.foo1 ++ ; } ) ;
		
		// 2 listeners for 'bar'
		bus.on( 'bar' , onBar1 = function() { triggered.bar1 ++ ; } ) ;
		bus.on( 'bar' , onBar2 = function() { triggered.bar2 ++ ; } ) ;
		
		// 3 listeners for 'baz'
		bus.on( 'baz' , onBaz1 = function() { triggered.baz1 ++ ; } ) ;
		bus.on( 'baz' , onBaz2 = function() { triggered.baz2 ++ ; } ) ;
		bus.on( 'baz' , onBaz3 = function() { triggered.baz3 ++ ; } ) ;
		
		bus.emit( 'foo' ) ;
		bus.emit( 'bar' ) ;
		bus.emit( 'baz' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;
		
		bus.removeAllListeners() ;
		bus.emit( 'foo' ) ;
		bus.emit( 'bar' ) ;
		bus.emit( 'baz' ) ;
		bus.emit( 'qux' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0 } ) ;
	} ) ;
	
	it( ".once() should add one time listener for an event, the event should stop listening after being triggered once" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var onFoo1 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
		var triggered = { foo1: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , qux: 0 } ;
		
		// 1 listener for 'foo'
		bus.once( 'foo' , onFoo1 = function() { triggered.foo1 ++ ; } ) ;
		
		// 2 listeners for 'bar'
		bus.on( 'bar' , onBar1 = function() { triggered.bar1 ++ ; } ) ;
		bus.once( 'bar' , onBar2 = function() { triggered.bar2 ++ ; } ) ;
		
		// 3 listeners for 'baz'
		bus.on( 'baz' , onBaz1 = function() { triggered.baz1 ++ ; } ) ;
		onBaz2 = function() { triggered.baz2 ++ ; } ;
		bus.once( 'baz' , onBaz2 ) ;
		bus.once( 'baz' , onBaz2 ) ;
		bus.once( 'baz' , onBaz2 ) ;
		
		bus.emit( 'foo' ) ;
		bus.emit( 'bar' ) ;
		bus.emit( 'baz' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 3 , qux: 0 } ) ;
		
		bus.emit( 'foo' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 3 , qux: 0 } ) ;
		
		bus.emit( 'bar' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 2 , bar2: 1 , baz1: 1 , baz2: 3 , qux: 0 } ) ;
		
		bus.emit( 'baz' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 2 , bar2: 1 , baz1: 2 , baz2: 3 , qux: 0 } ) ;
	} ) ;
	
	it( "unhandled 'error' event should throw whatever is passed to it" , function() {
		
		var throwed = 0 , triggered = 0 ;
		var bus = Object.create( NextGenEvents.prototype ) ;
		var testError = new Error( 'Some error occurs!' ) ;
		
		var onError = function( error ) {
			triggered ++ ;
			expect( error ).to.be( testError ) ;
		} ;
		
		try {
			bus.emit( 'error' , testError ) ;
		}
		catch ( error ) {
			throwed ++ ;
			expect( error ).to.be( testError ) ;
		}
		
		expect( throwed ).to.be( 1 ) ;
		
		bus.once( 'error' , onError ) ;
		
		bus.emit( 'error' , testError ) ;
		// Should not throw
		expect( triggered ).to.be( 1 ) ;
		
		try {
			bus.emit( 'error' , testError ) ;
		}
		catch ( error ) {
			throwed ++ ;
			expect( error ).to.be( testError ) ;
		}
		
		expect( throwed ).to.be( 2 ) ;
	} ) ;
	
	it( "NextGenEvents.listenerCount() and .listenerCount() should count listeners for an event" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var onFoo1 ;
		
		onFoo1 = function() {} ;
		
		bus.on( 'foo' , onFoo1 ) ;
		expect( bus.listenerCount( 'foo' ) ).to.be( 1 ) ;
		expect( bus.listenerCount( 'bar' ) ).to.be( 0 ) ;
		expect( NextGenEvents.listenerCount( bus , 'foo' ) ).to.be( 1 ) ;
		expect( NextGenEvents.listenerCount( bus , 'bar' ) ).to.be( 0 ) ;
		
		bus.on( 'foo' , onFoo1 ) ;
		bus.on( 'foo' , onFoo1 ) ;
		
		expect( bus.listenerCount( 'foo' ) ).to.be( 3 ) ;
		expect( bus.listenerCount( 'bar' ) ).to.be( 0 ) ;
		expect( NextGenEvents.listenerCount( bus , 'foo' ) ).to.be( 3 ) ;
		expect( NextGenEvents.listenerCount( bus , 'bar' ) ).to.be( 0 ) ;
		
		bus.removeListener( 'foo' , onFoo1 ) ;
		
		expect( bus.listenerCount( 'foo' ) ).to.be( 0 ) ;
		expect( bus.listenerCount( 'bar' ) ).to.be( 0 ) ;
		expect( NextGenEvents.listenerCount( bus , 'foo' ) ).to.be( 0 ) ;
		expect( NextGenEvents.listenerCount( bus , 'bar' ) ).to.be( 0 ) ;
		
		bus.once( 'foo' , onFoo1 ) ;
		expect( bus.listenerCount( 'foo' ) ).to.be( 1 ) ;
		expect( bus.listenerCount( 'bar' ) ).to.be( 0 ) ;
		expect( NextGenEvents.listenerCount( bus , 'foo' ) ).to.be( 1 ) ;
		expect( NextGenEvents.listenerCount( bus , 'bar' ) ).to.be( 0 ) ;
		
		bus.emit( 'foo' ) ;
		expect( bus.listenerCount( 'foo' ) ).to.be( 0 ) ;
		expect( bus.listenerCount( 'bar' ) ).to.be( 0 ) ;
		expect( NextGenEvents.listenerCount( bus , 'foo' ) ).to.be( 0 ) ;
		expect( NextGenEvents.listenerCount( bus , 'bar' ) ).to.be( 0 ) ;
		
	} ) ;
} ) ;



describe( "Basic synchronous event-emitting (NOT compatible with node)" , function() {
	
	it( "should remove every occurences of a listener for one event" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var onFoo1 , onBar1 , onBar2 ;
		var triggered = { foo1: 0 , bar1: 0 , bar2: 0 } ;
		
		onFoo1 = function() { triggered.foo1 ++ ; } ;
		onBar1 = function() { triggered.bar1 ++ ; } ;
		onBar2 = function() { triggered.bar2 ++ ; } ;
		
		// 1 listener for 'foo'
		bus.on( 'foo' , onFoo1 ) ;
		
		// 2 listeners for 'bar'
		bus.on( 'bar' , onBar1 ) ;
		
		// Same listener added multiple times
		bus.on( 'bar' , onBar2 ) ;
		bus.on( 'bar' , onBar2 ) ;
		bus.on( 'bar' , onBar2 ) ;
		
		bus.emit( 'foo' ) ;
		bus.emit( 'bar' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 1 , bar2: 3 } ) ;
		
		bus.removeListener( 'bar' , onBar2 ) ;
		bus.emit( 'bar' ) ;
		expect( triggered ).to.eql( { foo1: 1 , bar1: 2 , bar2: 3 } ) ;
	} ) ;
	
	it( "should emit 'newListener' every time a new listener is added, with an array of listener object" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var stats = { count: {} , orders: [] } ;
		
		
		bus.on( 'newListener' , genericListener.bind( undefined , 'new1' , stats , function( listeners ) {
			
			expect( listeners.length ).to.be( 1 ) ;
			expect( typeof listeners[ 0 ] ).to.be( 'object' ) ;
			
			switch ( stats.count.new1 )
			{
				case 1 :
					expect( listeners[ 0 ].event ).to.be( 'foo' ) ;
					break ;
				case 2 :
					expect( listeners[ 0 ].event ).to.be( 'newListener' ) ;
					break ;
				case 3 :
					expect( listeners[ 0 ].event ).to.be( 'bar' ) ;
					break ;
				default :
					expect().fail() ;
			}
		} ) ) ;
		
		expect( stats.count ).to.eql( {} ) ;
		
		
		bus.on( 'foo' , genericListener.bind( undefined , 'foo' , stats , undefined ) ) ;
		expect( stats.count ).to.eql( { new1: 1 } ) ;
		expect( stats.orders ).to.eql( [ 'new1' ] ) ;
		
		bus.emit( 'foo' ) ;
		expect( stats.count ).to.eql( { new1: 1 , foo: 1 } ) ;
		expect( stats.orders ).to.eql( [ 'new1' , 'foo' ] ) ;
		
		
		bus.on( 'newListener' , genericListener.bind( undefined , 'new2' , stats , function( listeners ) {
			
			expect( listeners.length ).to.be( 1 ) ;
			expect( typeof listeners[ 0 ] ).to.be( 'object' ) ;
			
			switch ( stats.count.new2 )
			{
				case 1 :
					expect( listeners[ 0 ].event ).to.be( 'bar' ) ;
					break ;
				default :
					expect().fail() ;
			}
		} ) ) ;
		
		expect( stats.count ).to.eql( { new1: 2 , foo: 1 } ) ;
		expect( stats.orders ).to.eql( [ 'new1' , 'foo' , 'new1' ] ) ;
		
		
		bus.once( 'bar' , genericListener.bind( undefined , 'bar' , stats , undefined ) ) ;
		expect( stats.count ).to.eql( { new1: 3 , new2: 1 , foo: 1 } ) ;
		expect( stats.orders ).to.eql( [ 'new1' , 'foo' , 'new1' , 'new1' , 'new2' ] ) ;
		
		bus.emit( 'bar' ) ;
		expect( stats.count ).to.eql( { new1: 3 , new2: 1 , foo: 1 , bar: 1 } ) ;
		expect( stats.orders ).to.eql( [ 'new1' , 'foo' , 'new1' , 'new1' , 'new2' , 'bar' ] ) ;
	} ) ;
	
	it( "should emit 'removeListener' every time a new listener is removed (one time listener count as well once triggered), with an array of listener object" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var stats = { count: {} , orders: [] } ;
		
		var onFoo = genericListener.bind( undefined , 'foo' , stats , undefined ) ;
		var onBar1 = genericListener.bind( undefined , 'bar1' , stats , undefined ) ;
		var onBar2 = genericListener.bind( undefined , 'bar2' , stats , undefined ) ;
		
		
		bus.on( 'removeListener' , genericListener.bind( undefined , 'rm1' , stats , function( listeners ) {
			
			switch ( stats.count.rm1 )
			{
				case 1 :
					expect( listeners.length ).to.be( 1 ) ;
					expect( typeof listeners[ 0 ] ).to.be( 'object' ) ;
					expect( listeners[ 0 ].event ).to.be( 'foo' ) ;
					expect( listeners[ 0 ].id ).to.be( onFoo ) ;
					break ;
				case 2 :
					expect( listeners.length ).to.be( 3 ) ;
					expect( typeof listeners[ 0 ] ).to.be( 'object' ) ;
					expect( typeof listeners[ 1 ] ).to.be( 'object' ) ;
					expect( typeof listeners[ 2 ] ).to.be( 'object' ) ;
					expect( listeners[ 0 ].event ).to.be( 'foo' ) ;
					expect( listeners[ 0 ].id ).to.be( onFoo ) ;
					expect( listeners[ 1 ].event ).to.be( 'foo' ) ;
					expect( listeners[ 1 ].id ).to.be( onFoo ) ;
					expect( listeners[ 2 ].event ).to.be( 'foo' ) ;
					expect( listeners[ 2 ].id ).to.be( onFoo ) ;
					break ;
				case 3 :
					expect( listeners.length ).to.be( 1 ) ;
					expect( typeof listeners[ 0 ] ).to.be( 'object' ) ;
					expect( listeners[ 0 ].event ).to.be( 'foo' ) ;
					expect( listeners[ 0 ].id ).to.be( onFoo ) ;
					break ;
				case 4 :
					expect( listeners.length ).to.be( 2 ) ;
					expect( typeof listeners[ 0 ] ).to.be( 'object' ) ;
					expect( typeof listeners[ 1 ] ).to.be( 'object' ) ;
					expect( listeners[ 0 ].event ).to.be( 'bar' ) ;
					expect( listeners[ 0 ].id ).to.be( onBar1 ) ;
					expect( listeners[ 1 ].event ).to.be( 'bar' ) ;
					expect( listeners[ 1 ].id ).to.be( onBar2 ) ;
					break ;
				default :
					expect().fail() ;
			}
		} ) ) ;
		
		expect( stats.count ).to.eql( {} ) ;
		
		
		bus.on( 'foo' , onFoo ) ;
		expect( stats.count ).to.eql( {} ) ;
		expect( stats.orders ).to.eql( [] ) ;
		
		bus.off( 'foo' , onFoo ) ;
		expect( stats.count ).to.eql( { rm1: 1 } ) ;
		expect( stats.orders ).to.eql( [ 'rm1' ] ) ;
		
		bus.on( 'foo' , onFoo ) ;
		bus.on( 'foo' , onFoo ) ;
		bus.on( 'foo' , onFoo ) ;
		expect( stats.count ).to.eql( { rm1: 1 } ) ;
		expect( stats.orders ).to.eql( [ 'rm1' ] ) ;
		
		bus.off( 'foo' , onFoo ) ;
		expect( stats.count ).to.eql( { rm1: 2 } ) ;
		expect( stats.orders ).to.eql( [ 'rm1' , 'rm1' ] ) ;
		
		bus.once( 'foo' , onFoo ) ;
		expect( stats.count ).to.eql( { rm1: 2 } ) ;
		expect( stats.orders ).to.eql( [ 'rm1' , 'rm1' ] ) ;
		
		bus.emit( 'foo' ) ;
		expect( stats.count ).to.eql( { rm1: 3 , foo: 1 } ) ;
		expect( stats.orders ).to.eql( [ 'rm1' , 'rm1' , 'foo' , 'rm1' ] ) ;
		
		bus.on( 'foo' , onFoo ) ;
		bus.on( 'bar' , onBar1 ) ;
		bus.on( 'bar' , onBar2 ) ;
		bus.removeAllListeners( 'bar' ) ;
		
		expect( stats.count ).to.eql( { rm1: 4 , foo: 1 } ) ;
		expect( stats.orders ).to.eql( [ 'rm1' , 'rm1' , 'foo' , 'rm1' , 'rm1' ] ) ;
		
		bus.on( 'foo' , onFoo ) ;
		bus.on( 'bar' , onBar1 ) ;
		bus.on( 'bar' , onBar2 ) ;
		bus.removeAllListeners() ;
		
		// 'removeListener' listener are not fired: they are already deleted
		expect( stats.count ).to.eql( { rm1: 4 , foo: 1 } ) ;
		expect( stats.orders ).to.eql( [ 'rm1' , 'rm1' , 'foo' , 'rm1' , 'rm1' ] ) ;
	} ) ;
	
	it( ".listeners() should return all the listeners for an event" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var listeners , onFoo1 ;
		
		onFoo1 = function onFoo1() {} ;
		
		bus.on( 'foo' , onFoo1 ) ;
		listeners = bus.listeners( 'foo' ) ;
		expect( listeners.length ).to.be( 1 ) ;
		expect( listeners[ 0 ].id ).to.be( onFoo1 ) ;
		
		console.log( "Has global.AsyncTryCatch?" , global.AsyncTryCatch ) ;
		
		if ( ! global.AsyncTryCatch ) { expect( listeners[ 0 ].fn ).to.be( onFoo1 ) ; }
		expect( listeners[ 0 ].event ).to.be( 'foo' ) ;
		expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;
		
		bus.on( 'foo' , onFoo1 ) ;
		bus.on( 'foo' , onFoo1 ) ;
		
		listeners = bus.listeners( 'foo' ) ;
		expect( listeners.length ).to.be( 3 ) ;
		expect( listeners[ 1 ].id ).to.be( onFoo1 ) ;
		if ( ! global.AsyncTryCatch ) { expect( listeners[ 1 ].fn ).to.be( onFoo1 ) ; }
		expect( listeners[ 1 ].event ).to.be( 'foo' ) ;
		expect( listeners[ 2 ].id ).to.be( onFoo1 ) ;
		if ( ! global.AsyncTryCatch ) { expect( listeners[ 2 ].fn ).to.be( onFoo1 ) ; }
		expect( listeners[ 2 ].event ).to.be( 'foo' ) ;
		expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;
		
		bus.removeListener( 'foo' , onFoo1 ) ;
		expect( bus.listeners( 'foo' ).length ).to.be( 0 ) ;
		expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;
		
		bus.once( 'foo' , onFoo1 ) ;
		listeners = bus.listeners( 'foo' ) ;
		expect( listeners.length ).to.be( 1 ) ;
		expect( listeners[ 0 ].id ).to.be( onFoo1 ) ;
		if ( ! global.AsyncTryCatch ) { expect( listeners[ 0 ].fn ).to.be( onFoo1 ) ; }
		expect( listeners[ 0 ].event ).to.be( 'foo' ) ;
		expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;
		
		bus.emit( 'foo' ) ;
		listeners = bus.listeners( 'foo' ) ;
		expect( bus.listeners( 'foo' ).length ).to.be( 0 ) ;
		expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;
	} ) ;
} ) ;



describe( "Edge cases" , function() {
	
	it( "inside a 'newListener' listener, the .listenerCount() should report correctly" , function() {
		
		var triggered = 0 ,
			bus = Object.create( NextGenEvents.prototype ) ;
		
		bus.on( 'newListener' , function( listeners ) {
			triggered ++ ;
			expect( listeners.length ).to.be( 1 ) ;
			expect( listeners[ 0 ].event ).to.be( 'ready' ) ;
			
			// This is the tricky condition
			expect( bus.listenerCount( 'ready' ) ).to.be( 1 ) ;
		} ) ;
		
		bus.on( 'ready' , function() {} ) ;
		expect( triggered ).to.be( 1 ) ;
	} ) ;
} ) ;


		
describe( "Next Gen feature: listener in 'eventObject' mode" , function() {
	
	it( "listener using 'eventObject' option" , function() {
		
		var triggered = 0 ,
			bus = Object.create( NextGenEvents.prototype ) ;
		
		bus.once( 'hello' , function( event ) {
			triggered ++ ;
			expect( event.args.length ).to.be( 2 ) ;
			expect( event.args[ 0 ] ).to.be( 'world' ) ;
			expect( event.args[ 1 ] ).to.be( '!' ) ;
			
			expect( event.emitter ).to.be( bus ) ;
			expect( event.name ).to.be( 'hello' ) ;
			expect( event.callback ).not.to.be.ok() ;
		} , { eventObject: true } ) ;
		
		bus.emit( 'hello' , 'world' , '!' ) ;
		
		expect( triggered ).to.be( 1 ) ;
	} ) ;
	
	it( "listener using 'eventObject' option and emit() with completion callback" , function() {
		
		var triggered = 0 , emitCallbackTriggered = 0 ,
			bus = Object.create( NextGenEvents.prototype ) ;
		
		var emitCallback = function() {
			emitCallbackTriggered ++ ;
		} ;
		
		bus.once( 'hello' , function( event ) {
			triggered ++ ;
			expect( event.args.length ).to.be( 0 ) ;
			
			expect( event.emitter ).to.be( bus ) ;
			expect( event.name ).to.be( 'hello' ) ;
			expect( event.callback ).to.be( emitCallback ) ;
		} , { eventObject: true } ) ;
		
		bus.emit( 'hello' , emitCallback ) ;
		
		expect( triggered ).to.be( 1 ) ;
		expect( emitCallbackTriggered ).to.be( 1 ) ;
	} ) ;
	
	it( "listener using 'eventObject' and 'async' options, and emit() with completion callback" , function( done ) {
		
		var triggered = 0 , emitCallbackTriggered = 0 ,
			bus = Object.create( NextGenEvents.prototype ) ;
		
		var emitCallback = function() {
			emitCallbackTriggered ++ ;
			expect( triggered ).to.be( 1 ) ;
			expect( emitCallbackTriggered ).to.be( 1 ) ;
			done() ;
		} ;
		
		bus.once( 'hello' , function( event , callback ) {
			triggered ++ ;
			expect( event.args.length ).to.be( 0 ) ;
			
			expect( event.emitter ).to.be( bus ) ;
			expect( event.name ).to.be( 'hello' ) ;
			expect( event.callback ).to.be( emitCallback ) ;
			
			setTimeout( function() {
				callback() ;
			} , 20 ) ;
			
		} , { async: true , eventObject: true } ) ;
		
		bus.emit( 'hello' , emitCallback ) ;
	} ) ;
} ) ;



describe( "Next Gen feature: state-events" , function() {
	
	it( "should emit a state-event, further listeners should receive the last emitted event immediately" , function() {
		
		var bus = new NextGenEvents() ;
		
		var triggered = 0 ;
		
		bus.defineStates( 'ready' ) ;
		
		bus.on( 'ready' , function( arg ) {
			triggered ++ ;
			expect( arg ).to.be( 'ok!' ) ;
		} ) ;
		expect( triggered ).to.be( 0 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( false ) ;
		expect( bus.getAllStates() ).to.eql( [] ) ;
		
		bus.emit( 'ready' , 'ok!' ) ;
		expect( triggered ).to.be( 1 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.eql( [ 'ready' ] ) ;
		
		bus.on( 'ready' , function( arg ) {
			triggered ++ ;
			expect( arg ).to.be( 'ok!' ) ;
		} ) ;
		
		expect( triggered ).to.be( 2 ) ;
		
		bus.once( 'ready' , function( arg ) {
			triggered ++ ;
			expect( arg ).to.be( 'ok!' ) ;
		} ) ;
		
		expect( triggered ).to.be( 3 ) ;
		
		bus.emit( 'ready' , 'ok!' , 'stateBreaker#1' ) ;
		expect( triggered ).to.be( 5 ) ;
		
		
		bus.removeAllListeners( 'ready' ) ;
		
		bus.once( 'ready' , function( arg ) {
			triggered ++ ;
			expect( arg ).to.be( 'ok!' ) ;
		} ) ;
		expect( triggered ).to.be( 6 ) ;
		
		bus.emit( 'ready' ) ;
		
		bus.once( 'ready' , function( arg ) {
			triggered ++ ;
			expect( arg ).not.to.be.ok() ;
		} ) ;
		expect( triggered ).to.be( 7 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.eql( [ 'ready' ] ) ;
	} ) ;
	
	it( "when the state remains the same, nothing should be emitted" , function() {
		
		var bus = new NextGenEvents() ;
		
		var triggered = 0 ;
		
		bus.defineStates( 'ready' , 'notReady' ) ;
		
		bus.on( 'ready' , function() {
			triggered ++ ;
		} ) ;
		expect( triggered ).to.be( 0 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( false ) ;
		expect( bus.getAllStates() ).to.eql( [] ) ;
		
		bus.emit( 'ready' ) ;
		expect( triggered ).to.be( 1 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.eql( [ 'ready' ] ) ;
		
		bus.on( 'ready' , function() {
			triggered ++ ;
		} ) ;
		
		expect( triggered ).to.be( 2 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.eql( [ 'ready' ] ) ;
		
		bus.emit( 'ready' ) ;
		
		expect( triggered ).to.be( 2 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.eql( [ 'ready' ] ) ;
		
		bus.emit( 'ready' , '#1' ) ;
		
		expect( triggered ).to.be( 4 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.eql( [ 'ready' ] ) ;
		
		bus.emit( 'ready' , '#1' ) ;
		
		expect( triggered ).to.be( 4 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.eql( [ 'ready' ] ) ;
		
		bus.emit( 'ready' , '#2' ) ;
		
		expect( triggered ).to.be( 6 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.eql( [ 'ready' ] ) ;
		
		bus.emit( 'ready' , '#2' ) ;
		
		expect( triggered ).to.be( 6 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.eql( [ 'ready' ] ) ;
		
		bus.emit( 'ready' ) ;
		
		expect( triggered ).to.be( 8 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.eql( [ 'ready' ] ) ;
		
		bus.emit( 'notReady' ) ;
		expect( triggered ).to.be( 8 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( false ) ;
		expect( bus.hasState( 'notReady' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.eql( [ 'notReady' ] ) ;
		
		bus.emit( 'ready' ) ;
		expect( triggered ).to.be( 10 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.hasState( 'notReady' ) ).to.be( false ) ;
		expect( bus.getAllStates() ).to.eql( [ 'ready' ] ) ;
	} ) ;
	
	it( "should define three exclusive states, emitting one should discard the two others" , function() {
		
		var bus = new NextGenEvents() ;
		
		var startingTriggered = 0 , runningTriggered = 0 , endingTriggered = 0 ;
		
		// Define 3 exclusives states
		bus.defineStates( 'starting' , 'running' , 'ending' ) ;
		expect( bus.hasState( 'starting' ) ).to.be( false ) ;
		expect( bus.hasState( 'running' ) ).to.be( false ) ;
		expect( bus.hasState( 'ending' ) ).to.be( false ) ;
		expect( bus.getAllStates() ).to.eql( [] ) ;
		
		bus.on( 'starting' , function() {
			startingTriggered ++ ;
		} ) ;
		expect( startingTriggered ).to.be( 0 ) ;
		
		bus.emit( 'starting' ) ;
		expect( bus.hasState( 'starting' ) ).to.be( true ) ;
		expect( bus.hasState( 'running' ) ).to.be( false ) ;
		expect( bus.hasState( 'ending' ) ).to.be( false ) ;
		expect( bus.getAllStates() ).to.eql( [ 'starting' ] ) ;
		expect( startingTriggered ).to.be( 1 ) ;
		
		bus.on( 'starting' , function() {
			startingTriggered ++ ;
		} ) ;
		expect( startingTriggered ).to.be( 2 ) ;
		
		bus.on( 'running' , function() {
			runningTriggered ++ ;
		} ) ;
		expect( startingTriggered ).to.be( 2 ) ;
		expect( runningTriggered ).to.be( 0 ) ;
		
		// Emit the 'running' state-event, thus discarding the 'starting' state
		bus.emit( 'running' ) ;
		expect( bus.hasState( 'starting' ) ).to.be( false ) ;
		expect( bus.hasState( 'running' ) ).to.be( true ) ;
		expect( bus.hasState( 'ending' ) ).to.be( false ) ;
		expect( bus.getAllStates() ).to.eql( [ 'running' ] ) ;
		expect( startingTriggered ).to.be( 2 ) ;
		expect( runningTriggered ).to.be( 1 ) ;
		
		bus.on( 'starting' , function() {
			startingTriggered ++ ;
		} ) ;
		expect( startingTriggered ).to.be( 2 ) ;
		expect( runningTriggered ).to.be( 1 ) ;
		
		bus.on( 'running' , function() {
			runningTriggered ++ ;
		} ) ;
		expect( startingTriggered ).to.be( 2 ) ;
		expect( runningTriggered ).to.be( 2 ) ;
		
		bus.on( 'ending' , function() {
			endingTriggered ++ ;
		} ) ;
		expect( startingTriggered ).to.be( 2 ) ;
		expect( runningTriggered ).to.be( 2 ) ;
		expect( endingTriggered ).to.be( 0 ) ;
		
		// Emit the 'ending' state-event, thus discarding the 'running' state
		bus.emit( 'ending' ) ;
		expect( bus.hasState( 'starting' ) ).to.be( false ) ;
		expect( bus.hasState( 'running' ) ).to.be( false ) ;
		expect( bus.hasState( 'ending' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.eql( [ 'ending' ] ) ;
		expect( startingTriggered ).to.be( 2 ) ;
		expect( runningTriggered ).to.be( 2 ) ;
		expect( endingTriggered ).to.be( 1 ) ;
		
		// Emit the 'starting' state-event, thus discarding the 'ending' state
		bus.emit( 'starting' ) ;
		expect( bus.hasState( 'starting' ) ).to.be( true ) ;
		expect( bus.hasState( 'running' ) ).to.be( false ) ;
		expect( bus.hasState( 'ending' ) ).to.be( false ) ;
		expect( bus.getAllStates() ).to.eql( [ 'starting' ] ) ;
		expect( startingTriggered ).to.be( 5 ) ;
		expect( runningTriggered ).to.be( 2 ) ;
		expect( endingTriggered ).to.be( 1 ) ;
		
		bus.on( 'running' , function() {
			runningTriggered ++ ;
		} ) ;
		bus.on( 'ending' , function() {
			endingTriggered ++ ;
		} ) ;
		expect( startingTriggered ).to.be( 5 ) ;
		expect( runningTriggered ).to.be( 2 ) ;
		expect( endingTriggered ).to.be( 1 ) ;
	} ) ;
} ) ;



describe( "Next Gen feature: emitter group actions" , function() {
	
	it( "should emit on a group of emitters" , function() {
		
		var busList = [
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype )
		] ;
		
		var triggered = 0 ;
		
		busList[ 0 ].on( 'hello' , function( arg1 , arg2 ) {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
		} ) ;
		
		busList[ 1 ].on( 'hello' , function( arg1 , arg2 ) {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
		} ) ;
		
		busList[ 2 ].on( 'hello' , function( arg1 , arg2 ) {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
		} ) ;
		
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '!' ) ;
		
		expect( triggered ).to.be( 3 ) ;
	} ) ;
	
	it( "should listen to a group of emitters" , function() {
		
		var busList = [
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype )
		] ;
		
		var triggered = 0 ;
		
		NextGenEvents.groupOn( busList , 'hello' , function( emitter , arg1 , arg2 ) {
			triggered ++ ;
			emitter.triggered = ( emitter.triggered || 0 ) + 1 ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			expect( emitter.triggered ).to.be.within( 1 , 2 ) ;
		} ) ;
		
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '!' ) ;
		expect( triggered ).to.be( 3 ) ;
		
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '!' ) ;
		expect( triggered ).to.be( 6 ) ;
	} ) ;
	
	it( "should listen to a group of emitters then stop listening" , function() {
		
		var busList = [
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype )
		] ;
		
		var triggered = 0 ;
		
		var fn = function( emitter , arg1 , arg2 ) {
			triggered ++ ;
			emitter.triggered = ( emitter.triggered || 0 ) + 1 ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			expect( emitter.triggered ).to.be( 1 ) ;
		} ;
		
		NextGenEvents.groupOn( busList , 'hello' , fn ) ;
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '!' ) ;
		expect( triggered ).to.be( 3 ) ;
		
		NextGenEvents.groupOff( busList , 'hello' , fn ) ;
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '!' ) ;
		expect( triggered ).to.be( 3 ) ;
	} ) ;
	
	it( "should add multiple listeners to a group of emitters then remove all of them at once" , function() {
		
		var busList = [
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype )
		] ;
		
		var triggered = 0 ;
		
		var fn = function( emitter , arg1 , arg2 ) {
			triggered ++ ;
			emitter.triggered = ( emitter.triggered || 0 ) + 1 ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			expect( emitter.triggered ).to.be( 1 ) ;
		} ;
		
		var fn2 = function( emitter , arg1 , arg2 ) {
			triggered ++ ;
			emitter.triggered = ( emitter.triggered || 0 ) + 1 ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			expect( emitter.triggered ).to.be( 2 ) ;
		} ;
		
		NextGenEvents.groupOn( busList , 'hello' , fn ) ;
		NextGenEvents.groupOn( busList , 'hello' , fn2 ) ;
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '!' ) ;
		expect( triggered ).to.be( 6 ) ;
		
		NextGenEvents.groupRemoveAllListeners( busList , 'hello' ) ;
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '!' ) ;
		expect( triggered ).to.be( 6 ) ;
	} ) ;
	
	it( "should listen once to each emitters of a group" , function() {
		
		var busList = [
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype )
		] ;
		
		var triggered = 0 ;
		
		NextGenEvents.groupOnce( busList , 'hello' , function( emitter , arg1 , arg2 ) {
			triggered ++ ;
			emitter.triggered = ( emitter.triggered || 0 ) + 1 ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			expect( emitter.triggered ).to.be( 1 ) ;
		} ) ;
		
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '!' ) ;
		expect( triggered ).to.be( 3 ) ;
		
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '!' ) ;
		expect( triggered ).to.be( 3 ) ;
	} ) ;
	
	it( "should listen once to a whole group of emitters" , function() {
		
		var busList = [
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype )
		] ;
		
		var triggered = 0 ;
		
		NextGenEvents.groupGlobalOnce( busList , 'hello' , function( emitter , arg1 , arg2 ) {
			triggered ++ ;
			emitter.triggered = ( emitter.triggered || 0 ) + 1 ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			expect( emitter.triggered ).to.be( 1 ) ;
		} ) ;
		
		busList[ 1 ].emit( 'hello' , 'world' , '!' ) ;
		expect( triggered ).to.be( 1 ) ;
		
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '?' ) ;
		expect( triggered ).to.be( 1 ) ;
		
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '?' ) ;
		expect( triggered ).to.be( 1 ) ;
	} ) ;
	
	it( "should listen once the last emitter to emit from whole group" , function() {
		
		var busList = [
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype )
		] ;
		
		var triggered = 0 ;
		
		NextGenEvents.groupGlobalOnceAll( busList , 'hello' , function( emitter , arg1 , arg2 ) {
			triggered ++ ;
			emitter.triggered = ( emitter.triggered || 0 ) + 1 ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			expect( emitter.triggered ).to.be( 1 ) ;
		} ) ;
		
		busList[ 1 ].emit( 'hello' , 'world' , '...' ) ;
		expect( triggered ).to.be( 0 ) ;
		busList[ 1 ].emit( 'hello' , 'world' , '...' ) ;
		expect( triggered ).to.be( 0 ) ;
		busList[ 1 ].emit( 'hello' , 'world' , '...' ) ;
		expect( triggered ).to.be( 0 ) ;
		busList[ 0 ].emit( 'hello' , 'world' , '...' ) ;
		expect( triggered ).to.be( 0 ) ;
		busList[ 0 ].emit( 'hello' , 'world' , '...' ) ;
		expect( triggered ).to.be( 0 ) ;
		busList[ 1 ].emit( 'hello' , 'world' , '...' ) ;
		expect( triggered ).to.be( 0 ) ;
		
		busList[ 2 ].emit( 'hello' , 'world' , '!' ) ;
		expect( triggered ).to.be( 1 ) ;
		
		busList[ 2 ].emit( 'hello' , 'world' , '?' ) ;
		expect( triggered ).to.be( 1 ) ;
		
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '?' ) ;
		expect( triggered ).to.be( 1 ) ;
		
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '?' ) ;
		expect( triggered ).to.be( 1 ) ;
	} ) ;
	
	it( "should emit with a completion callback that should be triggered once all emitters have finished" , function( done ) {
		
		var busList = [
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype )
		] ;
		
		var triggered = 0 , timeoutTriggered = 0 , callbackTriggered = 0 ;
		
		busList[ 0 ].on( 'hello' , function( arg1 , arg2 , callback ) {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			setTimeout( function() {
				timeoutTriggered ++ ;
				callback() ;
			} , 50 ) ;
		} , { async: true } ) ;
		
		busList[ 1 ].on( 'hello' , function( arg1 , arg2 , callback ) {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			setTimeout( function() {
				timeoutTriggered ++ ;
				callback() ;
			} , 10 ) ;
		} , { async: true } ) ;
		
		busList[ 2 ].on( 'hello' , function( arg1 , arg2 , callback ) {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			setTimeout( function() {
				timeoutTriggered ++ ;
				callback() ;
			} , 20 ) ;
		} , { async: true } ) ;
		
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '!' , function( interruption ) {
			callbackTriggered ++ ;
			expect( interruption ).not.to.be.ok() ;
			expect( callbackTriggered ).to.be( 1 ) ;
		} ) ;
		
		expect( triggered ).to.be( 3 ) ;
		
		setTimeout( function() {
			expect( timeoutTriggered ).to.be( 3 ) ;
			expect( callbackTriggered ).to.be( 1 ) ;
			done() ;
		} , 100 ) ;
	} ) ;
	
	it( "using interruptible emitters, it should trigger the completion callback once one of them is interrupted" , function( done ) {
		
		var busList = [
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype )
		] ;
		
		busList.forEach( function( bus ) { bus.setInterruptible( true ) ; } ) ;
		
		var triggered = 0 , timeoutTriggered = 0 , callbackTriggered = 0 ;
		
		busList[ 0 ].on( 'hello' , function( arg1 , arg2 , callback ) {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			setTimeout( function() {
				timeoutTriggered ++ ;
				callback() ;
			} , 50 ) ;
		} , { async: true } ) ;
		
		busList[ 1 ].on( 'hello' , function( arg1 , arg2 , callback ) {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			setTimeout( function() {
				timeoutTriggered ++ ;
				callback( 'interrupted!' ) ;
			} , 10 ) ;
		} , { async: true } ) ;
		
		busList[ 2 ].on( 'hello' , function( arg1 , arg2 , callback ) {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
			setTimeout( function() {
				timeoutTriggered ++ ;
				callback() ;
			} , 20 ) ;
		} , { async: true } ) ;
		
		NextGenEvents.groupEmit( busList , 'hello' , 'world' , '!' , function( interruption ) {
			callbackTriggered ++ ;
			expect( interruption ).to.be( 'interrupted!' ) ;
			expect( callbackTriggered ).to.be( 1 ) ;
		} ) ;
		
		expect( triggered ).to.be( 3 ) ;
		
		setTimeout( function() {
			expect( timeoutTriggered ).to.be( 3 ) ;
			expect( callbackTriggered ).to.be( 1 ) ;
			done() ;
		} , 100 ) ;
	} ) ;
	
	it( "should define states on a group of emitters and use it" , function() {
		
		var busList = [
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype ) ,
			Object.create( NextGenEvents.prototype )
		] ;
		
		var triggered = 0 ;
		
		NextGenEvents.groupDefineStates( busList , 'starting' , 'running' , 'ending' ) ;
		
		NextGenEvents.groupEmit( busList , 'starting' ) ;
		
		NextGenEvents.groupOn( busList , 'starting' , function( emitter ) {
			triggered ++ ;
			emitter.triggered = ( emitter.triggered || 0 ) + 1 ;
			expect( emitter.triggered ).to.be( 1 ) ;
		} ) ;
		
		expect( triggered ).to.be( 3 ) ;
		
		NextGenEvents.groupEmit( busList , 'ending' ) ;
		
		NextGenEvents.groupOn( busList , 'starting' , function( emitter ) {
			triggered ++ ;
			emitter.triggered = ( emitter.triggered || 0 ) + 1 ;
			expect( emitter.triggered ).to.be( 1 ) ;
		} ) ;
		
		expect( triggered ).to.be( 3 ) ;
		
		NextGenEvents.groupOn( busList , 'ending' , function( emitter ) {
			triggered ++ ;
			emitter.triggered = ( emitter.triggered || 0 ) + 1 ;
			expect( emitter.triggered ).to.be( 2 ) ;
		} ) ;
		
		expect( triggered ).to.be( 6 ) ;
	} ) ;
	
	it( "using interruptible emitters, once one of them is interrupted, should all other emitter be interrupted too?" ) ;
} ) ;



describe( "Next Gen feature: objects sharing the same event bus" , function() {
	
	it( "should emit on one of the shared emitters and receive on all" , function() {
		var bus1 = Object.create( NextGenEvents.prototype , { a: { value: 1 , enumerable: true } } ) ;
		var bus2 = Object.create( NextGenEvents.prototype , { b: { value: 2 , enumerable: true } } ) ;
		var triggered = 0 ;
		
		NextGenEvents.share( bus1 , bus2 ) ;
		
		expect( bus1.a ).to.be( 1 ) ;
		expect( bus2.b ).to.be( 2 ) ;
		
		bus1.on( 'hello' , function() {
			triggered ++ ;
		} ) ;
		
		bus2.emit( 'hello' ) ;
		expect( triggered ).to.be( 1 ) ;
		
		bus2.on( 'hello' , function() {
			triggered ++ ;
		} ) ;
		
		bus2.emit( 'hello' ) ;
		expect( triggered ).to.be( 3 ) ;
		
		bus1.emit( 'hello' ) ;
		expect( triggered ).to.be( 5 ) ;
	} ) ;
} ) ;



describe( "Next Gen feature: async emitting" , function() {
	
	it( "should emit synchronously, with a synchronous flow (nice = NextGenEvents.SYNC)" , function( done ) {
		asyncEventTest( NextGenEvents.SYNC , undefined , undefined , undefined , function( order ) {
			expect( order ).to.eql( [ 'listener' , 'flow' , 'setImmediate' , 'setTimeout25' , 'setTimeout50' ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should emit asynchronously, with an asynchronous flow, almost as fast as possible (nice = -1)" , function( done ) {
		asyncEventTest( -1 , undefined , undefined , undefined , function( order ) {
			expect( order ).to.eql( [ 'flow' , 'listener' , 'setImmediate' , 'setTimeout25' , 'setTimeout50' ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should emit asynchronously, with an asynchronous flow, with minimal delay (nice = 0)" , function( done ) {
		asyncEventTest( 0 , undefined , undefined , undefined , function( order ) {
			try {
				expect( order ).to.eql( [ 'flow' , 'setImmediate' , 'listener' , 'setTimeout25' , 'setTimeout50' ] ) ;
			}
			catch( error ) {
				// Sometime setImmediate() is unpredictable and is slower than setTimeout(fn,0)
				// It is a bug of V8, not a bug of the async lib
				try {
					expect( order ).to.eql( [ 'flow' , 'listener' , 'setImmediate' , 'setTimeout25' , 'setTimeout50' ] ) ;
				}
				catch( error ) {
					// Or even slower than setTimeout(fn,25)... -_-'
					expect( order ).to.eql( [ 'flow' , 'listener' , 'setTimeout25' , 'setImmediate' , 'setTimeout50' ] ) ;
				}
			}
			done() ;
		} ) ;
	} ) ;
	
	it( "should emit asynchronously, with an asynchronous flow, with a 35ms delay (nice = 35 -> setTimeout 35ms)" , function( done ) {
		asyncEventTest( 35 , undefined , undefined , undefined , function( order ) {
			expect( order ).to.eql( [ 'flow' , 'setImmediate' , 'setTimeout25' , 'listener' , 'setTimeout50' ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( "should emit asynchronously, with an asynchronous flow, with a 70ms delay (nice = 70 -> setTimeout 70ms)" , function( done ) {
		asyncEventTest( 70 , undefined , undefined , undefined , function( order ) {
			expect( order ).to.eql( [ 'flow' , 'setImmediate' , 'setTimeout25' , 'setTimeout50' , 'listener' ] ) ;
			done() ;
		} ) ;
	} ) ;
	
	it( ".emit( nice , event , ... ) should overide emitter's nice value" , function( done ) {
		asyncEventTest( undefined , 35 , undefined , undefined , function( order ) {
			expect( order ).to.eql( [ 'flow' , 'setImmediate' , 'setTimeout25' , 'listener' , 'setTimeout50' ] ) ;
			asyncEventTest( NextGenEvents.SYNC , 35 , undefined , undefined , function( order ) {
				expect( order ).to.eql( [ 'flow' , 'setImmediate' , 'setTimeout25' , 'listener' , 'setTimeout50' ] ) ;
				asyncEventTest( 100 , 35 , undefined , undefined , function( order ) {
					expect( order ).to.eql( [ 'flow' , 'setImmediate' , 'setTimeout25' , 'listener' , 'setTimeout50' ] ) ;
					done() ;
				} ) ;
			} ) ;
		} ) ;
	} ) ;
	
	it( "should use the highest nice value between the context's nice, the listener's nice and the emitter's nice" , function( done ) {
		asyncEventTest( undefined , 35 , NextGenEvents.SYNC , NextGenEvents.SYNC , function( order ) {
			expect( order ).to.eql( [ 'flow' , 'setImmediate' , 'setTimeout25' , 'listener' , 'setTimeout50' ] ) ;
			asyncEventTest( undefined , NextGenEvents.SYNC , 35 , NextGenEvents.SYNC , function( order ) {
				expect( order ).to.eql( [ 'flow' , 'setImmediate' , 'setTimeout25' , 'listener' , 'setTimeout50' ] ) ;
				asyncEventTest( undefined , NextGenEvents.SYNC , NextGenEvents.SYNC , 35 , function( order ) {
					expect( order ).to.eql( [ 'flow' , 'setImmediate' , 'setTimeout25' , 'listener' , 'setTimeout50' ] ) ;
					done() ;
				} ) ;
			} ) ;
		} ) ;
	} ) ;
} ) ;



describe( "Next Gen feature: contexts" , function() {
	
	it( "when a listener is tied to a context, it should stop receiving events if the context is disabled (implicit context declaration)" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var triggered = 0 ;
		
		bus.on( 'foo' , {
			context: 'bar' ,
			fn: function() { triggered ++ ; }
		} ) ;
		
		bus.emit( 'foo' ) ;
		expect( triggered ).to.be( 1 ) ;
		
		bus.disableListenerContext( 'bar' ) ;
		bus.emit( 'foo' ) ;
		bus.emit( 'foo' ) ;
		bus.emit( 'foo' ) ;
		expect( triggered ).to.be( 1 ) ;
		
		bus.enableListenerContext( 'bar' ) ;
		bus.emit( 'foo' ) ;
		expect( triggered ).to.be( 2 ) ;
	} ) ;
	
	it( "when a listener is tied to a context, it should stop receiving events if the context is disabled (explicit context declaration)" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var triggered = 0 ;
		
		bus.addListenerContext( 'bar' , { status: NextGenEvents.CONTEXT_DISABLED } ) ;
		
		bus.on( 'foo' , {
			context: 'bar' ,
			fn: function() { triggered ++ ; }
		} ) ;
		
		bus.emit( 'foo' ) ;
		bus.emit( 'foo' ) ;
		bus.emit( 'foo' ) ;
		expect( triggered ).to.be( 0 ) ;
		
		bus.enableListenerContext( 'bar' ) ;
		bus.emit( 'foo' ) ;
		expect( triggered ).to.be( 1 ) ;
		
		bus.disableListenerContext( 'bar' ) ;
		bus.emit( 'foo' ) ;
		expect( triggered ).to.be( 1 ) ;
		
		bus.enableListenerContext( 'bar' ) ;
		bus.emit( 'foo' ) ;
		expect( triggered ).to.be( 2 ) ;
	} ) ;
	
	it( ".destroyListenerContext() should destroy a context and all listeners tied to it" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var stats = { count: {} , orders: [] } ;
		
		bus.on( 'foo' , {
			id: 'foo1' ,
			context: 'bar' ,
			fn: genericListener.bind( undefined , 'foo1' , stats , undefined )
		} ) ;
		
		bus.on( 'foo' , {
			id: 'foo2' ,
			context: 'bar' ,
			fn: genericListener.bind( undefined , 'foo2' , stats , undefined )
		} ) ;
		
		bus.on( 'baz' , {
			id: 'baz1' ,
			context: 'bar' ,
			fn: genericListener.bind( undefined , 'baz1' , stats , undefined )
		} ) ;
		
		bus.on( 'baz' , {
			id: 'baz2' ,
			context: 'qux' ,
			fn: genericListener.bind( undefined , 'baz2' , stats , undefined )
		} ) ;
		
		bus.emit( 'foo' ) ;
		expect( stats.count ).to.eql( { foo1: 1 , foo2: 1 } ) ;
		bus.emit( 'baz' ) ;
		expect( stats.count ).to.eql( { foo1: 1 , foo2: 1 , baz1: 1 , baz2: 1 } ) ;
		
		bus.destroyListenerContext( 'bar' ) ;
		bus.emit( 'foo' ) ;
		expect( stats.count ).to.eql( { foo1: 1 , foo2: 1 , baz1: 1 , baz2: 1 } ) ;
		bus.emit( 'baz' ) ;
		expect( stats.count ).to.eql( { foo1: 1 , foo2: 1 , baz1: 1 , baz2: 2 } ) ;
		
		bus.destroyListenerContext( 'qux' ) ;
		bus.emit( 'foo' ) ;
		expect( stats.count ).to.eql( { foo1: 1 , foo2: 1 , baz1: 1 , baz2: 2 } ) ;
		bus.emit( 'baz' ) ;
		expect( stats.count ).to.eql( { foo1: 1 , foo2: 1 , baz1: 1 , baz2: 2 } ) ;
	} ) ;
	
} ) ;



describe( "Next Gen feature: contexts queue" , function() {
	
	it( ".queueListenerContext() should pause the context, queueing events, .enableListenerContext() should resume pending events emitting" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var stats = { count: {} , orders: [] } ;
		
		bus.on( 'foo' , {
			id: 'foobar' ,
			context: 'qux' ,
			fn: genericListener.bind( undefined , 'foobar' , stats , function() {
				var args = Array.prototype.slice.call( arguments ) ;
				switch ( stats.count.foobar )
				{
					case 1 :
						expect( args ).to.eql( [ 'one' , 'two' , 'three' ] ) ;
						break ;
					case 2 :
						expect( args ).to.eql( [ 'four' , 'five' , 'six' ] ) ;
						break ;
					case 3 :
						expect( args ).to.eql( [] ) ;
						break ;
					case 4 :
						expect( args ).to.eql( [ 'seven' ] ) ;
						break ;
				}
			} )
		} ) ;
		
		bus.on( 'foo' , {
			id: 'foobaz' ,
			context: 'qux' ,
			fn: genericListener.bind( undefined , 'foobaz' , stats , function() {
				var args = Array.prototype.slice.call( arguments ) ;
				switch ( stats.count.foobaz )
				{
					case 1 :
						expect( args ).to.eql( [ 'one' , 'two' , 'three' ] ) ;
						break ;
					case 2 :
						expect( args ).to.eql( [ 'four' , 'five' , 'six' ] ) ;
						break ;
					case 3 :
						expect( args ).to.eql( [] ) ;
						break ;
					case 4 :
						expect( args ).to.eql( [ 'seven' ] ) ;
						break ;
				}
			} )
		} ) ;
		
		bus.on( 'qbar' , {
			id: 'qbarbaz' ,
			context: 'qbarbaz' ,
			fn: genericListener.bind( undefined , 'qbarbaz' , stats , undefined )
		} ) ;
		
		bus.emit( 'foo' , 'one' , 'two' , 'three' ) ;
		bus.emit( 'qbar' ) ;
		expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , qbarbaz: 1 } ) ;
		
		bus.queueListenerContext( 'qux' ) ;
		bus.emit( 'foo' , 'four' , 'five' , 'six' ) ;
		bus.emit( 'foo' ) ;
		bus.emit( 'foo' , 'seven' ) ;
		bus.emit( 'qbar' ) ;
		expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , qbarbaz: 2 } ) ;
		
		bus.enableListenerContext( 'qux' ) ;
		expect( stats.count ).to.eql( { foobar: 4 , foobaz: 4 , qbarbaz: 2 } ) ;
	} ) ;
	
} ) ;



describe( "Next Gen feature: contexts serialization" , function() {
	
	it( "3 async listeners for an event, tied to a serial context, each listener should be triggered one after the other" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var stats = { count: {} , orders: [] } ;
		
		bus.on( 'foo' , {
			id: 'foobar' ,
			context: 'qux' ,
			async: true ,
			fn: genericListener.bind( undefined , 'foobar' , stats , function() {
				var callback = arguments[ arguments.length - 1 ] ;
				setTimeout( callback , 30 ) ;
			} )
		} ) ;
		
		bus.on( 'foo' , {
			id: 'foobaz' ,
			context: 'qux' ,
			async: true ,
			fn: genericListener.bind( undefined , 'foobaz' , stats , function() {
				expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 } ) ;
				var callback = arguments[ arguments.length - 1 ] ;
				setTimeout( callback , 30 ) ;
			} )
		} ) ;
		
		bus.on( 'foo' , {
			id: 'foobarbaz' ,
			context: 'qux' ,
			async: true ,
			fn: genericListener.bind( undefined , 'foobarbaz' , stats , function() {
				expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , foobarbaz: 1 } ) ;
				var callback = arguments[ arguments.length - 1 ] ;
				setTimeout( function() {
					callback() ;
					done() ;
				} , 30 ) ;
			} )
		} ) ;
		
		bus.serializeListenerContext( 'qux' ) ;
		bus.emit( 'foo' ) ;
		expect( stats.count ).to.eql( { foobar: 1 } ) ;
	} ) ;
	
	it( "3 async listeners for 3 events, tied to a serial context, each listener should be triggered one after the other" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var stats = { count: {} , orders: [] } ;
		
		bus.on( 'bar' , {
			id: 'foobar' ,
			context: 'qux' ,
			async: true ,
			fn: genericListener.bind( undefined , 'foobar' , stats , function() {
				var callback = arguments[ arguments.length - 1 ] ;
				setTimeout( callback , 30 ) ;
			} )
		} ) ;
		
		bus.on( 'baz' , {
			id: 'foobaz' ,
			context: 'qux' ,
			async: true ,
			fn: genericListener.bind( undefined , 'foobaz' , stats , function() {
				expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 } ) ;
				var callback = arguments[ arguments.length - 1 ] ;
				setTimeout( callback , 30 ) ;
			} )
		} ) ;
		
		bus.on( 'barbaz' , {
			id: 'foobarbaz' ,
			context: 'qux' ,
			async: true ,
			fn: genericListener.bind( undefined , 'foobarbaz' , stats , function() {
				expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , foobarbaz: 1 } ) ;
				var callback = arguments[ arguments.length - 1 ] ;
				setTimeout( function() {
					callback() ;
					done() ;
				} , 30 ) ;
			} )
		} ) ;
		
		bus.serializeListenerContext( 'qux' ) ;
		bus.emit( 'bar' ) ;
		bus.emit( 'baz' ) ;
		bus.emit( 'barbaz' ) ;
		expect( stats.count ).to.eql( { foobar: 1 } ) ;
	} ) ;
	
	it( "mixing sync and async listeners tied to a serial context, sync event should not block (test 1)" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var stats = { count: {} , orders: [] } ;
		
		bus.on( 'bar' , {
			id: 'foobar' ,
			context: 'qux' ,
			fn: genericListener.bind( undefined , 'foobar' , stats , function() {
			} )
		} ) ;
		
		bus.on( 'baz' , {
			id: 'foobaz' ,
			context: 'qux' ,
			fn: genericListener.bind( undefined , 'foobaz' , stats , function() {
			} )
		} ) ;
		
		bus.on( 'barbaz' , {
			id: 'foobarbaz' ,
			context: 'qux' ,
			async: true ,
			fn: genericListener.bind( undefined , 'foobarbaz' , stats , function() {
				expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , foobarbaz: 1 } ) ;
				var callback = arguments[ arguments.length - 1 ] ;
				setTimeout( function() {
					callback() ;
					done() ;
				} , 30 ) ;
			} )
		} ) ;
		
		bus.serializeListenerContext( 'qux' ) ;
		bus.emit( 'bar' ) ;
		bus.emit( 'baz' ) ;
		bus.emit( 'barbaz' ) ;
		expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , foobarbaz: 1 } ) ;
	} ) ;
	
	it( "mixing sync and async listeners tied to a serial context, sync event should not block (test 2)" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var stats = { count: {} , orders: [] } ;
		
		bus.on( 'bar' , {
			id: 'foobar' ,
			context: 'qux' ,
			fn: genericListener.bind( undefined , 'foobar' , stats , function() {
			} )
		} ) ;
		
		bus.on( 'baz' , {
			id: 'foobaz' ,
			context: 'qux' ,
			async: true ,
			fn: genericListener.bind( undefined , 'foobaz' , stats , function() {
				expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 } ) ;
				var callback = arguments[ arguments.length - 1 ] ;
				setTimeout( callback , 30 ) ;
			} )
		} ) ;
		
		bus.on( 'barbaz' , {
			id: 'foobarbaz' ,
			context: 'qux' ,
			async: true ,
			fn: genericListener.bind( undefined , 'foobarbaz' , stats , function() {
				expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , foobarbaz: 1 } ) ;
				var callback = arguments[ arguments.length - 1 ] ;
				setTimeout( function() {
					callback() ;
					done() ;
				} , 30 ) ;
			} )
		} ) ;
		
		bus.serializeListenerContext( 'qux' ) ;
		bus.emit( 'bar' ) ;
		bus.emit( 'baz' ) ;
		bus.emit( 'barbaz' ) ;
		expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 } ) ;
	} ) ;
	
	it( "mixing sync and async listeners tied to a serial context, sync event should not block (test 3)" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		
		var stats = { count: {} , orders: [] } ;
		
		bus.on( 'bar' , {
			id: 'foobar' ,
			context: 'qux' ,
			async: true ,
			fn: genericListener.bind( undefined , 'foobar' , stats , function() {
				var callback = arguments[ arguments.length - 1 ] ;
				setTimeout( callback , 30 ) ;
			} )
		} ) ;
		
		bus.on( 'baz' , {
			id: 'foobaz' ,
			context: 'qux' ,
			fn: genericListener.bind( undefined , 'foobaz' , stats , function() {
				expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 } ) ;
				
				// 'barbaz' should trigger immediately
				process.nextTick( function() {
					expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , foobarbaz: 1 } ) ;
				} ) ;
			} )
		} ) ;
		
		bus.on( 'barbaz' , {
			id: 'foobarbaz' ,
			context: 'qux' ,
			async: true ,
			fn: genericListener.bind( undefined , 'foobarbaz' , stats , function() {
				expect( stats.count ).to.eql( { foobar: 1 , foobaz: 1 , foobarbaz: 1 } ) ;
				var callback = arguments[ arguments.length - 1 ] ;
				setTimeout( function() {
					callback() ;
					done() ;
				} , 30 ) ;
			} )
		} ) ;
		
		bus.serializeListenerContext( 'qux' ) ;
		bus.emit( 'bar' ) ;
		bus.emit( 'baz' ) ;
		bus.emit( 'barbaz' ) ;
		expect( stats.count ).to.eql( { foobar: 1 } ) ;
	} ) ;
	
} ) ;



describe( "Next Gen feature: interrupt event emitting, and 'interrupt' event" , function() {
	
	it( "should fire an event, the first listener should interrupt it, thus firing an 'interrupt' event" , function() {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		bus.setInterruptible( true ) ;
		
		var onFoo1 , onFoo2 , onFoo3 , onInterrupt1 , onInterrupt2 ;
		var triggered = { foo1: 0 , foo2: 0 , foo3: 0 , interrupt1: 0 , interrupt2: 0 } ;
		
		// 3 listeners for 'foo'
		bus.on( 'foo' , onFoo1 = function() { triggered.foo1 ++ ; return { want: 'interruption' } ; } ) ;
		bus.on( 'foo' , onFoo2 = function() { triggered.foo2 ++ ; } ) ;
		bus.on( 'foo' , onFoo3 = function() { triggered.foo3 ++ ; } ) ;
		
		bus.on( 'interrupt' , onInterrupt1 = function( object ) {
			triggered.interrupt1 ++ ;
			expect( object ).to.eql( { want: 'interruption' } ) ;
		} ) ;
		
		bus.on( 'interrupt' , onInterrupt2 = function( object ) {
			triggered.interrupt2 ++ ;
			expect( object ).to.eql( { want: 'interruption' } ) ;
		} ) ;
		
		bus.emit( 'foo' ) ;
		expect( triggered ).to.eql( { foo1: 1 , foo2: 0 , foo3: 0 , interrupt1: 1 , interrupt2: 1 } ) ;
	} ) ;
	
	it( "should fire asynchronously an event, the first listener should interrupt it, thus firing an 'interrupt' event" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		bus.setInterruptible( true ) ;
		
		var onFoo1 , onFoo2 , onFoo3 , onInterrupt1 , onInterrupt2 ;
		var triggered = { foo1: 0 , foo2: 0 , foo3: 0 , interrupt1: 0 , interrupt2: 0 } ;
		
		// 3 listeners for 'foo'
		bus.on( 'foo' , onFoo1 = function() { triggered.foo1 ++ ; return { want: 'interruption' } ; } ) ;
		bus.on( 'foo' , onFoo2 = function() { triggered.foo2 ++ ; } ) ;
		bus.on( 'foo' , onFoo3 = function() { triggered.foo3 ++ ; } ) ;
		
		bus.on( 'interrupt' , onInterrupt1 = function( object ) {
			triggered.interrupt1 ++ ;
			expect( object ).to.eql( { want: 'interruption' } ) ;
		} ) ;
		
		bus.on( 'interrupt' , onInterrupt2 = function( object ) {
			triggered.interrupt2 ++ ;
			//console.error( ">>> object: " , object ) ;
			expect( object ).to.eql( { want: 'interruption' } ) ;
			expect( triggered ).to.eql( { foo1: 1 , foo2: 0 , foo3: 0 , interrupt1: 1 , interrupt2: 1 } ) ;
			done() ;
		} ) ;
		
		bus.emit( 20 , 'foo' ) ;
	} ) ;
	
	it( "should fire asynchronously an event, the first listener should interrupt it using its callback, thus firing an 'interrupt' event" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		bus.setInterruptible( true ) ;
		
		var onFoo1 , onFoo2 , onFoo3 , onInterrupt1 , onInterrupt2 ;
		var triggered = { foo1: 0 , foo2: 0 , foo3: 0 , interrupt1: 0 , interrupt2: 0 } ;
		
		// 3 listeners for 'foo'
		onFoo1 = function( callback ) {
			triggered.foo1 ++ ;
			callback( { want: 'interruption' } ) ;
		} ;
		bus.on( 'foo' , onFoo1 , { async: true } ) ;
		bus.on( 'foo' , onFoo2 = function() { triggered.foo2 ++ ; } ) ;
		bus.on( 'foo' , onFoo3 = function() { triggered.foo3 ++ ; } ) ;
		
		bus.on( 'interrupt' , onInterrupt1 = function( object ) {
			triggered.interrupt1 ++ ;
			expect( object ).to.eql( { want: 'interruption' } ) ;
		} ) ;
		
		bus.on( 'interrupt' , onInterrupt2 = function( object ) {
			triggered.interrupt2 ++ ;
			//console.error( ">>> object: " , object ) ;
			expect( object ).to.eql( { want: 'interruption' } ) ;
			expect( triggered ).to.eql( { foo1: 1 , foo2: 0 , foo3: 0 , interrupt1: 1 , interrupt2: 1 } ) ;
			done() ;
		} ) ;
		
		bus.emit( 20 , 'foo' ) ;
	} ) ;
} ) ;



describe( "Next Gen feature: completion callback" , function() {
	
	it( "should emit an event with a completion callback, triggered when all synchronous listener have finished running" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		bus.setInterruptible( true ) ;
		
		var onFoo1 , onFoo2 , onFoo3 ;
		var triggered = { foo1: 0 , foo2: 0 , foo3: 0 } ;
		
		// 3 listeners for 'foo'
		bus.on( 'foo' , onFoo1 = function() { triggered.foo1 ++ ; } ) ;
		bus.on( 'foo' , onFoo2 = function() { triggered.foo2 ++ ; } ) ;
		bus.on( 'foo' , onFoo3 = function() { triggered.foo3 ++ ; } ) ;
		
		bus.emit( 'foo' , function() {
			expect( arguments.length ).to.be( 2 ) ;
			expect( triggered ).to.eql( { foo1: 1 , foo2: 1 , foo3: 1 } ) ;
			
			bus.emit( -1 , 'foo' , function() {
				expect( arguments.length ).to.be( 2 ) ;
				expect( triggered ).to.eql( { foo1: 2 , foo2: 2 , foo3: 2 } ) ;
				
				bus.emit( 10 , 'foo' , function() {
					expect( arguments.length ).to.be( 2 ) ;
					expect( triggered ).to.eql( { foo1: 3 , foo2: 3 , foo3: 3 } ) ;
					done() ;
				} ) ;
			} ) ;
		} ) ;
	} ) ;
	
	it( "if the event is interrupted, the completion callback should be triggered with the 'interrupt' value" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		bus.setInterruptible( true ) ;
		
		var onFoo1 , onFoo2 , onFoo3 ;
		var triggered = { foo1: 0 , foo2: 0 , foo3: 0 } ;
		
		// 3 listeners for 'foo'
		bus.on( 'foo' , onFoo1 = function() { triggered.foo1 ++ ; } ) ;
		bus.on( 'foo' , onFoo2 = function() { triggered.foo2 ++ ; return { want: 'interruption' } ; } ) ;
		bus.on( 'foo' , onFoo3 = function() { triggered.foo3 ++ ; } ) ;
		
		bus.emit( 'foo' , function( interruption ) {
			expect( arguments.length ).to.be( 2 ) ;
			expect( interruption ).to.eql( { want: 'interruption' } ) ;
			expect( triggered ).to.eql( { foo1: 1 , foo2: 1 , foo3: 0 } ) ;
			
			bus.emit( -1 , 'foo' , function( interruption ) {
				expect( arguments.length ).to.be( 2 ) ;
				expect( interruption ).to.eql( { want: 'interruption' } ) ;
				expect( triggered ).to.eql( { foo1: 2 , foo2: 2 , foo3: 0 } ) ;
				
				bus.emit( 10 , 'foo' , function( interruption ) {
					expect( arguments.length ).to.be( 2 ) ;
					expect( interruption ).to.eql( { want: 'interruption' } ) ;
					expect( triggered ).to.eql( { foo1: 3 , foo2: 3 , foo3: 0 } ) ;
					done() ;
				} ) ;
			} ) ;
		} ) ;
	} ) ;
	
	it( "the completion callback should work with asynchronous listener" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		bus.setInterruptible( true ) ;
		
		var onFoo1 , onFoo2 , onFoo3 ;
		var triggered = { foo1: 0 , foo2: 0 , foo3: 0 } ;
		
		// 3 listeners for 'foo'
		onFoo1 = function( callback ) {
			setTimeout( function() {
				triggered.foo1 ++ ;
				callback() ;
			} , 10 ) ;
		} ;
		bus.on( 'foo' , onFoo1 , { async: true } ) ;
		bus.on( 'foo' , onFoo2 = function() { triggered.foo2 ++ ; } ) ;
		bus.on( 'foo' , onFoo3 = function() { triggered.foo3 ++ ; } ) ;
		
		bus.emit( 'foo' , function() {
			expect( arguments.length ).to.be( 2 ) ;
			expect( triggered ).to.eql( { foo1: 1 , foo2: 1 , foo3: 1 } ) ;
			
			bus.emit( -1 , 'foo' , function() {
				expect( arguments.length ).to.be( 2 ) ;
				expect( triggered ).to.eql( { foo1: 2 , foo2: 2 , foo3: 2 } ) ;
				
				bus.emit( 10 , 'foo' , function() {
					expect( arguments.length ).to.be( 2 ) ;
					expect( triggered ).to.eql( { foo1: 3 , foo2: 3 , foo3: 3 } ) ;
					done() ;
				} ) ;
			} ) ;
		} ) ;
	} ) ;
	
	it( "the completion callback should work with listeners asynchronously interrupting the event" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		bus.setInterruptible( true ) ;
		
		var onFoo1 , onFoo2 , onFoo3 ;
		var triggered = { foo1: 0 , foo2: 0 , foo3: 0 } ;
		
		// 3 listeners for 'foo'
		onFoo1 = function( callback ) {
			setTimeout( function() {
				triggered.foo1 ++ ;
				callback( { want: 'interruption' } ) ;
			} , 10 ) ;
		} ;
		bus.on( 'foo' , onFoo1 , { async: true } ) ;
		bus.on( 'foo' , onFoo2 = function() { triggered.foo2 ++ ; } ) ;
		bus.on( 'foo' , onFoo3 = function() { triggered.foo3 ++ ; } ) ;
		
		bus.emit( 'foo' , function( interruption ) {
			expect( arguments.length ).to.be( 2 ) ;
			expect( interruption ).to.eql( { want: 'interruption' } ) ;
			expect( triggered ).to.eql( { foo1: 1 , foo2: 1 , foo3: 1 } ) ;
			
			bus.emit( -1 , 'foo' , function( interruption ) {
				expect( arguments.length ).to.be( 2 ) ;
				expect( interruption ).to.eql( { want: 'interruption' } ) ;
				expect( triggered ).to.eql( { foo1: 2 , foo2: 2 , foo3: 2 } ) ;
				
				bus.emit( 10 , 'foo' , function( interruption ) {
					expect( arguments.length ).to.be( 2 ) ;
					expect( interruption ).to.eql( { want: 'interruption' } ) ;
					expect( triggered ).to.eql( { foo1: 3 , foo2: 3 , foo3: 3 } ) ;
					done() ;
				} ) ;
			} ) ;
		} ) ;
	} ) ;
	
	it( "the completion callback should work with an async listeners synchronously interrupting the event with its callback" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		bus.setInterruptible( true ) ;
		
		var onFoo1 , onFoo2 , onFoo3 ;
		var triggered = { foo1: 0 , foo2: 0 , foo3: 0 } ;
		
		// 3 listeners for 'foo'
		onFoo1 = function( callback ) {
			triggered.foo1 ++ ;
			callback( { want: 'interruption' } ) ;
		} ;
		bus.on( 'foo' , onFoo1 , { async: true } ) ;
		bus.on( 'foo' , onFoo2 = function() { triggered.foo2 ++ ; } ) ;
		bus.on( 'foo' , onFoo3 = function() { triggered.foo3 ++ ; } ) ;
		
		bus.emit( 'foo' , function( interruption ) {
			expect( arguments.length ).to.be( 2 ) ;
			expect( interruption ).to.eql( { want: 'interruption' } ) ;
			expect( triggered ).to.eql( { foo1: 1 , foo2: 0 , foo3: 0 } ) ;
			
			bus.emit( -1 , 'foo' , function( interruption ) {
				expect( arguments.length ).to.be( 2 ) ;
				expect( interruption ).to.eql( { want: 'interruption' } ) ;
				expect( triggered ).to.eql( { foo1: 2 , foo2: 0 , foo3: 0 } ) ;
				
				bus.emit( 10 , 'foo' , function( interruption ) {
					expect( arguments.length ).to.be( 2 ) ;
					expect( interruption ).to.eql( { want: 'interruption' } ) ;
					expect( triggered ).to.eql( { foo1: 3 , foo2: 0 , foo3: 0 } ) ;
					done() ;
				} ) ;
			} ) ;
		} ) ;
	} ) ;
	
	it( "the completion callback should work with an async listeners synchronously interrupting the event using return" , function( done ) {
		
		var bus = Object.create( NextGenEvents.prototype ) ;
		bus.setInterruptible( true ) ;
		
		var onFoo1 , onFoo2 , onFoo3 ;
		var triggered = { foo1: 0 , foo1timeout: 0 , foo2: 0 , foo3: 0 } ;
		
		// 3 listeners for 'foo'
		onFoo1 = function( callback ) {
			triggered.foo1 ++ ;
			setTimeout( function() {
				triggered.foo1timeout ++ ;
				callback() ;
			} , 10 ) ;
			return { want: 'interruption' } ;
		} ;
		bus.on( 'foo' , onFoo1 , { async: true } ) ;
		bus.on( 'foo' , onFoo2 = function() { triggered.foo2 ++ ; } ) ;
		bus.on( 'foo' , onFoo3 = function() { triggered.foo3 ++ ; } ) ;
		
		bus.emit( 'foo' , function( interruption ) {
			expect( arguments.length ).to.be( 2 ) ;
			expect( interruption ).to.eql( { want: 'interruption' } ) ;
			expect( triggered ).to.eql( { foo1: 1 , foo1timeout: 0 , foo2: 0 , foo3: 0 } ) ;
			
			bus.emit( -1 , 'foo' , function( interruption ) {
				expect( arguments.length ).to.be( 2 ) ;
				expect( interruption ).to.eql( { want: 'interruption' } ) ;
				expect( triggered ).to.eql( { foo1: 2 , foo1timeout: 0 , foo2: 0 , foo3: 0 } ) ;
				
				bus.emit( 10 , 'foo' , function( interruption ) {
					expect( arguments.length ).to.be( 2 ) ;
					expect( interruption ).to.eql( { want: 'interruption' } ) ;
					expect( triggered ).to.eql( { foo1: 3 , foo1timeout: 2 , foo2: 0 , foo3: 0 } ) ;
					done() ;
				} ) ;
			} ) ;
		} ) ;
	} ) ;
} ) ;



}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"../lib/NextGenEvents.js":1,"../lib/browser.js":3,"_process":11,"expect.js":4}],7:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  that.write(string, encoding)
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

function arrayIndexOf (arr, val, byteOffset, encoding) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var foundIndex = -1
  for (var i = byteOffset; i < arrLength; ++i) {
    if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
      if (foundIndex === -1) foundIndex = i
      if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
    } else {
      if (foundIndex !== -1) i -= i - foundIndex
      foundIndex = -1
    }
  }

  return -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  if (Buffer.isBuffer(val)) {
    // special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(this, val, byteOffset, encoding)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset, encoding)
  }

  throw new TypeError('val must be string, number or Buffer')
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":8,"ieee754":9,"isarray":10}],8:[function(require,module,exports){
'use strict'

exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

function init () {
  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i]
    revLookup[code.charCodeAt(i)] = i
  }

  revLookup['-'.charCodeAt(0)] = 62
  revLookup['_'.charCodeAt(0)] = 63
}

init()

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length

  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0

  // base64 is 4/3 + up to two characters of the original data
  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],9:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],10:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],11:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
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
    var timeout = cachedSetTimeout.call(null, cleanUpNextTick);
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
    cachedClearTimeout.call(null, timeout);
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
        cachedSetTimeout.call(null, drainQueue, 0);
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

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}]},{},[6]);
