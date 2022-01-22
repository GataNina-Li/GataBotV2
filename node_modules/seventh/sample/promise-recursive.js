#!/usr/bin/env node
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



const seventh = require( '../' ) ;
var Promise = require( '../lib/Promise.js' ) ;
//var Promise = require( 'bluebird' ) ;

var count = 0 ;

function recursive()
{
	return new Promise( ( resolve , reject ) => {
		setTimeout( () => {
			console.log( count ++ , p ) ;
			//resolve( count ) ;
			//resolve( 10 ) ;
			resolve( count < 3 ? recursive() : count ) ;
			//reject( count < 5 ? recursive() : count ) ;
		} , 250 ) ;
	} ) ;
}

var p = recursive() ;

p.then( ( value ) => {
	console.log( 'then!' , value , p ) ;
	
	p.then( ( value ) => {
		console.log( 'then²!' , value , p ) ;
		
		setTimeout( () => {
			p.then( ( value ) => {
				console.log( 'then3!' , value , p ) ;
			} ) ;
		} , 100 ) ;
	} ) ;
} ) ;

p.catch( ( value ) => {
	console.log( 'catch!' , value , p ) ;
} ) ;

