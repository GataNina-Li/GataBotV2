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



var failCount = 7 ;

function fn( txt , delay = 50 )
{
	return new Promise( ( resolve , reject ) => {
		setTimeout( () => {
			console.log( txt ) ;
			
			if ( failCount -- > 0 ) { reject( 'failed!' ) ; }
			else { resolve( txt ) ; }
			
		} , delay ) ;
	} ) ;
}

var retryFn ;

//retryFn = seventh.retry( 30 , 100 , 2 , fn ) ;
retryFn = seventh.variableRetry( fn ) ;

//retryFn( 'something' ).then(
retryFn( 3 , 100 , 2 , 'something' ).then(
	( value ) => console.log( 'fulfilled:' , value ) ,
	( error ) => console.log( 'rejected:' , error )
) ;

