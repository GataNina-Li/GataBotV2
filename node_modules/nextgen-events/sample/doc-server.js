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

// Create our service/emitter
var heartBeatEmitter = new NGEvents() ;
var nextBeat = 1 ;

// Emit one 'heartBeat' event every few seconds
setInterval( function() {
	var beat = nextBeat ++ ;
	heartBeatEmitter.emit( 'heartBeat' , beat ) ;
} , 2000 ) ;

// Create our server
var WebSocket = require( 'ws' ) ;
var server = new WebSocket.Server( { port: 12345 } ) ;

// On new connection... 
server.on( 'connection' , function connection( ws ) {
	
	// Create a proxy for this client
	var proxy = new NGEvents.Proxy() ;
	
	// Add the local service exposed to this client and grant it all right
	proxy.addLocalService( 'heartBeatService' , heartBeatEmitter , { listen: true , emit: true , ack: true } ) ;
	
	// message received: just hook to proxy.receive()
	ws.on( 'message' , function incoming( message ) {
		proxy.receive( message ) ;
	} ) ;
	
	// Define the receive method: should call proxy.push() after decoding the raw message
	proxy.receive = function receive( raw ) {
		try { proxy.push( JSON.parse( raw ) ) ; } catch ( error ) {}
	} ;
	
	// Define the send method
	proxy.send = function send( message ) {
		ws.send( JSON.stringify( message ) ) ;
	} ;
	
	// Clean up after everything is done
	ws.on( 'close' , function close() {
		proxy.destroy() ;
	} ) ;
} ) ;

