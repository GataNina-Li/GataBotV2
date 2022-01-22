
"use strict" ;

/* global benchmark, competitor */

const EventEmitter = require( 'events' ) ;
const Ngev = require( '..' ) ;
const LeanEvents = require( '../lib/LeanEvents.js' ) ;
const EventEmitter3 = require( 'eventemitter3' ) ;



benchmark( "Emitting to 1 listener, no arg" , () => {
	var nodeCount = 0 ,
		nodeBus = new EventEmitter() ;
	nodeBus.on( 'ready' , () => nodeCount ++ ) ;

	var ngevCount = 0 ,
		ngevBus = new Ngev() ;
	ngevBus.on( 'ready' , () => ngevCount ++ ) ;

	var leanCount = 0 ,
		leanBus = new LeanEvents() ;
	leanBus.on( 'ready' , () => leanCount ++ ) ;

	var leanWithStateCount = 0 ,
		leanWithStateBus = new LeanEvents() ;
	leanWithStateBus.defineStates( 'ready' ) ;
	leanWithStateBus.on( 'ready' , () => leanWithStateCount ++ ) ;

	var ev3Count = 0 ,
		ev3Bus = new EventEmitter3() ;
	ev3Bus.on( 'ready' , () => ev3Count ++ ) ;

	competitor( "built-in Node.js events" , () => {
		nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ;
		nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ;
	} ) ;

	competitor( "NextGen events" , () => {
		ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ;
		ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ;
	} ) ;

	competitor( "Lean events" , () => {
		leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ;
		leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ;
	} ) ;

	competitor( "Lean events with state event (no change between call)" , () => {
		leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ;
		leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ;
	} ) ;

	competitor( "EventEmitter3 events" , () => {
		ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ;
		ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ;
	} ) ;
} ) ;



benchmark( "Emitting to 1 listener, with 1 arg" , () => {
	var nodeCount = 0 ,
		nodeBus = new EventEmitter() ;
	nodeBus.on( 'ready' , v => nodeCount += v ) ;

	var ngevCount = 0 ,
		ngevBus = new Ngev() ;
	ngevBus.on( 'ready' , v => ngevCount += v ) ;

	var leanCount = 0 ,
		leanBus = new LeanEvents() ;
	leanBus.on( 'ready' , v => leanCount += v ) ;

	var leanWithStateCount = 0 ,
		leanWithStateBus = new LeanEvents() ;
	leanWithStateBus.on( 'ready' , v => leanWithStateCount += v ) ;

	var ev3Count = 0 ,
		ev3Bus = new EventEmitter3() ;
	ev3Bus.on( 'ready' , v => ev3Count += v ) ;

	competitor( "built-in Node.js events" , () => {
		nodeBus.emit( 'ready' , 2 ) ; nodeBus.emit( 'ready' , 2 ) ; nodeBus.emit( 'ready' , 2 ) ; nodeBus.emit( 'ready' , 2 ) ; nodeBus.emit( 'ready' , 2 ) ;
		nodeBus.emit( 'ready' , 2 ) ; nodeBus.emit( 'ready' , 2 ) ; nodeBus.emit( 'ready' , 2 ) ; nodeBus.emit( 'ready' , 2 ) ; nodeBus.emit( 'ready' , 2 ) ;
	} ) ;

	competitor( "NextGen events" , () => {
		ngevBus.emit( 'ready' , 2 ) ; ngevBus.emit( 'ready' , 2 ) ; ngevBus.emit( 'ready' , 2 ) ; ngevBus.emit( 'ready' , 2 ) ; ngevBus.emit( 'ready' , 2 ) ;
		ngevBus.emit( 'ready' , 2 ) ; ngevBus.emit( 'ready' , 2 ) ; ngevBus.emit( 'ready' , 2 ) ; ngevBus.emit( 'ready' , 2 ) ; ngevBus.emit( 'ready' , 2 ) ;
	} ) ;

	competitor( "Lean events" , () => {
		leanBus.emit( 'ready' , 2 ) ; leanBus.emit( 'ready' , 2 ) ; leanBus.emit( 'ready' , 2 ) ; leanBus.emit( 'ready' , 2 ) ; leanBus.emit( 'ready' , 2 ) ;
		leanBus.emit( 'ready' , 2 ) ; leanBus.emit( 'ready' , 2 ) ; leanBus.emit( 'ready' , 2 ) ; leanBus.emit( 'ready' , 2 ) ; leanBus.emit( 'ready' , 2 ) ;
	} ) ;

	competitor( "Lean events with state event (no change between call)" , () => {
		leanWithStateBus.emit( 'ready' , 2 ) ; leanWithStateBus.emit( 'ready' , 2 ) ; leanWithStateBus.emit( 'ready' , 2 ) ; leanWithStateBus.emit( 'ready' , 2 ) ; leanWithStateBus.emit( 'ready' , 2 ) ;
		leanWithStateBus.emit( 'ready' , 2 ) ; leanWithStateBus.emit( 'ready' , 2 ) ; leanWithStateBus.emit( 'ready' , 2 ) ; leanWithStateBus.emit( 'ready' , 2 ) ; leanWithStateBus.emit( 'ready' , 2 ) ;
	} ) ;

	competitor( "Lean events with state event (changing args at each call)" , () => {
		leanWithStateBus.emit( 'ready' , 1 ) ; leanWithStateBus.emit( 'ready' , 2 ) ; leanWithStateBus.emit( 'ready' , 1 ) ; leanWithStateBus.emit( 'ready' , 2 ) ;
		leanWithStateBus.emit( 'ready' , 1 ) ; leanWithStateBus.emit( 'ready' , 2 ) ; leanWithStateBus.emit( 'ready' , 1 ) ; leanWithStateBus.emit( 'ready' , 2 ) ;
		leanWithStateBus.emit( 'ready' , 1 ) ; leanWithStateBus.emit( 'ready' , 2 ) ;
	} ) ;

	competitor( "EventEmitter3 events" , () => {
		ev3Bus.emit( 'ready' , 2 ) ; ev3Bus.emit( 'ready' , 2 ) ; ev3Bus.emit( 'ready' , 2 ) ; ev3Bus.emit( 'ready' , 2 ) ; ev3Bus.emit( 'ready' , 2 ) ;
		ev3Bus.emit( 'ready' , 2 ) ; ev3Bus.emit( 'ready' , 2 ) ; ev3Bus.emit( 'ready' , 2 ) ; ev3Bus.emit( 'ready' , 2 ) ; ev3Bus.emit( 'ready' , 2 ) ;
	} ) ;
} ) ;



