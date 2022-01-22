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



/*
	Prerequisite.
*/



const NativePromise = global.Promise ;

// Cross-platform next tick function
var nextTick ;

if ( ! process.browser ) {
	nextTick = process.nextTick ;
}
else {
	// Browsers suck, they don't have setImmediate() except IE/Edge.
	// A module is needed to emulate it.
	require( 'setimmediate' ) ;
	nextTick = setImmediate ;
}



/*
	Constructor.
*/



function Promise( fn ) {
	this.fn = fn ;
	this._then = Promise._dormantThen ;
	this.value = null ;
	this.thenHandlers = null ;
	this.handledRejection = null ;

	if ( this.fn ) {
		this._exec() ;
	}
}

module.exports = Promise ;



Promise.Native = NativePromise ;
Promise.warnUnhandledRejection = true ;



Promise.prototype._exec = function() {
	this._then = Promise._pendingThen ;

	try {
		this.fn(
			// Don't return anything, it would create nasty bugs! E.g.:
			// bad: error => this.reject( error_ )
			// good: error_ => { this.reject( error_ ) ; }
			result_ => { this.resolve( result_ ) ; } ,
			error_ => { this.reject( error_ ) ; }
		) ;
	}
	catch ( error ) {
		this.reject( error ) ;
	}
} ;



/*
	Resolve/reject and then-handlers management.
*/



Promise.prototype.resolve = Promise.prototype.fulfill = function( value ) {
	// Throw an error?
	if ( this._then.settled ) { return this ; }

	if ( Promise.isThenable( value ) ) {
		this._execThenPromise( value ) ;
		return this ;
	}

	return this._resolveValue( value ) ;
} ;



Promise.prototype._resolveValue = function( value ) {
	this._then = Promise._fulfilledThen ;
	this.value = value ;
	if ( this.thenHandlers && this.thenHandlers.length ) { this._execFulfillHandlers() ; }

	return this ;
} ;



// Faster on node v8.x
Promise.prototype._execThenPromise = function( thenPromise ) {
	try {
		thenPromise.then(
			result_ => { this.resolve( result_ ) ; } ,
			error_ => { this.reject( error_ ) ; }
		) ;
	}
	catch ( error ) {
		this.reject( error ) ;
	}
} ;



Promise.prototype.reject = function( error ) {
	// Throw an error?
	if ( this._then.settled ) { return this ; }

	this._then = Promise._rejectedThen ;
	this.value = error ;

	if ( this.thenHandlers && this.thenHandlers.length ) {
		this._execRejectionHandlers() ;
	}
	else if ( Promise.warnUnhandledRejection && ! this.handledRejection ) {
		this._unhandledRejection() ;
	}

	return this ;
} ;



Promise.prototype._execFulfillHandlers = function() {
	var i ,
		length = this.thenHandlers.length ;

	// Do cache the length, if a handler is synchronously added, it will be called on next tick
	for ( i = 0 ; i < length ; i += 3 ) {
		if ( this.thenHandlers[ i + 1 ] ) {
			this._execOneFulfillHandler( this.thenHandlers[ i ] , this.thenHandlers[ i + 1 ] ) ;
		}
		else {
			this.thenHandlers[ i ].resolve( this.value ) ;
		}
	}
} ;



// Faster on node v8.x?
//*
Promise.prototype._execOneFulfillHandler = function( promise , onFulfill ) {
	try {
		promise.resolve( onFulfill( this.value ) ) ;
	}
	catch ( error_ ) {
		promise.reject( error_ ) ;
	}
} ;
//*/



Promise.prototype._execRejectionHandlers = function() {
	var i ,
		length = this.thenHandlers.length ;

	// Do cache the length, if a handler is synchronously added, it will be called on next tick
	for ( i = 0 ; i < length ; i += 3 ) {
		if ( this.thenHandlers[ i + 2 ] ) {
			this._execOneRejectHandler( this.thenHandlers[ i ] , this.thenHandlers[ i + 2 ] ) ;
		}
		else {
			this.thenHandlers[ i ].reject( this.value ) ;
		}
	}
} ;



// Faster on node v8.x?
//*
Promise.prototype._execOneRejectHandler = function( promise , onReject ) {
	try {
		promise.resolve( onReject( this.value ) ) ;
	}
	catch ( error_ ) {
		promise.reject( error_ ) ;
	}
} ;
//*/



