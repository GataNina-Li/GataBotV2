/*
	Seventh

	Copyright (c) 2017 - 2020 Cédric Ronvel

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



const Promise = require( './seventh.js' ) ;



Promise.timeLimit = ( timeout , asyncFnOrPromise ) => {
	return new Promise( ( resolve , reject ) => {
		if ( typeof asyncFnOrPromise === 'function' ) { asyncFnOrPromise = asyncFnOrPromise() ; }
		Promise.resolve( asyncFnOrPromise ).then( resolve , reject ) ;
		setTimeout( () => reject( new Error( "Timeout" ) ) , timeout ) ;
	} ) ;
} ;



/*
	options:
		retries: number of retry
		coolDown: time before retrying
		raiseFactor: time multiplier for each successive cool down
		maxCoolDown: maximum cool-down, the raising time is capped to this value
		timeout: time before assuming it has failed, 0 = no time limit
		catch: `function` (optional) if absent, the function is always retried until it reaches the limit,
			if present, that catch-function is used like a normal promise catch block, the function is retry
			only if the catch-function does not throw or return a rejecting promise
*/
Promise.retry = ( options , asyncFn ) => {
	var count = options.retries || 1 ,
		coolDown = options.coolDown || 0 ,
		raiseFactor = options.raiseFactor || 1 ,
		maxCoolDown = options.maxCoolDown || Infinity ,
		timeout = options.timeout || 0 ,
		catchFn = options.catch || null ;

	const oneTry = () => {
		return ( timeout ? Promise.timeLimit( timeout , asyncFn ) : asyncFn() ).catch( error => {
			if ( ! count -- ) { throw error ; }

			var currentCoolDown = coolDown ;
			coolDown = Math.min( coolDown * raiseFactor , maxCoolDown ) ;

			if ( catchFn ) {
				// Call the custom catch function
				// Let it crash, if it throw we are already in a .catch() block
				return Promise.resolve( catchFn( error ) ).then( () => Promise.resolveTimeout( currentCoolDown ).then( oneTry ) ) ;
			}

			return Promise.resolveTimeout( currentCoolDown ).then( oneTry ) ;
		} ) ;
	} ;

	return oneTry() ;
} ;



// Resolve once an event is fired
Promise.onceEvent = ( emitter , eventName ) => {
	return new Promise( resolve => emitter.once( eventName , resolve ) ) ;
} ;



// Resolve once an event is fired, resolve with an array of arguments
Promise.onceEventAll = ( emitter , eventName ) => {
	return new Promise( resolve => emitter.once( eventName , ( ... args ) => resolve( args ) ) ) ;
} ;



// Resolve once an event is fired, or reject on error
Promise.onceEventOrError = ( emitter , eventName , excludeEvents , _internalAllArgs = false ) => {
	return new Promise( ( resolve , reject ) => {
		var altRejects ;

		// We care about removing listener, especially 'error', because if an error kick in after, it should throw because there is no listener
		var resolve_ = ( ... args ) => {
			emitter.removeListener( 'error' , reject_ ) ;

			if ( altRejects ) {
				for ( let event in altRejects ) {
					emitter.removeListener( event , altRejects[ event ] ) ;
				}
			}

			resolve( _internalAllArgs ? args : args[ 0 ] ) ;
		} ;

		var reject_ = arg => {
			emitter.removeListener( eventName , resolve_ ) ;

			if ( altRejects ) {
				for ( let event in altRejects ) {
					emitter.removeListener( event , altRejects[ event ] ) ;
				}
			}

			reject( arg ) ;
		} ;

		emitter.once( eventName , resolve_ ) ;
		emitter.once( 'error' , reject_ ) ;

		if ( excludeEvents ) {
			if ( ! Array.isArray( excludeEvents ) ) { excludeEvents = [ excludeEvents ] ; }

			altRejects = {} ;

			excludeEvents.forEach( event => {
				var altReject = ( ... args ) => {
					emitter.removeListener( 'error' , reject_ ) ;
					emitter.removeListener( eventName , resolve_ ) ;

					var error = new Error( "Received an excluded event: " + event ) ;
					error.event = event ;
					error.eventArgs = args ;
					reject( error ) ;
				} ;

				emitter.once( event , altReject ) ;

				altRejects[ event ] = altReject ;
			} ) ;
		}
	} ) ;
} ;



// Resolve once an event is fired, or reject on error, resolve with an array of arguments, reject with the first argument
Promise.onceEventAllOrError = ( emitter , eventName , excludeEvents ) => {
	return Promise.onceEventOrError( emitter , eventName , excludeEvents , true ) ;
} ;