benchmark( "Emitting to 3 listeners, no arg" , () => {
	var nodeCount = 0 ,
		nodeBus = new EventEmitter() ;
	nodeBus.on( 'ready' , () => nodeCount ++ ) ;
	nodeBus.on( 'ready' , () => nodeCount ++ ) ;
	nodeBus.on( 'ready' , () => nodeCount ++ ) ;

	var ngevCount = 0 ,
		ngevBus = new Ngev() ;
	ngevBus.on( 'ready' , () => ngevCount ++ ) ;
	ngevBus.on( 'ready' , () => ngevCount ++ ) ;
	ngevBus.on( 'ready' , () => ngevCount ++ ) ;

	var leanCount = 0 ,
		leanBus = new LeanEvents() ;
	leanBus.on( 'ready' , () => leanCount ++ ) ;
	leanBus.on( 'ready' , () => leanCount ++ ) ;
	leanBus.on( 'ready' , () => leanCount ++ ) ;

	var leanWithStateCount = 0 ,
		leanWithStateBus = new LeanEvents() ;
	leanWithStateBus.on( 'ready' , v => leanWithStateCount ++ ) ;
	leanWithStateBus.on( 'ready' , v => leanWithStateCount ++ ) ;
	leanWithStateBus.on( 'ready' , v => leanWithStateCount ++ ) ;

	var ev3Count = 0 ,
		ev3Bus = new LeanEvents() ;
	ev3Bus.on( 'ready' , () => ev3Count ++ ) ;
	ev3Bus.on( 'ready' , () => ev3Count ++ ) ;
	ev3Bus.on( 'ready' , () => ev3Count ++ ) ;

	competitor( "built-in Node.js events" , () => {
		nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ;
		nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ; nodeBus.emit( 'ready' ) ;
	} ) ;

	competitor( "NextGen events" , () => {
		ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ;
		ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ; ngevBus.emit( 'ready' ) ;
	} ) ;

	competitor( "Lean events" , () => {
		leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ;
		leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ; leanBus.emit( 'ready' ) ;
	} ) ;

	competitor( "Lean events with state event (no change between call)" , () => {
		leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ;
		leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ; leanWithStateBus.emit( 'ready' ) ;
	} ) ;

	competitor( "EventEmitter3" , () => {
		ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ;
		ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ; ev3Bus.emit( 'ready' ) ;
	} ) ;
} ) ;