Promise.prototype.resolveTimeout = Promise.prototype.fulfillTimeout = function( time , result ) {
	setTimeout( () => this.resolve( result ) , time ) ;
} ;



Promise.prototype.rejectTimeout = function( time , error ) {
	setTimeout( () => this.reject( error ) , time ) ;
} ;



/*
	.then() variants depending on the state
*/



// .then() variant when the promise is dormant
Promise._dormantThen = function( onFulfill , onReject ) {
	if ( this.fn ) {
		// If this is a dormant promise, wake it up now!
		this._exec() ;

		// Return now, some sync stuff can change the status
		return this._then( onFulfill , onReject ) ;
	}

	var promise = new Promise() ;

	if ( ! this.thenHandlers ) {
		this.thenHandlers = [ promise , onFulfill , onReject ] ;
	}
	else {
		//this.thenHandlers.push( onFulfill ) ;
		this.thenHandlers[ this.thenHandlers.length ] = promise ;
		this.thenHandlers[ this.thenHandlers.length ] = onFulfill ;
		this.thenHandlers[ this.thenHandlers.length ] = onReject ;
	}

	return promise ;
} ;

Promise._dormantThen.settled = false ;



// .then() variant when the promise is pending
Promise._pendingThen = function( onFulfill , onReject ) {
	var promise = new Promise() ;

	if ( ! this.thenHandlers ) {
		this.thenHandlers = [ promise , onFulfill , onReject ] ;
	}
	else {
		//this.thenHandlers.push( onFulfill ) ;
		this.thenHandlers[ this.thenHandlers.length ] = promise ;
		this.thenHandlers[ this.thenHandlers.length ] = onFulfill ;
		this.thenHandlers[ this.thenHandlers.length ] = onReject ;
	}

	return promise ;
} ;

Promise._pendingThen.settled = false ;



// .then() variant when the promise is fulfilled
Promise._fulfilledThen = function( onFulfill ) {
	if ( ! onFulfill ) { return this ; }

	var promise = new Promise() ;

	// This handler should not fire in this code sync flow
	nextTick( () => {
		try {
			promise.resolve( onFulfill( this.value ) ) ;
		}
		catch ( error ) {
			promise.reject( error ) ;
		}
	} ) ;

	return promise ;
} ;

Promise._fulfilledThen.settled = true ;



// .then() variant when the promise is rejected
Promise._rejectedThen = function( onFulfill , onReject ) {
	if ( ! onReject ) { return this ; }

	this.handledRejection = true ;
	var promise = new Promise() ;

	// This handler should not fire in this code sync flow
	nextTick( () => {
		try {
			promise.resolve( onReject( this.value ) ) ;
		}
		catch ( error ) {
			promise.reject( error ) ;
		}
	} ) ;

	return promise ;
} ;

Promise._rejectedThen.settled = true ;



/*
	.then() and short-hands.
*/



Promise.prototype.then = function( onFulfill , onReject ) {
	return this._then( onFulfill , onReject ) ;
} ;



Promise.prototype.catch = function( onReject = () => undefined ) {
	return this._then( undefined , onReject ) ;
} ;



Promise.prototype.finally = function( onSettled ) {
	return this._then( onSettled , onSettled ) ;
} ;



Promise.prototype.tap = Promise.prototype.tapThen = function( onFulfill ) {
	this._then( onFulfill , undefined ) ;
	return this ;
} ;



Promise.prototype.tapCatch = function( onReject ) {
	this._then( undefined , onReject ) ;
	return this ;
} ;



Promise.prototype.tapFinally = function( onSettled ) {
	this._then( onSettled , onSettled ) ;
	return this ;
} ;



// Any unhandled error throw ASAP
Promise.prototype.fatal = function() {
	this._then( undefined , error => {
		// Throw async, otherwise it would be catched by .then()
		nextTick( () => { throw error ; } ) ;
	} ) ;
} ;



Promise.prototype.done = function( onFulfill , onReject ) {
	this._then( onFulfill , onReject ).fatal() ;
	return this ;
} ;



