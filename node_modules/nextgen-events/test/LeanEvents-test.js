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

/* global it, describe, expect */

"use strict" ;



var LeanEvents ;

if ( process.browser ) {
	//LeanEvents = require( '../lib/browser.js' ) ;
}
else {
	LeanEvents = require( '../lib/LeanEvents.js' ) ;
}



describe( "LeanEvents event-emitting" , () => {

	it( "should add one listener and emit should trigger it, using 'new'" , () => {
		var bus = new LeanEvents() ,
			triggered = 0 ;

		bus.on( 'hello' , () => { triggered ++ ; } ) ;
		bus.emit( 'hello' ) ;
		expect( triggered ).to.be( 1 ) ;
	} ) ;

	it( "should add one listener and emit should trigger it, using 'Object.create()'" , () => {
		var bus = new LeanEvents() ,
			triggered = 0 ;

		bus.on( 'hello' , () => { triggered ++ ; } ) ;
		bus.emit( 'hello' ) ;
		expect( triggered ).to.be( 1 ) ;
	} ) ;

	it( "should emit without argument" , () => {
		var bus = new LeanEvents() ,
			triggered = 0 ;

		bus.on( 'hello' , function() {
			triggered ++ ;
			expect( arguments.length ).to.be( 0 ) ;
		} ) ;

		bus.emit( 'hello' ) ;

		expect( triggered ).to.be( 1 ) ;
	} ) ;

	it( "should emit with argument" , () => {
		var bus = new LeanEvents() ,
			triggered = 0 ;

		bus.on( 'hello' , ( arg1 , arg2 ) => {
			triggered ++ ;
			expect( arg1 ).to.be( 'world' ) ;
			expect( arg2 ).to.be( '!' ) ;
		} ) ;

		bus.emit( 'hello' , 'world' , '!' ) ;

		expect( triggered ).to.be( 1 ) ;
	} ) ;

	it( "should add many basic listeners for many events, and multiple emits should trigger only relevant listener" , () => {
		var bus = new LeanEvents() ;

		var onFoo1 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
		var triggered = {
			foo1: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0
		} ;

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
		expect( triggered ).to.equal( {
			foo1: 1 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0
		} ) ;

		bus.emit( 'bar' ) ;
		expect( triggered ).to.equal( {
			foo1: 1 , bar1: 1 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0
		} ) ;

		bus.emit( 'baz' ) ;
		expect( triggered ).to.equal( {
			foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0
		} ) ;

		bus.emit( 'qux' ) ;
		expect( triggered ).to.equal( {
			foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0
		} ) ;

		bus.emit( 'foo' ) ;
		bus.emit( 'foo' ) ;
		expect( triggered ).to.equal( {
			foo1: 3 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0
		} ) ;

		bus.emit( 'qux' ) ;
		bus.emit( 'qux' ) ;
		expect( triggered ).to.equal( {
			foo1: 3 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0
		} ) ;

		bus.emit( 'baz' ) ;
		bus.emit( 'baz' ) ;
		expect( triggered ).to.equal( {
			foo1: 3 , bar1: 1 , bar2: 1 , baz1: 3 , baz2: 3 , baz3: 3 , qux: 0
		} ) ;
	} ) ;

	it( "should add and remove listeners" , () => {
		var bus = new LeanEvents() ;

		var onFoo1 , onFoo2 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
		var triggered = {
			foo1: 0 , foo2: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0
		} ;

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
		expect( triggered ).to.equal( {
			foo1: 1 , foo2: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0
		} ) ;

		bus.emit( 'bar' ) ;
		expect( triggered ).to.equal( {
			foo1: 1 , foo2: 0 , bar1: 1 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0
		} ) ;

		bus.removeListener( 'bar' , onBar2 ) ;
		bus.emit( 'bar' ) ;
		expect( triggered ).to.equal( {
			foo1: 1 , foo2: 0 , bar1: 2 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0
		} ) ;

		bus.removeListener( 'bar' , onBar2 ) ;
		bus.emit( 'bar' ) ;
		expect( triggered ).to.equal( {
			foo1: 1 , foo2: 0 , bar1: 3 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0
		} ) ;

		bus.removeListener( 'foo' , onBar1 ) ; // Not listening for this event!
		bus.removeListener( 'bar' , () => {} ) ; // Not event registered
		bus.emit( 'foo' ) ;
		bus.emit( 'bar' ) ;
		expect( triggered ).to.equal( {
			foo1: 2 , foo2: 0 , bar1: 4 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0
		} ) ;

		bus.once( 'foo' , onFoo2 = function() { triggered.foo2 ++ ; } ) ;
		bus.removeListener( 'foo' , onFoo2 ) ; // This is a one-time listener
		bus.emit( 'foo' ) ;
		expect( triggered ).to.equal( {
			foo1: 3 , foo2: 0 , bar1: 4 , bar2: 1 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0
		} ) ;
	} ) ;

	it( ".removeAllListeners() should remove all listeners for an event" , () => {
		var bus = new LeanEvents() ;

		var onFoo1 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
		var triggered = {
			foo1: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0
		} ;

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
		expect( triggered ).to.equal( {
			foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0
		} ) ;

		bus.removeAllListeners( 'bar' ) ;
		bus.emit( 'bar' ) ;
		expect( triggered ).to.equal( {
			foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0
		} ) ;

		bus.emit( 'foo' ) ;
		expect( triggered ).to.equal( {
			foo1: 2 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0
		} ) ;

		bus.removeAllListeners( 'baz' ) ;
		bus.emit( 'foo' ) ;
		bus.emit( 'bar' ) ;
		bus.emit( 'baz' ) ;
		expect( triggered ).to.equal( {
			foo1: 3 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0
		} ) ;
	} ) ;

	it( ".removeAllListeners() without argument should remove all listeners for all events" , () => {
		var bus = new LeanEvents() ;

		var onFoo1 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
		var triggered = {
			foo1: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , baz3: 0 , qux: 0
		} ;

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
		expect( triggered ).to.equal( {
			foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0
		} ) ;

		bus.removeAllListeners() ;
		bus.emit( 'foo' ) ;
		bus.emit( 'bar' ) ;
		bus.emit( 'baz' ) ;
		bus.emit( 'qux' ) ;
		expect( triggered ).to.equal( {
			foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 1 , baz3: 1 , qux: 0
		} ) ;
	} ) ;

	it( ".once() should add one time listener for an event, the event should stop listening after being triggered once" , () => {
		var bus = new LeanEvents() ;

		var onFoo1 , onBar1 , onBar2 , onBaz1 , onBaz2 , onBaz3 ;
		var triggered = {
			foo1: 0 , bar1: 0 , bar2: 0 , baz1: 0 , baz2: 0 , qux: 0
		} ;

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
		expect( triggered ).to.equal( {
			foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 3 , qux: 0
		} ) ;

		bus.emit( 'foo' ) ;
		expect( triggered ).to.equal( {
			foo1: 1 , bar1: 1 , bar2: 1 , baz1: 1 , baz2: 3 , qux: 0
		} ) ;

		bus.emit( 'bar' ) ;
		expect( triggered ).to.equal( {
			foo1: 1 , bar1: 2 , bar2: 1 , baz1: 1 , baz2: 3 , qux: 0
		} ) ;

		bus.emit( 'baz' ) ;
		expect( triggered ).to.equal( {
			foo1: 1 , bar1: 2 , bar2: 1 , baz1: 2 , baz2: 3 , qux: 0
		} ) ;
	} ) ;

	it( ".waitFor() should work as the Promise-returning counterpart of .once(), only the first event arg is returned" , async () => {
		var bus = new LeanEvents() ;
		setTimeout( () => bus.emit( 'foo' , 'bar' , 'baz' , 'qux' ) , 100 ) ;
		var result = await bus.waitFor( 'foo' ) ;
		expect( result ).to.be( 'bar' ) ;
	} ) ;

	it( ".waitForAll() should work as the Promise-returning counterpart of .once(), the event arguments as an array is returned" , async () => {
		var bus = new LeanEvents() ;
		setTimeout( () => bus.emit( 'foo' , 'bar' , 'baz' , 'qux' ) , 100 ) ;
		var result = await bus.waitForAll( 'foo' ) ;
		expect( result ).to.equal( [ 'bar' , 'baz' , 'qux' ] ) ;
	} ) ;

	it( ".listenerCount() should count listeners for an event" , () => {
		var bus = new LeanEvents() ;

		var onFoo1 ;

		onFoo1 = function() {} ;

		bus.on( 'foo' , onFoo1 ) ;
		expect( bus.listenerCount( 'foo' ) ).to.be( 1 ) ;
		expect( bus.listenerCount( 'bar' ) ).to.be( 0 ) ;

		bus.on( 'foo' , onFoo1 ) ;
		bus.on( 'foo' , onFoo1 ) ;

		expect( bus.listenerCount( 'foo' ) ).to.be( 3 ) ;
		expect( bus.listenerCount( 'bar' ) ).to.be( 0 ) ;

		bus.removeListener( 'foo' , onFoo1 ) ;

		expect( bus.listenerCount( 'foo' ) ).to.be( 0 ) ;
		expect( bus.listenerCount( 'bar' ) ).to.be( 0 ) ;

		bus.once( 'foo' , onFoo1 ) ;
		expect( bus.listenerCount( 'foo' ) ).to.be( 1 ) ;
		expect( bus.listenerCount( 'bar' ) ).to.be( 0 ) ;

		bus.emit( 'foo' ) ;
		expect( bus.listenerCount( 'foo' ) ).to.be( 0 ) ;
		expect( bus.listenerCount( 'bar' ) ).to.be( 0 ) ;
	} ) ;

	it( "should remove every occurences of a listener for one event" , () => {
		var bus = new LeanEvents() ;

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
		expect( triggered ).to.equal( { foo1: 1 , bar1: 1 , bar2: 3 } ) ;

		bus.removeListener( 'bar' , onBar2 ) ;
		bus.emit( 'bar' ) ;
		expect( triggered ).to.equal( { foo1: 1 , bar1: 2 , bar2: 3 } ) ;
	} ) ;

	it( ".listeners() should return all the listeners for an event" , () => {
		var bus = new LeanEvents() ;

		var listeners , onFoo1 ;

		onFoo1 = function onFoo1() {} ;

		bus.on( 'foo' , onFoo1 ) ;
		listeners = bus.listeners( 'foo' ) ;
		expect( listeners.length ).to.be( 1 ) ;
		expect( listeners[ 0 ].id ).to.be( onFoo1 ) ;
		expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;

		bus.on( 'foo' , onFoo1 ) ;
		bus.on( 'foo' , onFoo1 ) ;

		listeners = bus.listeners( 'foo' ) ;
		expect( listeners.length ).to.be( 3 ) ;
		expect( listeners[ 1 ].id ).to.be( onFoo1 ) ;
		expect( listeners[ 2 ].id ).to.be( onFoo1 ) ;
		expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;

		bus.removeListener( 'foo' , onFoo1 ) ;
		expect( bus.listeners( 'foo' ).length ).to.be( 0 ) ;
		expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;

		bus.once( 'foo' , onFoo1 ) ;
		listeners = bus.listeners( 'foo' ) ;
		expect( listeners.length ).to.be( 1 ) ;
		expect( listeners[ 0 ].id ).to.be( onFoo1 ) ;
		expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;

		bus.emit( 'foo' ) ;
		listeners = bus.listeners( 'foo' ) ;
		expect( bus.listeners( 'foo' ).length ).to.be( 0 ) ;
		expect( bus.listeners( 'bar' ).length ).to.be( 0 ) ;
	} ) ;
} ) ;