benchmark( "Emitting to 3 listeners, 3 args" , () => {
	var nodeCount = 0 ,
		nodeBus = new EventEmitter() ;
	nodeBus.on( 'ready' , ( a , b , c ) => nodeCount += a + b + c ) ;
	nodeBus.on( 'ready' , ( a , b , c ) => nodeCount += a + b + c ) ;
	nodeBus.on( 'ready' , ( a , b , c ) => nodeCount += a + b + c ) ;

	var ngevCount = 0 ,
		ngevBus = new Ngev() ;
	ngevBus.on( 'ready' , ( a , b , c ) => ngevCount += a + b + c ) ;
	ngevBus.on( 'ready' , ( a , b , c ) => ngevCount += a + b + c ) ;
	ngevBus.on( 'ready' , ( a , b , c ) => ngevCount += a + b + c ) ;

	var leanCount = 0 ,
		leanBus = new LeanEvents() ;
	leanBus.on( 'ready' , ( a , b , c ) => leanCount += a + b + c ) ;
	leanBus.on( 'ready' , ( a , b , c ) => leanCount += a + b + c ) ;
	leanBus.on( 'ready' , ( a , b , c ) => leanCount += a + b + c ) ;

	var leanWithStateCount = 0 ,
		leanWithStateBus = new LeanEvents() ;
	leanWithStateBus.on( 'ready' , ( a , b , c ) => leanWithStateCount += a + b + c ) ;
	leanWithStateBus.on( 'ready' , ( a , b , c ) => leanWithStateCount += a + b + c ) ;
	leanWithStateBus.on( 'ready' , ( a , b , c ) => leanWithStateCount += a + b + c ) ;

	var ev3Count = 0 ,
		ev3Bus = new LeanEvents() ;
	ev3Bus.on( 'ready' , ( a , b , c ) => ev3Count += a + b + c ) ;
	ev3Bus.on( 'ready' , ( a , b , c ) => ev3Count += a + b + c ) ;
	ev3Bus.on( 'ready' , ( a , b , c ) => ev3Count += a + b + c ) ;

	competitor( "built-in Node.js events" , () => {
		nodeBus.emit( 'ready' , 1 , 2 , 3 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 ) ;
		nodeBus.emit( 'ready' , 1 , 2 , 3 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 ) ;
	} ) ;

	competitor( "NextGen events" , () => {
		ngevBus.emit( 'ready' , 1 , 2 , 3 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 ) ;
		ngevBus.emit( 'ready' , 1 , 2 , 3 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 ) ;
	} ) ;

	competitor( "Lean events" , () => {
		leanBus.emit( 'ready' , 1 , 2 , 3 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 ) ;
		leanBus.emit( 'ready' , 1 , 2 , 3 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 ) ;
	} ) ;

	competitor( "Lean events with state event (no change between call)" , () => {
		leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ;
		leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ;
	} ) ;

	competitor( "Lean events with state event (changing args at each call)" , () => {
		leanWithStateBus.emit( 'ready' , 10 , 2 , 3 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ; leanWithStateBus.emit( 'ready' , 1 , 20 , 3 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 30 ) ;
		leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ; leanWithStateBus.emit( 'ready' , 10 , 2 , 3 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 30 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 ) ;
	} ) ;

	competitor( "EventEmitter3" , () => {
		ev3Bus.emit( 'ready' , 1 , 2 , 3 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 ) ;
		ev3Bus.emit( 'ready' , 1 , 2 , 3 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 ) ;
	} ) ;
} ) ;



benchmark( "Emitting to 10 listeners, 10 args" , () => {
	var nodeCount = 0 ,
		nodeBus = new EventEmitter() ;
	nodeBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => nodeCount += a + b + c + d + e + f + g + h + i + j ) ;
	nodeBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => nodeCount += a + b + c + d + e + f + g + h + i + j ) ;
	nodeBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => nodeCount += a + b + c + d + e + f + g + h + i + j ) ;
	nodeBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => nodeCount += a + b + c + d + e + f + g + h + i + j ) ;
	nodeBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => nodeCount += a + b + c + d + e + f + g + h + i + j ) ;
	nodeBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => nodeCount += a + b + c + d + e + f + g + h + i + j ) ;
	nodeBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => nodeCount += a + b + c + d + e + f + g + h + i + j ) ;
	nodeBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => nodeCount += a + b + c + d + e + f + g + h + i + j ) ;
	nodeBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => nodeCount += a + b + c + d + e + f + g + h + i + j ) ;
	nodeBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => nodeCount += a + b + c + d + e + f + g + h + i + j ) ;

	var ngevCount = 0 ,
		ngevBus = new Ngev() ;
	ngevBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ngevCount += a + b + c + d + e + f + g + h + i + j ) ;
	ngevBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ngevCount += a + b + c + d + e + f + g + h + i + j ) ;
	ngevBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ngevCount += a + b + c + d + e + f + g + h + i + j ) ;
	ngevBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ngevCount += a + b + c + d + e + f + g + h + i + j ) ;
	ngevBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ngevCount += a + b + c + d + e + f + g + h + i + j ) ;
	ngevBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ngevCount += a + b + c + d + e + f + g + h + i + j ) ;
	ngevBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ngevCount += a + b + c + d + e + f + g + h + i + j ) ;
	ngevBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ngevCount += a + b + c + d + e + f + g + h + i + j ) ;
	ngevBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ngevCount += a + b + c + d + e + f + g + h + i + j ) ;
	ngevBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ngevCount += a + b + c + d + e + f + g + h + i + j ) ;

	var leanCount = 0 ,
		leanBus = new LeanEvents() ;
	leanBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanCount += a + b + c + d + e + f + g + h + i + j ) ;

	var leanWithStateCount = 0 ,
		leanWithStateBus = new LeanEvents() ;
	leanWithStateBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanWithStateCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanWithStateBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanWithStateCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanWithStateBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanWithStateCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanWithStateBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanWithStateCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanWithStateBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanWithStateCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanWithStateBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanWithStateCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanWithStateBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanWithStateCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanWithStateBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanWithStateCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanWithStateBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanWithStateCount += a + b + c + d + e + f + g + h + i + j ) ;
	leanWithStateBus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => leanWithStateCount += a + b + c + d + e + f + g + h + i + j ) ;

	var ev3Count = 0 ,
		ev3Bus = new LeanEvents() ;
	ev3Bus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ev3Count += a + b + c + d + e + f + g + h + i + j ) ;
	ev3Bus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ev3Count += a + b + c + d + e + f + g + h + i + j ) ;
	ev3Bus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ev3Count += a + b + c + d + e + f + g + h + i + j ) ;
	ev3Bus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ev3Count += a + b + c + d + e + f + g + h + i + j ) ;
	ev3Bus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ev3Count += a + b + c + d + e + f + g + h + i + j ) ;
	ev3Bus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ev3Count += a + b + c + d + e + f + g + h + i + j ) ;
	ev3Bus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ev3Count += a + b + c + d + e + f + g + h + i + j ) ;
	ev3Bus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ev3Count += a + b + c + d + e + f + g + h + i + j ) ;
	ev3Bus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ev3Count += a + b + c + d + e + f + g + h + i + j ) ;
	ev3Bus.on( 'ready' , ( a , b , c , d , e , f , g , h , i , j ) => ev3Count += a + b + c + d + e + f + g + h + i + j ) ;

	competitor( "built-in Node.js events" , () => {
		nodeBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ;
		nodeBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; nodeBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ;
	} ) ;

	competitor( "NextGen events" , () => {
		ngevBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ;
		ngevBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ngevBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ;
	} ) ;

	competitor( "Lean events" , () => {
		leanBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ;
		leanBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ;
	} ) ;

	competitor( "Lean events with state event (no change between call)" , () => {
		leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ;
		leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ;
	} ) ;

	competitor( "Lean events with state event (changing args at each call)" , () => {
		leanWithStateBus.emit( 'ready' , 10 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 30 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 50 , 6 , 7 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 70 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 90 , 10 ) ;
		leanWithStateBus.emit( 'ready' , 1 , 20 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 40 , 5 , 6 , 7 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 60 , 7 , 8 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 80 , 9 , 10 ) ; leanWithStateBus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 100 ) ;
	} ) ;

	competitor( "EventEmitter3" , () => {
		ev3Bus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ;
		ev3Bus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ; ev3Bus.emit( 'ready' , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 ) ;
	} ) ;
} ) ;