Promise.prototype.callback = function( cb ) {
	this._then(
		value => { cb( undefined , value ) ; } ,
		error => { cb( error ) ; }
	).fatal() ;

	return this ;
} ;



Promise.prototype.callbackAll = function( cb ) {
	this._then(
		values => {
			if ( Array.isArray( values ) ) { cb( undefined , ... values ) ; }
			else { cb( undefined , values ) ; }
		} ,
		error => { cb( error ) ; }
	).fatal() ;

	return this ;
} ;



/*
	The reverse of .callback(), it calls the function with a callback argument and return a promise that resolve or reject depending on that callback invocation.
	Usage:
		await Promise.callback( callback => myFunctionRelyingOnCallback( [arg1] , [arg2] , [...] , callback ) ;
*/
Promise.callback = function( fn ) {
	return new Promise( ( resolve , reject ) => {
		fn( ( error , arg ) => {
			if ( error ) { reject( error ) ; }
			else { resolve( arg ) ; }
		} ) ;
	} ) ;
} ;



Promise.callbackAll = function( fn ) {
	return new Promise( ( resolve , reject ) => {
		fn( ( error , ... args ) => {
			if ( error ) { reject( error ) ; }
			else { resolve( args ) ; }
		} ) ;
	} ) ;
} ;



Promise.prototype.toPromise =	// <-- DEPRECATED, use .propagate
Promise.prototype.propagate = function( promise ) {
	this._then(
		value => { promise.resolve( value ) ; } ,
		error => { promise.reject( error ) ; }
	) ;

	return this ;
} ;





/*
	Foreign promises facilities
*/



Promise.propagate = function( foreignPromise , promise ) {
	foreignPromise.then(
		value => { promise.resolve( value ) ; } ,
		error => { promise.reject( error ) ; }
	) ;

	return foreignPromise ;
} ;



Promise.finally = function( foreignPromise , onSettled ) {
	return foreignPromise.then( onSettled , onSettled ) ;
} ;





/*
	Static factories.
*/



Promise.resolve = Promise.fulfill = function( value ) {
	if ( Promise.isThenable( value ) ) { return Promise.fromThenable( value ) ; }
	return Promise._resolveValue( value ) ;
} ;



Promise._resolveValue = function( value ) {
	var promise = new Promise() ;
	promise._then = Promise._fulfilledThen ;
	promise.value = value ;
	return promise ;
} ;



Promise.reject = function( error ) {
	//return new Promise().reject( error ) ;
	var promise = new Promise() ;
	promise._then = Promise._rejectedThen ;
	promise.value = error ;
	return promise ;
} ;



Promise.resolveTimeout = Promise.fulfillTimeout = function( timeout , value ) {
	return new Promise( resolve => setTimeout( () => resolve( value ) , timeout ) ) ;
} ;



Promise.rejectTimeout = function( timeout , error ) {
	return new Promise( ( resolve , reject ) => setTimeout( () => reject( error ) , timeout ) ) ;
} ;



Promise.resolveNextTick = Promise.fulfillNextTick = function( value ) {
	return new Promise( resolve => nextTick( () => resolve( value ) ) ) ;
} ;



Promise.rejectNextTick = function( error ) {
	return new Promise( ( resolve , reject ) => nextTick( () => reject( error ) ) ) ;
} ;



// A dormant promise is activated the first time a then handler is assigned
Promise.dormant = function( fn ) {
	var promise = new Promise() ;
	promise.fn = fn ;
	return promise ;
} ;



// Try-catched Promise.resolve( fn() )
Promise.try = function( fn ) {
	try {
		return Promise.resolve( fn() ) ;
	}
	catch ( error ) {
		return Promise.reject( error ) ;
	}
} ;



/*
	Thenables.
*/



Promise.isThenable = function( value ) {
	return value && typeof value === 'object' && typeof value.then === 'function' ;
} ;



// We assume a thenable object here
Promise.fromThenable = function( thenable ) {
	if ( thenable instanceof Promise ) { return thenable ; }

	return new Promise( ( resolve , reject ) => {
		thenable.then(
			value => { resolve( value ) ; } ,
			error => { reject( error ) ; }
		) ;
	} ) ;
} ;



