#!/usr/bin/env node
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
var NGEvents = require( '../lib/NextGenEvents.js' ) ;
var awesomeEmitter = new NGEvents() ;
var clockEmitter = new NGEvents() ;

var nextBeat = 1 ;

// Emit one 'heartBeat' event every few seconds
setInterval( function() {
	var beat = nextBeat ++ ;
	
	awesomeEmitter.emit( 'heartBeat' , beat , function() {
		console.log( 'heartBeat (%d) callback' , beat ) ;
	} ) ;
	
	console.log( 'heartBeat (%d) emitted' , beat ) ;
	
} , 2000 ) ;

setInterval( function() { clockEmitter.emit( 'time' , new Date() ) ; } , 5150 ) ;



var WebSocket = require( 'ws' ) ;

var server = new WebSocket.Server( { port: 12345 } ) ;
 
server.on( 'connection' , function connection( ws ) {
	
	// Create a proxy for this client
	var proxy = new NGEvents.Proxy() ;
	
	// Add the local service and provide all right to it to remote
	proxy.addLocalService( 'awesomeService' , awesomeEmitter , { listen: true , emit: true , ack: true } ) ;
	
	// Only provide 'listen' to this service
	proxy.addLocalService( 'clockService' , clockEmitter , { listen: true } ) ;
	
	ws.on( 'message' , function incoming( message ) {
		//proxy.receive( message ) ;
		
		try {
			message = JSON.parse( message ) ;
		}
		catch ( error ) {
			return ;
		}
		
		ws.emit( 'messageObject' , message ) ;
	} ) ;
	
	ws.on( 'messageObject' , function objectIncoming( message ) {
		console.log( 'received: ' , message ) ;
		// Do something with message
		proxy.receive( message ) ;
	} ) ;
	
	proxy.receive = function receive( raw ) {
		proxy.push( raw ) ;
		//try { proxy.push( JSON.parse( raw ) ; } catch ( error ) {}
	} ;
	
	proxy.send = function send( message ) {
		ws.send( JSON.stringify( message ) ) ;
	} ;
	
	ws.on( 'close' , function close() {
		console.log( 'client closed' ) ;
		proxy.destroy() ;
	} ) ;
	
} ) ;

