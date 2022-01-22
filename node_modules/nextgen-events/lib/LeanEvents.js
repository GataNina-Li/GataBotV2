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



function LeanEvents() {}
module.exports = LeanEvents ;
LeanEvents.prototype.__prototypeUID__ = 'nextgen-events/LeanEvents' ;
LeanEvents.prototype.__prototypeVersion__ = require( '../package.json' ).version ;



// .addListener( eventName , fn , [id] )
LeanEvents.prototype.on = LeanEvents.prototype.addListener = function( eventName , fn , id , once ) {
	if ( ! this.__listeners ) { this.__listeners = {} ; }
	if ( ! this.__listeners[ eventName ] ) { this.__listeners[ eventName ] = [] ; }

	var stateArgs = this.__states && this.__states[ eventName ] ;

	if ( stateArgs && once ) {
		// Don't even add it to listeners, just run it now
		fn( ... stateArgs ) ;
		return ;
	}

	var listener = {
		id: id ?? fn ,
		fn: fn ,
		once: !! once
	} ;

	//this.__listeners[ eventName ].push( listener ) ;	// .push() is slower
	var listeners = this.__listeners[ eventName ] ;
	listeners[ listeners.length ] = listener ;

	if ( stateArgs ) {
		fn( ... stateArgs ) ;
	}
} ;



// Short-hand
// .once( eventName , fn , [id] )
LeanEvents.prototype.once = function( eventName , fn , id ) { return this.addListener( eventName , fn , id , true ) ; } ;



// .waitFor( eventName )
// A Promise-returning .once() variant, only the first arg is returned
LeanEvents.prototype.waitFor = function( eventName ) {
	return new Promise( resolve => {
		this.addListener( eventName , ( firstArg ) => resolve( firstArg ) , undefined , true ) ;
	} ) ;
} ;



// .waitForAll( eventName )
// A Promise-returning .once() variant, all args are returned as an array
LeanEvents.prototype.waitForAll = function( eventName ) {
	return new Promise( resolve => {
		this.addListener( eventName , ( ... args ) => resolve( args ) , undefined , true ) ;
	} ) ;
} ;



LeanEvents.prototype.off = LeanEvents.prototype.removeListener = function( eventName , id ) {
	if ( ! this.__listeners || ! this.__listeners[ eventName ] || ! this.__listeners[ eventName ].length ) { return ; }

	// Don't modify the listener array in place, an emit may be in progress (could cause recursive trouble).
	// We assume that it's less frequent to remove a listener than to emit an event.
	this.__listeners[ eventName ] = this.__listeners[ eventName ].filter( listener => listener.id !== id ) ;

	/*	Same speed than .filter()
	var i , iMax , iNew , newListeners = [] , listeners = this.__listeners[ eventName ] ;
	for ( i = 0 , iMax = listeners.length , iNew = 0 ; i < iMax ; i ++ ) {
		if ( listeners[ i ].id !== id ) {
			newListeners[ iNew ++ ] = listeners[ i ] ;
		}
	}

	this.__listeners[ eventName ] = newListeners ;
	//*/

	return this ;
} ;



LeanEvents.prototype.removeAllListeners = function( eventName ) {
	if ( ! this.__listeners ) { return ; }

	if ( eventName ) {
		// Don't modify the listener array, an emit may be in progress (could cause recursive trouble)
		//this.__listeners[ eventName ].length = 0 ;
		delete this.__listeners[ eventName ] ;
	}
	else {
		// Remove all listeners for any events
		this.__listeners = {} ;
	}

	return this ;
} ;



/*
	emit( eventName , [arg1] , [arg2] , [...] )
*/
LeanEvents.prototype.emit = function( eventName , ... args ) {
	var i , iMax , listeners , listener , stateArgs , stateGroup ;

	// Note that when a state is off, it is set to null, hence checking undefined is the way to know if it is a state event.
	if ( this.__states && ( stateArgs = this.__states[ eventName ] ) !== undefined ) {
		// This is a state event, register it NOW even if there is no listener!

		if ( stateArgs && args.length === stateArgs.length && ( ! args.length || args.every( ( arg , index ) => arg === stateArgs[ index ] ) ) ) {
			// The emitter is already in this exact state, skip it now!
			return ;
		}

		// Unset all states of that group
		stateGroup = this.__stateGroups[ eventName ] ;
		for ( i = 0 , iMax = stateGroup.length ; i < iMax ; i ++ ) {
			this.__states[ stateGroup[ i ] ] = null ;
		}

		this.__states[ eventName ] = args ;
	}

	if ( ! this.__listeners ) { return ; }

	// listeners AND listeners.length MUST be cached, to avoid recursive trouble (adding/removing a listener inside of a listener)
	listeners = this.__listeners[ eventName ] ;
	if ( ! listeners || ! listeners.length ) { return ; }

	// Emit the event to all listeners!
	for ( i = 0 , iMax = listeners.length ; i < iMax ; i ++ ) {
		listener = listeners[ i ] ;

		// If it's a one-time listener, we should remove it RIGHT NOW because of recursive .emit() issues:
		// one listener may eventually fire this very same event synchronously during the current loop.
		if ( listener.once ) { this.removeListener( eventName , listener.id ) ; }

		listener.fn( ... args ) ;
	}
	return this ;
} ;



LeanEvents.prototype.listeners = function( eventName ) {
	if ( ! this.__listeners || ! this.__listeners[ eventName ] ) { return [] ; }

	// Do not return the array, shallow copy it
	return this.__listeners[ eventName ].slice() ;
} ;



LeanEvents.prototype.listenerCount = function( eventName ) {
	if ( ! this.__listeners || ! this.__listeners[ eventName ] ) { return 0 ; }
	return this.__listeners[ eventName ].length ;
} ;



/* Next Gen feature: states! */

// .defineStates( exclusiveState1 , [exclusiveState2] , [exclusiveState3] , ... )
LeanEvents.prototype.defineStates = function( ... states ) {
	if ( ! this.__states ) {
		this.__states = {} ;
		this.__stateGroups = {} ;
	}

	states.forEach( state => {
		this.__states[ state ] = null ;
		this.__stateGroups[ state ] = states ;
	} ) ;
} ;



LeanEvents.prototype.hasState = function( state ) {
	if ( ! this.__states ) { return false ; }
	return !! this.__states[ state ] ;
} ;



LeanEvents.prototype.getAllStates = function() {
	if ( ! this.__states ) { return [] ; }
	return Object.keys( this.__states ).filter( state => this.__states[ state ] ) ;
} ;