describe( "Next Gen feature (LeanEvents): state-events" , () => {

	it( "should emit a state-event, further listeners should receive the last emitted event immediately" , () => {
		var bus = new LeanEvents() ,
			triggered = 0 ;

		bus.defineStates( 'ready' ) ;

		bus.on( 'ready' , ( arg ) => {
			triggered ++ ;
			expect( arg ).to.be( 'ok!' ) ;
		} ) ;
		expect( triggered ).to.be( 0 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( false ) ;
		expect( bus.getAllStates() ).to.equal( [] ) ;

		bus.emit( 'ready' , 'ok!' ) ;
		expect( triggered ).to.be( 1 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.equal( [ 'ready' ] ) ;

		bus.on( 'ready' , ( arg ) => {
			triggered ++ ;
			expect( arg ).to.be( 'ok!' ) ;
		} ) ;

		expect( triggered ).to.be( 2 ) ;

		bus.once( 'ready' , ( arg ) => {
			triggered ++ ;
			expect( arg ).to.be( 'ok!' ) ;
		} ) ;

		expect( triggered ).to.be( 3 ) ;

		bus.emit( 'ready' , 'ok!' , 'stateBreaker#1' ) ;
		expect( triggered ).to.be( 5 ) ;


		bus.removeAllListeners( 'ready' ) ;

		bus.once( 'ready' , ( arg ) => {
			triggered ++ ;
			expect( arg ).to.be( 'ok!' ) ;
		} ) ;
		expect( triggered ).to.be( 6 ) ;

		bus.emit( 'ready' ) ;

		bus.once( 'ready' , ( arg ) => {
			triggered ++ ;
			expect( arg ).not.to.be.ok() ;
		} ) ;
		expect( triggered ).to.be( 7 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.equal( [ 'ready' ] ) ;
	} ) ;

	it( "when the state remains the same, nothing should be emitted" , () => {
		var bus = new LeanEvents() ,
			triggered = 0 ;

		bus.defineStates( 'ready' , 'notReady' ) ;

		bus.on( 'ready' , () => {
			triggered ++ ;
		} ) ;
		expect( triggered ).to.be( 0 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( false ) ;
		expect( bus.getAllStates() ).to.equal( [] ) ;

		bus.emit( 'ready' ) ;
		expect( triggered ).to.be( 1 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.equal( [ 'ready' ] ) ;

		bus.on( 'ready' , () => {
			triggered ++ ;
		} ) ;

		expect( triggered ).to.be( 2 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.equal( [ 'ready' ] ) ;

		bus.emit( 'ready' ) ;

		expect( triggered ).to.be( 2 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.equal( [ 'ready' ] ) ;

		bus.emit( 'ready' , '#1' ) ;

		expect( triggered ).to.be( 4 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.equal( [ 'ready' ] ) ;

		bus.emit( 'ready' , '#1' ) ;

		expect( triggered ).to.be( 4 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.equal( [ 'ready' ] ) ;

		bus.emit( 'ready' , '#2' ) ;

		expect( triggered ).to.be( 6 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.equal( [ 'ready' ] ) ;

		bus.emit( 'ready' , '#2' ) ;

		expect( triggered ).to.be( 6 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.equal( [ 'ready' ] ) ;

		bus.emit( 'ready' ) ;

		expect( triggered ).to.be( 8 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.equal( [ 'ready' ] ) ;

		bus.emit( 'notReady' ) ;
		expect( triggered ).to.be( 8 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( false ) ;
		expect( bus.hasState( 'notReady' ) ).to.be( true ) ;
		expect( bus.getAllStates() ).to.equal( [ 'notReady' ] ) ;

		bus.emit( 'ready' ) ;
		expect( triggered ).to.be( 10 ) ;
		expect( bus.hasState( 'ready' ) ).to.be( true ) ;
		expect( bus.hasState( 'notReady' ) ).to.be( false ) ;
		expect( bus.getAllStates() ).to.equal( [ 'ready' ] ) ;
	} ) ;

	it( "should define three exclusive states, emitting one should discard the two others" , () => {
		var bus = new LeanEvents() ;

		var startingTriggered = 0 , runningTriggered = 0 , endingTriggered = 0 ;

		// Define 3 exclusives states
		bus.defineStates( 'starting' , 'running' , 'ending' ) ;
		expect( bus.hasState( 'starting' ) ).to.be( false ) ;
		expect( bus.hasState( 'running' ) ).to.be( false ) ;
		expect( bus.hasState( 'ending' ) ).to.be( false ) ;
		expect( bus.getAllStates() ).to.equal( [] ) ;

		bus.on( 'starting' , () => {
			startingTriggered ++ ;
		} ) ;
		expect( startingTriggered ).to.be( 0 ) ;

		bus.emit( 'starting' ) ;
		expect( bus.hasState( 'starting' ) ).to.be( true ) ;
		expect( bus.hasState( 'running' ) ).to.be( false ) ;
		expect( bus.hasState( 'ending' ) ).to.be( false ) ;
		expect( bus.getAllStates() ).to.equal( [ 'starting' ] ) ;
		expect( startingTriggered ).to.be( 1 ) ;

		bus.on( 'starting' , () => {
			startingTriggered ++ ;
		} ) ;
		expect( startingTriggered ).to.be( 2 ) ;

		bus.on( 'running' , () => {
			runningTriggered ++ ;
		} ) ;
		expect( startingTriggered ).to.be( 2 ) ;
		expect( runningTriggered ).to.be( 0 ) ;

		// Emit the 'running' state-event, thus discarding the 'starting' state
		bus.emit( 'running' ) ;
		expect( bus.hasState( 'starting' ) ).to.be( false ) ;
		expect( bus.hasState( 'running' ) ).to.be( true ) ;
		expect( bus.hasState( 'ending' ) ).to.be( false ) ;
		expect( bus.getAllStates() ).to.equal( [ 'running' ] ) ;
		expect( startingTriggered ).to.be( 2 ) ;
		expect( runningTriggered ).to.be( 1 ) ;

		bus.on( 'starting' , () => {
			startingTriggered ++ ;
		} ) ;
		expect( startingTriggered ).to.be( 2 ) ;
		expect( runningTriggered ).to.be( 1 ) ;

		bus.on( 'running' , () => {
			runningTriggered ++ ;
		} ) ;
		expect( startingTriggered ).to.be( 2 ) ;
		expect( runningTriggered ).to.be( 2 ) ;

		bus.on( 'ending' , () => {
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
		expect( bus.getAllStates() ).to.equal( [ 'ending' ] ) ;
		expect( startingTriggered ).to.be( 2 ) ;
		expect( runningTriggered ).to.be( 2 ) ;
		expect( endingTriggered ).to.be( 1 ) ;

		// Emit the 'starting' state-event, thus discarding the 'ending' state
		bus.emit( 'starting' ) ;
		expect( bus.hasState( 'starting' ) ).to.be( true ) ;
		expect( bus.hasState( 'running' ) ).to.be( false ) ;
		expect( bus.hasState( 'ending' ) ).to.be( false ) ;
		expect( bus.getAllStates() ).to.equal( [ 'starting' ] ) ;
		expect( startingTriggered ).to.be( 5 ) ;
		expect( runningTriggered ).to.be( 2 ) ;
		expect( endingTriggered ).to.be( 1 ) ;

		bus.on( 'running' , () => {
			runningTriggered ++ ;
		} ) ;
		bus.on( 'ending' , () => {
			endingTriggered ++ ;
		} ) ;
		expect( startingTriggered ).to.be( 5 ) ;
		expect( runningTriggered ).to.be( 2 ) ;
		expect( endingTriggered ).to.be( 1 ) ;
	} ) ;
} ) ;