benchmark( "Adding and removing listeners" , () => {
	var fn1 = () => nodeCount ++ ,
		fn2 = () => nodeCount ++ ,
		fn3 = () => nodeCount ++ ,
		fn4 = () => nodeCount ++ ,
		fn5 = () => nodeCount ++ ;

	var nodeCount = 0 ,
		nodeBus = new EventEmitter() ;
	nodeBus.on( 'ready' , () => nodeCount ++ ) ;
	nodeBus.on( 'ready' , () => nodeCount ++ ) ;
	nodeBus.on( 'ready' , () => nodeCount ++ ) ;

	var ngevCount = 0 ,
		ngevBus = new Ngev() ;
	ngevBus.on( 'ready' , () => ngevCount ++ ) ;
	ngevBus.on( 'ready' , () => ngevCount ++ ) ;
	ngevBus.on( 'ready' , () => ngevCount ++ ) ;

	var leanCount = 0 ,
		leanBus = new LeanEvents() ;
	leanBus.on( 'ready' , () => leanCount ++ ) ;
	leanBus.on( 'ready' , () => leanCount ++ ) ;
	leanBus.on( 'ready' , () => leanCount ++ ) ;

	var ev3Count = 0 ,
		ev3Bus = new LeanEvents() ;
	ev3Bus.on( 'ready' , () => ev3Count ++ ) ;
	ev3Bus.on( 'ready' , () => ev3Count ++ ) ;
	ev3Bus.on( 'ready' , () => ev3Count ++ ) ;

	competitor( "built-in Node.js events" , () => {
		nodeBus.on( 'ready' , fn1 ) ; nodeBus.on( 'ready' , fn2 ) ; nodeBus.on( 'ready' , fn3 ) ; nodeBus.on( 'ready' , fn4 ) ; nodeBus.on( 'ready' , fn5 ) ;
		nodeBus.off( 'ready' , fn1 ) ; nodeBus.off( 'ready' , fn2 ) ; nodeBus.off( 'ready' , fn3 ) ; nodeBus.off( 'ready' , fn4 ) ; nodeBus.off( 'ready' , fn5 ) ;
	} ) ;

	competitor( "NextGen events" , () => {
		ngevBus.on( 'ready' , fn1 ) ; ngevBus.on( 'ready' , fn2 ) ; ngevBus.on( 'ready' , fn3 ) ; ngevBus.on( 'ready' , fn4 ) ; ngevBus.on( 'ready' , fn5 ) ;
		ngevBus.off( 'ready' , fn1 ) ; ngevBus.off( 'ready' , fn2 ) ; ngevBus.off( 'ready' , fn3 ) ; ngevBus.off( 'ready' , fn4 ) ; ngevBus.off( 'ready' , fn5 ) ;
	} ) ;

	competitor( "Lean events" , () => {
		leanBus.on( 'ready' , fn1 ) ; leanBus.on( 'ready' , fn2 ) ; leanBus.on( 'ready' , fn3 ) ; leanBus.on( 'ready' , fn4 ) ; leanBus.on( 'ready' , fn5 ) ;
		leanBus.off( 'ready' , fn1 ) ; leanBus.off( 'ready' , fn2 ) ; leanBus.off( 'ready' , fn3 ) ; leanBus.off( 'ready' , fn4 ) ; leanBus.off( 'ready' , fn5 ) ;
	} ) ;

	competitor( "EventEmitter3" , () => {
		ev3Bus.on( 'ready' , fn1 ) ; ev3Bus.on( 'ready' , fn2 ) ; ev3Bus.on( 'ready' , fn3 ) ; ev3Bus.on( 'ready' , fn4 ) ; ev3Bus.on( 'ready' , fn5 ) ;
		ev3Bus.off( 'ready' , fn1 ) ; ev3Bus.off( 'ready' , fn2 ) ; ev3Bus.off( 'ready' , fn3 ) ; ev3Bus.off( 'ready' , fn4 ) ; ev3Bus.off( 'ready' , fn5 ) ;
	} ) ;
} ) ;



