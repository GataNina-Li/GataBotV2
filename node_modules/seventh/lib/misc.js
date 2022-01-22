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