// When you just want a fast then() function out of anything, without any desync and unchainable
Promise._bareThen = function( value , onFulfill , onReject ) {
	//if ( Promise.isThenable( value ) )
	if( value && typeof value === 'object' ) {
		if ( value instanceof Promise ) {
			if ( value._then === Promise._fulfilledThen ) { onFulfill( value.value ) ; }
			else if ( value._then === Promise._rejectedThen ) { onReject( value.value ) ; }
			else { value._then( onFulfill , onReject ) ; }
		}
		else if ( typeof value.then === 'function' ) {
			value.then( onFulfill , onReject ) ;
		}
		else {
			onFulfill( value ) ;
		}
	}
	else {
		onFulfill( value ) ;
	}
} ;



/*
	Misc.
*/



// Internal usage, mark all promises as handled ahead of time, useful for series,
// because a warning would be displayed for unhandled rejection for promises that are not yet processed.
Promise._handleAll = function( iterable ) {
	var value ;

	for ( value of iterable ) {
		//if ( ( value instanceof Promise ) || ( value instanceof NativePromise ) )
		if ( Promise.isThenable( value ) ) {
			value.handledRejection = true ;
		}
	}
} ;



Promise.prototype._unhandledRejection = function() {
	// This promise is currently unhandled
	// If still unhandled at the end of the synchronous block of code,
	// output an error message.

	this.handledRejection = false ;

	// Don't know what is the correct way to inform node.js about that.
	// There is no doc about that, and emitting unhandledRejection,
	// does not produce what is expected.

	//process.emit( 'unhandledRejection' , this.value , this ) ;

	/*
	nextTick( () => {
		if ( this.handledRejection === false )
		{
			process.emit( 'unhandledRejection' , this.value , this ) ;
		}
	} ) ;
	*/

	// It looks like 'await' inside a 'try-catch' does not handle the promise soon enough -_-'
	//const nextTick_ = nextTick ;
	const nextTick_ = cb => setTimeout( cb , 0 ) ;

	//*
	if ( this.value instanceof Error ) {
		nextTick_( () => {
			if ( this.handledRejection === false ) {
				this.value.message = 'Unhandled promise rejection: ' + this.value.message ;
				console.error( this.value ) ;
			}
		} ) ;
	}
	else {
		// Avoid starting the stack trace in the nextTick()...
		let error_ = new Error( 'Unhandled promise rejection' ) ;
		nextTick_( () => {
			if ( this.handledRejection === false ) {
				console.error( error_ ) ;
				console.error( 'Rejection reason:' , this.value ) ;
			}
		} ) ;
	}
	//*/
} ;



Promise.prototype.isSettled = function() { return this._then.settled ; } ;



Promise.prototype.getStatus = function() {
	switch ( this._then ) {
		case Promise._dormantThen :
			return 'dormant' ;
		case Promise._pendingThen :
			return 'pending' ;
		case Promise._fulfilledThen :
			return 'fulfilled' ;
		case Promise._rejectedThen :
			return 'rejected' ;
	}
} ;



Promise.prototype.inspect = function() {
	switch ( this._then ) {
		case Promise._dormantThen :
			return 'Promise { <DORMANT> }' ;
		case Promise._pendingThen :
			return 'Promise { <PENDING> }' ;
		case Promise._fulfilledThen :
			return 'Promise { <FULFILLED> ' + this.value + ' }' ;
		case Promise._rejectedThen :
			return 'Promise { <REJECTED> ' + this.value + ' }' ;
	}
} ;



// A shared dummy promise, when you just want to return an immediately thenable
Promise.resolved = Promise.dummy = Promise.resolve() ;





/*
	Browser specific.
*/



if ( process.browser ) {
	Promise.prototype.resolveAtAnimationFrame = function( value ) {
		window.requestAnimationFrame( () => this.resolve( value ) ) ;
	} ;

	Promise.prototype.rejectAtAnimationFrame = function( error ) {
		window.requestAnimationFrame( () => this.reject( error ) ) ;
	} ;

	Promise.resolveAtAnimationFrame = function( value ) {
		return new Promise( resolve => window.requestAnimationFrame( () => resolve( value ) ) ) ;
	} ;

	Promise.rejectAtAnimationFrame = function( error ) {
		return new Promise( ( resolve , reject ) => window.requestAnimationFrame( () => reject( error ) ) ) ;
	} ;
}

