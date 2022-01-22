(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Promise7th = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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



function Queue( jobRunner , concurrency = 4 ) {
	this.jobRunner = jobRunner ;
	this.jobs = new Map() ;			// all jobs
	this.pendingJobs = new Map() ;	// only pending jobs (not run)
	this.runningJobs = new Map() ;	// only running jobs (not done)
	this.errorJobs = new Map() ;	// jobs that have failed
	this.jobsDone = new Map() ;		// jobs that finished successfully
	this.concurrency = + concurrency || 1 ;

	// Internal
	this.isQueueRunning = true ;
	this.isLoopRunning = false ;
	this.canLoopAgain = false ;
	this.ready = Promise.resolved ;

	// Misc
	this.startTime = null ;		// timestamp at the first time the loop is run
	this.endTime = null ;		// timestamp at the last time the loop exited

	// External API, resolved when there is no jobs anymore in the queue, a new Promise is created when new element are injected
	this.drained = Promise.resolved ;

	// External API, resolved when the Queue has nothing to do: either it's drained or the pending jobs have dependencies that cannot be solved
	this.idle = Promise.resolved ;
}

Promise.Queue = Queue ;



function Job( id , dependencies = null , data = undefined ) {
	this.id = id ;
	this.dependencies = dependencies === null ? null : [ ... dependencies ] ;
	this.data = data === undefined ? id : data ;
	this.error = null ;
	this.startTime = null ;
	this.endTime = null ;
}

Queue.Job = Job ;



Queue.prototype.setConcurrency = function( concurrency ) { this.concurrency = + concurrency || 1 ; } ;
Queue.prototype.stop = Queue.prototype.pause = function() { this.isQueueRunning = false ; } ;
Queue.prototype.has = function( id ) { return this.jobs.has( id ) ; } ;



Queue.prototype.add = Queue.prototype.addJob = function( id , data , dependencies = null ) {
	// Don't add it twice!
	if ( this.jobs.has( id ) ) { return false ; }

	var job = new Job( id , dependencies , data ) ;
	this.jobs.set( id , job ) ;
	this.pendingJobs.set( id , job ) ;
	this.canLoopAgain = true ;
	if ( this.isQueueRunning && ! this.isLoopRunning ) { this.run() ; }
	if ( this.drained.isSettled() ) { this.drained = new Promise() ; }
	return job ;
} ;



// Add a batch of jobs, with only id (data=id) and no dependencies
Queue.prototype.addBatch = Queue.prototype.addJobBatch = function( ids ) {
	var id , job ;

	for ( id of ids ) {
		// Don't add it twice!
		if ( this.jobs.has( id ) ) { return false ; }
		job = new Job( id ) ;
		this.jobs.set( id , job ) ;
		this.pendingJobs.set( id , job ) ;
	}

	this.canLoopAgain = true ;
	if ( this.isQueueRunning && ! this.isLoopRunning ) { this.run() ; }
	if ( this.drained.isSettled() ) { this.drained = new Promise() ; }
} ;



Queue.prototype.run = Queue.prototype.resume = async function() {
	var job ;

	this.isQueueRunning = true ;

	if ( this.isLoopRunning ) { return ; }
	this.isLoopRunning = true ;

	if ( ! this.startTime ) { this.startTime = Date.now() ; }

	do {
		this.canLoopAgain = false ;

		for ( job of this.pendingJobs.values() ) {
			if ( job.dependencies && job.dependencies.some( dependencyId => ! this.jobsDone.has( dependencyId ) ) ) { continue ; }
			// This should be done synchronously:
			if ( this.idle.isSettled() ) { this.idle = new Promise() ; }
			this.canLoopAgain = true ;

			await this.ready ;

			// Something has stopped the queue while we were awaiting.
			// This check MUST be done only after "await", before is potentially synchronous, and things only change concurrently during an "await"
			if ( ! this.isQueueRunning ) { this.finishRun() ; return ; }

			this.runJob( job ) ;
		}
	} while ( this.canLoopAgain ) ;

	this.finishRun() ;
} ;



// Finish current run
Queue.prototype.finishRun = function() {
	this.isLoopRunning = false ;

	if ( ! this.pendingJobs.size ) { this.drained.resolve() ; }

	if ( ! this.runningJobs.size ) {
		this.endTime = Date.now() ;
		this.idle.resolve() ;
	}
} ;



Queue.prototype.runJob = async function( job ) {
	// Immediately remove it synchronously from the pending queue and add it to the running one
	this.pendingJobs.delete( job.id ) ;
	this.runningJobs.set( job.id , job ) ;

	if ( this.runningJobs.size >= this.concurrency ) { this.ready = new Promise() ; }

	// Async part
	try {
		job.startTime = Date.now() ;
		await this.jobRunner( job.data ) ;
		job.endTime = Date.now() ;
		this.jobsDone.set( job.id , job ) ;
		this.canLoopAgain = true ;
	}
	catch ( error ) {
		job.endTime = Date.now() ;
		job.error = error ;
		this.errorJobs.set( job.id , job ) ;
	}

	this.runningJobs.delete( job.id ) ;
	if ( this.runningJobs.size < this.concurrency ) { this.ready.resolve() ; }

	// This MUST come last, because it retry the loop: dependencies may have been unlocked!
	if ( ! this.isLoopRunning ) {
		if ( this.isQueueRunning && this.pendingJobs.size ) { this.run() ; }
		else { this.finishRun() ; }
	}
} ;



Queue.prototype.getJobTimes = function() {
	var job , stats = {} ;
	for ( job of this.jobsDone.values() ) { stats[ job.id ] = job.endTime - job.startTime ; }
	return stats ;
} ;



Queue.prototype.getStats = function() {
	var job , sum = 0 ,
		stats = {
			pending: this.pendingJobs.size ,
			running: this.runningJobs.size ,
			failed: this.errorJobs.size ,
			done: this.jobsDone.size ,
			averageJobTime: null ,
			queueTime: null
		} ;

	if ( this.jobsDone.size ) {
		for ( job of this.jobsDone.values() ) { sum += job.endTime - job.startTime ; }
		stats.averageJobTime = sum / this.jobsDone.size ;
	}

	if ( this.endTime ) { stats.queueTime = this.endTime - this.startTime ; }

	return stats ;
} ;


},{"./seventh.js":8}],2:[function(require,module,exports){
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



Promise.promisifyNodeApi = ( api , suffix , multiSuffix , filter , anything ) => {
	var keys ;

	suffix = suffix || 'Async' ;
	multiSuffix = multiSuffix || 'AsyncAll' ;
	filter = filter || ( key => key[ 0 ] !== '_' && ! key.endsWith( 'Sync' ) ) ;

	if ( anything ) {
		keys = [] ;

		for ( let key in api ) {
			if ( typeof api[ key ] === 'function' ) { keys.push( key ) ; }
		}
	}
	else {
		keys = Object.keys( api ) ;
	}

	keys.filter( key => {
		if ( typeof api[ key ] !== 'function' ) { return false ; }

		// If it has any enumerable properties on its prototype, it's a constructor
		for ( let trash in api[ key ].prototype ) { return false ; }

		return filter( key , api ) ;
	} )
		.forEach( key => {
			const targetKey = key + suffix ;
			const multiTargetKey = key + multiSuffix ;

			// Do nothing if it already exists
			if ( ! api[ targetKey ] ) {
				api[ targetKey ] = Promise.promisify( api[ key ] , api ) ;
			}

			if ( ! api[ multiTargetKey ] ) {
				api[ multiTargetKey ] = Promise.promisifyAll( api[ key ] , api ) ;
			}
		} ) ;
} ;



Promise.promisifyAnyNodeApi = ( api , suffix , multiSuffix , filter ) => {
	Promise.promisifyNodeApi( api , suffix , multiSuffix , filter , true ) ;
} ;



},{"./seventh.js":8}],3:[function(require,module,exports){
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



// This object is used as a special unique value for array hole (see Promise.filter())
const HOLE = {} ;

function noop() {}



Promise.all = ( iterable ) => {
	var index = -1 , settled = false ,
		count = 0 , length = Infinity ,
		value , values = [] ,
		allPromise = new Promise() ;

	for ( value of iterable ) {
		if ( settled ) { break ; }

		index ++ ;

		// Create a scope to keep track of the promise's own index
		( () => {
			const promiseIndex = index ;

			Promise.resolve( value )
				.then(
					value_ => {
						if ( settled ) { return ; }

						values[ promiseIndex ] = value_ ;
						count ++ ;

						if ( count >= length ) {
							settled = true ;
							allPromise._resolveValue( values ) ;
						}
					} ,
					error => {
						if ( settled ) { return ; }
						settled = true ;
						allPromise.reject( error ) ;
					}
				) ;
		} )() ;
	}

	length = index + 1 ;

	if ( ! length ) {
		allPromise._resolveValue( values ) ;
	}

	return allPromise ;
} ;



// Maybe faster, but can't find any reasonable grounds for that ATM
//Promise.all =
Promise._allArray = ( iterable ) => {
	var length = iterable.length ;

	if ( ! length ) { Promise._resolveValue( [] ) ; }

	var index ,
		runtime = {
			settled: false ,
			count: 0 ,
			length: length ,
			values: [] ,
			allPromise: new Promise()
		} ;

	for ( index = 0 ; ! runtime.settled && index < length ; index ++ ) {
		Promise._allArrayOne( iterable[ index ] , index , runtime ) ;
	}

	return runtime.allPromise ;
} ;



// internal for allArray
Promise._allArrayOne = ( value , index , runtime ) => {
	Promise._bareThen( value ,
		value_ => {
			if ( runtime.settled ) { return ; }

			runtime.values[ index ] = value_ ;
			runtime.count ++ ;

			if ( runtime.count >= runtime.length ) {
				runtime.settled = true ;
				runtime.allPromise._resolveValue( runtime.values ) ;
			}
		} ,
		error => {
			if ( runtime.settled ) { return ; }
			runtime.settled = true ;
			runtime.allPromise.reject( error ) ;
		}
	) ;
} ;


// Promise.all() with an iterator
Promise.every =
Promise.map = ( iterable , iterator ) => {
	var index = -1 , settled = false ,
		count = 0 , length = Infinity ,
		value , values = [] ,
		allPromise = new Promise() ;

	for ( value of iterable ) {
		if ( settled ) { break ; }

		index ++ ;

		// Create a scope to keep track of the promise's own index
		( () => {
			const promiseIndex = index ;

			Promise.resolve( value )
				.then( value_ => {
					if ( settled ) { return ; }
					return iterator( value_ , promiseIndex ) ;
				} )
				.then(
					value_ => {
						if ( settled ) { return ; }

						values[ promiseIndex ] = value_ ;
						count ++ ;

						if ( count >= length ) {
							settled = true ;
							allPromise._resolveValue( values ) ;
						}
					} ,
					error => {
						if ( settled ) { return ; }
						settled = true ;
						allPromise.reject( error ) ;
					}
				) ;
		} )() ;
	}

	length = index + 1 ;

	if ( ! length ) {
		allPromise._resolveValue( values ) ;
	}

	return allPromise ;
} ;



/*
	It works symmetrically with Promise.all(), the resolve and reject logic are switched.
	Therefore, it resolves to the first resolving promise OR reject if all promises are rejected
	with, as a reason, the array of all promise rejection reasons.
*/
Promise.any = ( iterable ) => {
	var index = -1 , settled = false ,
		count = 0 , length = Infinity ,
		value ,
		errors = [] ,
		anyPromise = new Promise() ;

	for ( value of iterable ) {
		if ( settled ) { break ; }

		index ++ ;

		// Create a scope to keep track of the promise's own index
		( () => {
			const promiseIndex = index ;

			Promise.resolve( value )
				.then(
					value_ => {
						if ( settled ) { return ; }

						settled = true ;
						anyPromise._resolveValue( value_ ) ;
					} ,
					error => {
						if ( settled ) { return ; }

						errors[ promiseIndex ] = error ;
						count ++ ;

						if ( count >= length ) {
							settled = true ;
							anyPromise.reject( errors ) ;
						}
					}
				) ;
		} )() ;
	}

	length = index + 1 ;

	if ( ! length ) {
		anyPromise.reject( new RangeError( 'Promise.any(): empty array' ) ) ;
	}

	return anyPromise ;
} ;



// Like Promise.any() but with an iterator
Promise.some = ( iterable , iterator ) => {
	var index = -1 , settled = false ,
		count = 0 , length = Infinity ,
		value ,
		errors = [] ,
		anyPromise = new Promise() ;

	for ( value of iterable ) {
		if ( settled ) { break ; }

		index ++ ;

		// Create a scope to keep track of the promise's own index
		( () => {
			const promiseIndex = index ;

			Promise.resolve( value )
				.then( value_ => {
					if ( settled ) { return ; }
					return iterator( value_ , promiseIndex ) ;
				} )
				.then(
					value_ => {
						if ( settled ) { return ; }

						settled = true ;
						anyPromise._resolveValue( value_ ) ;
					} ,
					error => {
						if ( settled ) { return ; }

						errors[ promiseIndex ] = error ;
						count ++ ;

						if ( count >= length ) {
							settled = true ;
							anyPromise.reject( errors ) ;
						}
					}
				) ;
		} )() ;
	}

	length = index + 1 ;

	if ( ! length ) {
		anyPromise.reject( new RangeError( 'Promise.any(): empty array' ) ) ;
	}

	return anyPromise ;
} ;



/*
	More closed to Array#filter().
	The iterator should return truthy if the array element should be kept,
	or falsy if the element should be filtered out.
	Any rejection reject the whole promise.
*/
Promise.filter = ( iterable , iterator ) => {
	var index = -1 , settled = false ,
		count = 0 , length = Infinity ,
		value , values = [] ,
		filterPromise = new Promise() ;

	for ( value of iterable ) {
		if ( settled ) { break ; }

		index ++ ;

		// Create a scope to keep track of the promise's own index
		( () => {
			const promiseIndex = index ;

			Promise.resolve( value )
				.then( value_ => {
					if ( settled ) { return ; }
					values[ promiseIndex ] = value_ ;
					return iterator( value_ , promiseIndex ) ;
				} )
				.then(
					iteratorValue => {
						if ( settled ) { return ; }

						count ++ ;

						if ( ! iteratorValue ) { values[ promiseIndex ] = HOLE ; }

						if ( count >= length ) {
							settled = true ;
							values = values.filter( e => e !== HOLE ) ;
							filterPromise._resolveValue( values ) ;
						}
					} ,
					error => {
						if ( settled ) { return ; }
						settled = true ;
						filterPromise.reject( error ) ;
					}
				) ;
		} )() ;
	}

	length = index + 1 ;

	if ( ! length ) {
		filterPromise._resolveValue( values ) ;
	}
	else if ( count >= length ) {
		settled = true ;
		values = values.filter( e => e !== HOLE ) ;
		filterPromise._resolveValue( values ) ;
	}

	return filterPromise ;
} ;



// forEach performs reduce as well, if a third argument is supplied
// Force a function statement because we are using arguments.length, so we can support accumulator equals to undefined
Promise.foreach =
Promise.forEach = function( iterable , iterator , accumulator ) {
	var index = -1 ,
		isReduce = arguments.length >= 3 ,
		it = iterable[Symbol.iterator]() ,
		forEachPromise = new Promise() ,
		lastPromise = Promise.resolve( accumulator ) ;

	// The array-like may contains promises that could be rejected before being handled
	if ( Promise.warnUnhandledRejection ) { Promise._handleAll( iterable ) ; }

	var nextElement = () => {
		lastPromise.then(
			accumulator_ => {
				let { value , done } = it.next() ;
				index ++ ;

				if ( done ) {
					forEachPromise.resolve( accumulator_ ) ;
				}
				else {
					lastPromise = Promise.resolve( value ).then(
						isReduce ?
							value_ => iterator( accumulator_ , value_ , index ) :
							value_ => iterator( value_ , index )
					) ;

					nextElement() ;
				}
			} ,
			error => {
				forEachPromise.reject( error ) ;

				// We have to eat all remaining promise errors
				for ( ;; ) {
					let { value , done } = it.next() ;
					if ( done ) { break ; }

					//if ( ( value instanceof Promise ) || ( value instanceof NativePromise ) )
					if ( Promise.isThenable( value ) ) {
						value.then( noop , noop ) ;
					}
				}
			}
		) ;
	} ;

	nextElement() ;

	return forEachPromise ;
} ;



Promise.reduce = ( iterable , iterator , accumulator ) => {
	// Force 3 arguments
	return Promise.forEach( iterable , iterator , accumulator ) ;
} ;



/*
	Same than map, but iterate over an object and produce an object.
	Think of it as a kind of Object#map() (which of course does not exist).
*/
Promise.mapObject = ( inputObject , iterator ) => {
	var settled = false ,
		count = 0 ,
		i , key , keys = Object.keys( inputObject ) ,
		length = keys.length ,
		value , outputObject = {} ,
		mapPromise = new Promise() ;

	for ( i = 0 ; ! settled && i < length ; i ++ ) {
		key = keys[ i ] ;
		value = inputObject[ key ] ;

		// Create a scope to keep track of the promise's own key
		( () => {
			const promiseKey = key ;

			Promise.resolve( value )
				.then( value_ => {
					if ( settled ) { return ; }
					return iterator( value_ , promiseKey ) ;
				} )
				.then(
					value_ => {
						if ( settled ) { return ; }

						outputObject[ promiseKey ] = value_ ;
						count ++ ;

						if ( count >= length ) {
							settled = true ;
							mapPromise._resolveValue( outputObject ) ;
						}
					} ,
					error => {
						if ( settled ) { return ; }
						settled = true ;
						mapPromise.reject( error ) ;
					}
				) ;
		} )() ;
	}

	if ( ! length ) {
		mapPromise._resolveValue( outputObject ) ;
	}

	return mapPromise ;
} ;



// Like map, but with a concurrency limit
Promise.concurrent = ( limit , iterable , iterator ) => {
	var index = -1 , settled = false ,
		running = 0 ,
		count = 0 , length = Infinity ,
		value , done = false ,
		values = [] ,
		it = iterable[Symbol.iterator]() ,
		concurrentPromise = new Promise() ;

	// The array-like may contains promises that could be rejected before being handled
	if ( Promise.warnUnhandledRejection ) { Promise._handleAll( iterable ) ; }

	limit = + limit || 1 ;

	const runBatch = () => {
		while ( ! done && running < limit ) {

			//console.log( "Pre" , index ) ;
			( { value , done } = it.next() ) ;

			if ( done ) {
				length = index + 1 ;

				if ( count >= length ) {
					settled = true ;
					concurrentPromise._resolveValue( values ) ;
					return ;
				}
				break ;
			}

			if ( settled ) { break ; }

			index ++ ;

			// Create a scope to keep track of the promise's own index
			( () => {
				const promiseIndex = index ;

				running ++ ;
				//console.log( "Launch" , promiseIndex ) ;

				Promise.resolve( value )
					.then( value_ => {
						if ( settled ) { return ; }
						return iterator( value_ , promiseIndex ) ;
					} )
					.then(
						value_ => {
						//console.log( "Done" , promiseIndex , value_ ) ;
							if ( settled ) { return ; }

							values[ promiseIndex ] = value_ ;
							count ++ ;
							running -- ;

							//console.log( "count/length" , count , length ) ;
							if ( count >= length ) {
								settled = true ;
								concurrentPromise._resolveValue( values ) ;
								return ;
							}

							if ( running < limit ) {
								runBatch() ;
								return ;
							}
						} ,
						error => {
							if ( settled ) { return ; }
							settled = true ;
							concurrentPromise.reject( error ) ;
						}
					) ;
			} )() ;
		}
	} ;

	runBatch() ;

	if ( index < 0 ) {
		concurrentPromise._resolveValue( values ) ;
	}

	return concurrentPromise ;
} ;



/*
	Like native Promise.race(), it is hanging forever if the array is empty.
	It resolves or rejects to the first resolved/rejected promise.
*/
Promise.race = ( iterable ) => {
	var settled = false ,
		value ,
		racePromise = new Promise() ;

	for ( value of iterable ) {
		if ( settled ) { break ; }

		Promise.resolve( value )
			.then(
				value_ => {
					if ( settled ) { return ; }

					settled = true ;
					racePromise._resolveValue( value_ ) ;
				} ,
				error => {
					if ( settled ) { return ; }

					settled = true ;
					racePromise.reject( error ) ;
				}
			) ;
	}

	return racePromise ;
} ;


},{"./seventh.js":8}],4:[function(require,module,exports){
(function (process,global,setImmediate){
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


}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("timers").setImmediate)
},{"_process":11,"setimmediate":10,"timers":12}],5:[function(require,module,exports){
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



Promise.promisifyAll = ( nodeAsyncFn , thisBinding ) => {
	// Little optimization here to have a promisified function as fast as possible
	if ( thisBinding ) {
		return ( ... args ) => {
			return new Promise( ( resolve , reject ) => {
				nodeAsyncFn.call( thisBinding , ... args , ( error , ... cbArgs ) => {
					if ( error ) {
						if ( cbArgs.length && error instanceof Error ) { error.args = cbArgs ; }
						reject( error ) ;
					}
					else {
						resolve( cbArgs ) ;
					}
				} ) ;
			} ) ;
		} ;
	}

	return function( ... args ) {
		return new Promise( ( resolve , reject ) => {
			nodeAsyncFn.call( this , ... args , ( error , ... cbArgs ) => {
				if ( error ) {
					if ( cbArgs.length && error instanceof Error ) { error.args = cbArgs ; }
					reject( error ) ;
				}
				else {
					resolve( cbArgs ) ;
				}
			} ) ;
		} ) ;
	} ;

} ;



// Same than .promisifyAll() but only return the callback args #1 instead of an array of args from #1 to #n
Promise.promisify = ( nodeAsyncFn , thisBinding ) => {
	// Little optimization here to have a promisified function as fast as possible
	if ( thisBinding ) {
		return ( ... args ) => {
			return new Promise( ( resolve , reject ) => {
				nodeAsyncFn.call( thisBinding , ... args , ( error , cbArg ) => {
					if ( error ) {
						if ( cbArg !== undefined && error instanceof Error ) { error.arg = cbArg ; }
						reject( error ) ;
					}
					else {
						resolve( cbArg ) ;
					}
				} ) ;
			} ) ;
		} ;
	}

	return function( ... args ) {
		return new Promise( ( resolve , reject ) => {
			nodeAsyncFn.call( this , ... args , ( error , cbArg ) => {
				if ( error ) {
					if ( cbArg !== undefined && error instanceof Error ) { error.arg = cbArg ; }
					reject( error ) ;
				}
				else {
					resolve( cbArg ) ;
				}
			} ) ;
		} ) ;
	} ;
} ;



/*
	Pass a function that will be called every time the decoratee return something.
*/
Promise.returnValueInterceptor = ( interceptor , asyncFn , thisBinding ) => {
	return function( ... args ) {
		var returnVal = asyncFn.call( thisBinding || this , ... args ) ;
		interceptor( returnVal ) ;
		return returnVal ;
	} ;
} ;



/*
	Run only once, return always the same promise.
*/
Promise.once = ( asyncFn , thisBinding ) => {
	var triggered = false ;
	var result ;

	return function( ... args ) {
		if ( ! triggered ) {
			triggered = true ;
			result = asyncFn.call( thisBinding || this , ... args ) ;
		}

		return result ;
	} ;
} ;



/*
	The decoratee execution does not overlap, multiple calls are serialized.
*/
Promise.serialize = ( asyncFn , thisBinding ) => {
	var lastPromise = new Promise.resolve() ;

	return function( ... args ) {
		var promise = new Promise() ;

		lastPromise.finally( () => {
			Promise.propagate( asyncFn.call( thisBinding || this , ... args ) , promise ) ;
		} ) ;

		lastPromise = promise ;

		return promise ;
	} ;
} ;



/*
	It does nothing if the decoratee is still in progress, but return the promise of the action in progress.
*/
Promise.debounce = ( asyncFn , thisBinding ) => {
	var inProgress = null ;

	const outWrapper = () => {
		inProgress = null ;
	} ;

	return function( ... args ) {
		if ( inProgress ) { return inProgress ; }

		inProgress = asyncFn.call( thisBinding || this , ... args ) ;
		Promise.finally( inProgress , outWrapper ) ;
		return inProgress ;
	} ;
} ;



/*
	Like .debouce(), but the last promise is returned for some extra time after it resolved
*/
Promise.debounceDelay = ( delay , asyncFn , thisBinding ) => {
	var inProgress = null ;

	const outWrapper = () => {
		setTimeout( () => inProgress = null , delay ) ;
	} ;

	return function( ... args ) {
		if ( inProgress ) { return inProgress ; }

		inProgress = asyncFn.call( thisBinding || this , ... args ) ;
		Promise.finally( inProgress , outWrapper ) ;
		return inProgress ;
	} ;
} ;



/*
	It does nothing if the decoratee is still in progress.
	Instead, the decoratee is called when finished once and only once, if it was tried one or more time during its progress.
	In case of multiple calls, the arguments of the last call will be used.
	The use case is .update()/.refresh()/.redraw() functions.
*/
Promise.debounceUpdate = ( asyncFn , thisBinding ) => {
	var inProgress = null ;
	var nextUpdateWith = null ;
	var nextUpdatePromise = null ;

	const outWrapper = () => {
		var args , sharedPromise ;

		inProgress = null ;

		if ( nextUpdateWith ) {
			args = nextUpdateWith ;
			nextUpdateWith = null ;
			sharedPromise = nextUpdatePromise ;
			nextUpdatePromise = null ;

			// Call the asyncFn again
			inProgress = asyncFn.call( ... args ) ;

			// Forward the result to the pending promise
			Promise.propagate( inProgress , sharedPromise ) ;

			// BTW, trigger again the outWrapper
			Promise.finally( inProgress , outWrapper ) ;

			return inProgress ;
		}
	} ;

	return function( ... args ) {
		var localThis = thisBinding || this ;

		if ( inProgress ) {
			if ( ! nextUpdatePromise ) { nextUpdatePromise = new Promise() ; }
			nextUpdateWith = [ localThis , ... args ] ;
			return nextUpdatePromise ;
		}

		inProgress = asyncFn.call( localThis , ... args ) ;
		Promise.finally( inProgress , outWrapper ) ;
		return inProgress ;
	} ;
} ;



// Used to ensure that the sync is done immediately if not busy
Promise.NO_DELAY = {} ;

// Used to ensure that the sync is done immediately if not busy, but for the first of a batch
Promise.BATCH_NO_DELAY = {} ;

/*
	Debounce for synchronization algorithm.
	Get two functions, one for getting from upstream, one for a full sync with upstream (getting AND updating).
	No operation overlap for a given resourceId.
	Depending on the configuration, it is either like .debounce() or like .debounceUpdate().

	*Params:
		fn: the function
		thisBinding: the this binding, if any
		delay: the minimum delay between to call
			for get: nothing is done is the delay is not met, simply return the last promise
			for update/fullSync, it waits for that delay before synchronizing again
		onDebounce: *ONLY* for GET ATM, a callback called when debounced
*/
Promise.debounceSync = ( getParams , fullSyncParams ) => {
	var perResourceData = new Map() ;

	const getResourceData = resourceId => {
		var resourceData = perResourceData.get( resourceId ) ;

		if ( ! resourceData ) {
			resourceData = {
				inProgress: null ,
				inProgressIsFull: null ,
				last: null ,				// Get or full sync promise
				lastTime: null ,			// Get or full sync time
				lastFullSync: null ,		// last full sync promise
				lastFullSyncTime: null ,	// last full sync time
				nextFullSyncPromise: null ,	// the promise for the next fullSync iteration
				nextFullSyncWith: null , 	// the 'this' and arguments for the next fullSync iteration
				noDelayBatches: new Set()		// only the first of the batch has no delay
			} ;

			perResourceData.set( resourceId , resourceData ) ;
		}

		return resourceData ;
	} ;


	const outWrapper = ( resourceData , level ) => {
		// level 2: fullSync, 1: get, 0: nothing but a delay
		var delta , args , sharedPromise , now = new Date() ;
		//lastTime = resourceData.lastTime , lastFullSyncTime = resourceData.lastFullSyncTime ;

		resourceData.inProgress = null ;

		if ( level >= 2 ) { resourceData.lastFullSyncTime = resourceData.lastTime = now ; }
		else if ( level >= 1 ) { resourceData.lastTime = now ; }

		if ( resourceData.nextFullSyncWith ) {
			if ( fullSyncParams.delay && resourceData.lastFullSyncTime && ( delta = now - resourceData.lastFullSyncTime - fullSyncParams.delay ) < 0 ) {
				resourceData.inProgress = Promise.resolveTimeout( -delta + 1 ) ;	// Strangely, sometime it is trigerred 1ms too soon
				resourceData.inProgress.finally( () => outWrapper( resourceData , 0 ) ) ;
				return resourceData.nextFullSyncPromise ;
			}

			args = resourceData.nextFullSyncWith ;
			resourceData.nextFullSyncWith = null ;
			sharedPromise = resourceData.nextFullSyncPromise ;
			resourceData.nextFullSyncPromise = null ;

			// Call the fullSyncParams.fn again
			resourceData.lastFullSync = resourceData.last = resourceData.inProgress = fullSyncParams.fn.call( ... args ) ;

			// Forward the result to the pending promise
			Promise.propagate( resourceData.inProgress , sharedPromise ) ;

			// BTW, trigger again the outWrapper
			Promise.finally( resourceData.inProgress , () => outWrapper( resourceData , 2 ) ) ;

			return resourceData.inProgress ;
		}
	} ;

	const getInWrapper = function( resourceId , ... args ) {
		var noDelay = false ,
			localThis = getParams.thisBinding || this ,
			resourceData = getResourceData( resourceId ) ;

		if ( args[ 0 ] === Promise.NO_DELAY ) {
			noDelay = true ;
			args.shift() ;
		}
		else if ( args[ 0 ] === Promise.BATCH_NO_DELAY ) {
			args.shift() ;
			let batchId = args.shift() ;
			if ( ! resourceData.noDelayBatches.has( batchId ) ) {
				resourceData.noDelayBatches.add( batchId ) ;
				noDelay = true ;
			}
		}

		if ( resourceData.inProgress ) { return resourceData.inProgress ; }

		if ( ! noDelay && getParams.delay && resourceData.lastTime && new Date() - resourceData.lastTime < getParams.delay ) {
			if ( typeof getParams.onDebounce === 'function' ) { getParams.onDebounce( resourceId , ... args ) ; }
			return resourceData.last ;
		}

		resourceData.last = resourceData.inProgress = getParams.fn.call( localThis , resourceId , ... args ) ;
		resourceData.inProgressIsFull = false ;
		Promise.finally( resourceData.inProgress , () => outWrapper( resourceData , 1 ) ) ;
		return resourceData.inProgress ;
	} ;

	const fullSyncInWrapper = function( resourceId , ... args ) {
		var delta ,
			noDelay = false ,
			localThis = fullSyncParams.thisBinding || this ,
			resourceData = getResourceData( resourceId ) ;

		if ( args[ 0 ] === Promise.NO_DELAY ) {
			noDelay = true ;
			args.shift() ;
		}
		else if ( args[ 0 ] === Promise.BATCH_NO_DELAY ) {
			args.shift() ;
			let batchId = args.shift() ;
			if ( ! resourceData.noDelayBatches.has( batchId ) ) {
				resourceData.noDelayBatches.add( batchId ) ;
				noDelay = true ;
			}
		}

		if ( ! resourceData.inProgress && ! noDelay && fullSyncParams.delay && resourceData.lastFullSyncTime && ( delta = new Date() - resourceData.lastFullSyncTime - fullSyncParams.delay ) < 0 ) {
			resourceData.inProgress = Promise.resolveTimeout( -delta + 1 ) ;	// Strangely, sometime it is trigerred 1ms too soon
			Promise.finally( resourceData.inProgress , () => outWrapper( resourceData , 0 ) ) ;
		}

		if ( resourceData.inProgress ) {
			// No difference between in-progress is 'get' or 'fullSync'
			if ( ! resourceData.nextFullSyncPromise ) { resourceData.nextFullSyncPromise = new Promise() ; }
			resourceData.nextFullSyncWith = [ localThis , resourceId , ... args ] ;
			return resourceData.nextFullSyncPromise ;
		}

		resourceData.lastFullSync = resourceData.last = resourceData.inProgress = fullSyncParams.fn.call( localThis , resourceId , ... args ) ;
		Promise.finally( resourceData.inProgress , () => outWrapper( resourceData , 2 ) ) ;
		return resourceData.inProgress ;
	} ;

	return [ getInWrapper , fullSyncInWrapper ] ;
} ;



Promise.timeout = ( timeout , asyncFn , thisBinding ) => {
	return function( ... args ) {
		var promise = asyncFn.call( thisBinding || this , ... args ) ;
		// Careful: not my promise, so cannot retrieve its status
		setTimeout( () => promise.reject( new Error( 'Timeout' ) ) , timeout ) ;
		return promise ;
	} ;

} ;



// Like .timeout(), but here the timeout value is not passed at creation, but as the first arg of each call
Promise.variableTimeout = ( asyncFn , thisBinding ) => {
	return function( timeout , ... args ) {
		var promise = asyncFn.call( thisBinding || this , ... args ) ;
		// Careful: not my promise, so cannot retrieve its status
		setTimeout( () => promise.reject( new Error( 'Timeout' ) ) , timeout ) ;
		return promise ;
	} ;

} ;



/*
Promise.retry = ( retryCount , retryTimeout , timeoutMultiplier , asyncFn , thisBinding ) => {

	return ( ... args ) => {

		var lastError ,
			count = retryCount ,
			timeout = retryTimeout ,
			globalPromise = new Promise() ;

		const callAgain = () => {
			if ( count -- < 0 ) {
				globalPromise.reject( lastError ) ;
				return ;
			}

			var promise = asyncFn.call( thisBinding , ... args ) ;

			promise.then(
				//( value ) => globalPromise.resolve( value ) ,
				( value ) => {
					globalPromise.resolve( value ) ;
				} ,
				( error ) => {
					lastError = error ;
					setTimeout( callAgain , timeout ) ;
					timeout *= timeoutMultiplier ;
				}
			) ;
		} ;

		callAgain() ;

		return globalPromise ;
	} ;
} ;



Promise.variableRetry = ( asyncFn , thisBinding ) => {

	return ( retryCount , retryTimeout , timeoutMultiplier , ... args ) => {

		var lastError ,
			count = retryCount ,
			timeout = retryTimeout ,
			globalPromise = new Promise() ;

		const callAgain = () => {
			if ( count -- < 0 ) {
				globalPromise.reject( lastError ) ;
				return ;
			}

			var promise = asyncFn.call( thisBinding , ... args ) ;

			promise.then(
				( value ) => globalPromise.resolve( value ) ,
				( error ) => {
					lastError = error ;
					setTimeout( callAgain , timeout ) ;
					timeout *= timeoutMultiplier ;
				}
			) ;
		} ;

		callAgain() ;

		return globalPromise ;
	} ;
} ;
*/


},{"./seventh.js":8}],6:[function(require,module,exports){
(function (process){
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



/*
	Asynchronously exit.

	Wait for all listeners of the 'asyncExit' event (on the 'process' object) to have called their callback.
	The listeners receive the exit code about to be produced and a completion callback.
*/

var exitInProgress = false ;

Promise.asyncExit = function( exitCode , timeout ) {
	// Already exiting? no need to call it twice!
	if ( exitInProgress ) { return ; }

	exitInProgress = true ;

	var listeners = process.listeners( 'asyncExit' ) ;

	if ( ! listeners.length ) { process.exit( exitCode ) ; return ; }

	if ( timeout === undefined ) { timeout = 1000 ; }

	const callListener = listener => {

		if ( listener.length < 3 ) {
			// This listener does not have a callback, it is interested in the event but does not need to perform critical stuff.
			// E.g. a server will not accept connection or data anymore, but doesn't need cleanup.
			listener( exitCode , timeout ) ;
			return Promise.dummy ;
		}

		// This listener have a callback, it probably has critical stuff to perform before exiting.
		// E.g. a server that needs to gracefully exit will not accept connection or data anymore,
		// but still want to deliver request in progress.
		return new Promise( resolve => {
			listener( exitCode , timeout , () => { resolve() ; } ) ;
		} ) ;

	} ;

	// We don't care about errors here... We are exiting!
	Promise.map( listeners , callListener )
		.finally( () => process.exit( exitCode ) ) ;

	// Quit anyway if it's too long
	setTimeout( () => process.exit( exitCode ) , timeout ) ;
} ;



// A timeout that ensure a task get the time to perform its action (when there are CPU-bound tasks)
Promise.resolveSafeTimeout = function( timeout , value ) {
	return new Promise( resolve => {
		setTimeout( () => {
			setTimeout( () => {
				setTimeout( () => {
					setTimeout( () => resolve( value ) , 0 ) ;
				} , timeout / 2 ) ;
			} , timeout / 2 ) ;
		} , 0 ) ;
	} ) ;
} ;


}).call(this,require('_process'))
},{"./seventh.js":8,"_process":11}],7:[function(require,module,exports){
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



/*
	This parasite the native promise, bringing some of seventh features into them.
*/

Promise.parasite = () => {

	var compatibleProtoFn = [
		'tap' , 'tapCatch' , 'finally' ,
		'fatal' , 'done' ,
		'callback' , 'callbackAll'
	] ;

	compatibleProtoFn.forEach( fn => Promise.Native.prototype[ fn ] = Promise.prototype[ fn ] ) ;
	Promise.Native.prototype._then = Promise.Native.prototype.then ;
} ;


},{"./seventh.js":8}],8:[function(require,module,exports){
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



const seventh = require( './core.js' ) ;
module.exports = seventh ;

// The order matters
require( './batch.js' ) ;
require( './wrapper.js' ) ;
require( './decorators.js' ) ;
require( './Queue.js' ) ;
require( './api.js' ) ;
require( './parasite.js' ) ;
require( './misc.js' ) ;


},{"./Queue.js":1,"./api.js":2,"./batch.js":3,"./core.js":4,"./decorators.js":5,"./misc.js":6,"./parasite.js":7,"./wrapper.js":9}],9:[function(require,module,exports){
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


},{"./seventh.js":8}],10:[function(require,module,exports){
(function (process,global){
(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":11}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
(function (setImmediate,clearImmediate){
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
}).call(this,require("timers").setImmediate,require("timers").clearImmediate)
},{"process/browser.js":11,"timers":12}]},{},[8])(8)
});