benchmark( "Adding 5 one-time listeners per emit" , () => {
	var fn1 = () => nodeCount ++ ,
		fn2 = () => nodeCount ++ ,
		fn3 = () => nodeCount ++ ,
		fn4 = () => nodeCount ++ ,
		fn5 = () => nodeCount ++ ;

	var nodeCount = 0 ,
		nodeBus = new EventEmitter() ;
	nodeBus.on( 'ready' , () => nodeCount ++ ) ;
	nodeBus.on( 'ready' , () => nodeCount ++ ) ;
	nodeBus.on( 'ready' , () => nodeCount ++ ) ;

	var ngevCount = 0 ,
		ngevBus = new Ngev() ;
	ngevBus.on( 'ready' , () => ngevCount ++ ) ;
	ngevBus.on( 'ready' , () => ngevCount ++ ) ;
	ngevBus.on( 'ready' , () => ngevCount ++ ) ;

	var leanCount = 0 ,
		leanBus = new LeanEvents() ;
	leanBus.on( 'ready' , () => leanCount ++ ) ;
	leanBus.on( 'ready' , () => leanCount ++ ) ;
	leanBus.on( 'ready' , () => leanCount ++ ) ;

	var ev3Count = 0 ,
		ev3Bus = new LeanEvents() ;
	ev3Bus.on( 'ready' , () => ev3Count ++ ) ;
	ev3Bus.on( 'ready' , () => ev3Count ++ ) ;
	ev3Bus.on( 'ready' , () => ev3Count ++ ) ;

	competitor( "built-in Node.js events" , () => {
		nodeBus.once( 'ready' , fn1 ) ; nodeBus.once( 'ready' , fn2 ) ; nodeBus.once( 'ready' , fn3 ) ; nodeBus.once( 'ready' , fn4 ) ; nodeBus.once( 'ready' , fn5 ) ;
		nodeBus.emit( 'ready' ) ;
		nodeBus.once( 'ready' , fn1 ) ; nodeBus.once( 'ready' , fn2 ) ; nodeBus.once( 'ready' , fn3 ) ; nodeBus.once( 'ready' , fn4 ) ; nodeBus.once( 'ready' , fn5 ) ;
		nodeBus.emit( 'ready' ) ;
	} ) ;

	competitor( "NextGen events" , () => {
		ngevBus.once( 'ready' , fn1 ) ; ngevBus.once( 'ready' , fn2 ) ; ngevBus.once( 'ready' , fn3 ) ; ngevBus.once( 'ready' , fn4 ) ; ngevBus.once( 'ready' , fn5 ) ;
		ngevBus.emit( 'ready' ) ;
		ngevBus.once( 'ready' , fn1 ) ; ngevBus.once( 'ready' , fn2 ) ; ngevBus.once( 'ready' , fn3 ) ; ngevBus.once( 'ready' , fn4 ) ; ngevBus.once( 'ready' , fn5 ) ;
		ngevBus.emit( 'ready' ) ;
	} ) ;

	competitor( "Lean events" , () => {
		leanBus.once( 'ready' , fn1 ) ; leanBus.once( 'ready' , fn2 ) ; leanBus.once( 'ready' , fn3 ) ; leanBus.once( 'ready' , fn4 ) ; leanBus.once( 'ready' , fn5 ) ;
		leanBus.emit( 'ready' ) ;
		leanBus.once( 'ready' , fn1 ) ; leanBus.once( 'ready' , fn2 ) ; leanBus.once( 'ready' , fn3 ) ; leanBus.once( 'ready' , fn4 ) ; leanBus.once( 'ready' , fn5 ) ;
		leanBus.emit( 'ready' ) ;
	} ) ;

	competitor( "EventEmitter3" , () => {
		ev3Bus.once( 'ready' , fn1 ) ; ev3Bus.once( 'ready' , fn2 ) ; ev3Bus.once( 'ready' , fn3 ) ; ev3Bus.once( 'ready' , fn4 ) ; ev3Bus.once( 'ready' , fn5 ) ;
		ev3Bus.emit( 'ready' ) ;
		ev3Bus.once( 'ready' , fn1 ) ; ev3Bus.once( 'ready' , fn2 ) ; ev3Bus.once( 'ready' , fn3 ) ; ev3Bus.once( 'ready' , fn4 ) ; ev3Bus.once( 'ready' , fn5 ) ;
		ev3Bus.emit( 'ready' ) ;
	} ) ;
} ) ;

