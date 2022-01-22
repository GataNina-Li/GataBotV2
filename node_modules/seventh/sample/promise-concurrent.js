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



const Promise = require( '..' ) ;
//var Promise = require( 'bluebird' ) ;



Promise.concurrent( 3 , [
		//Promise.reject( 'error...' ) ,
		100 ,
		500 ,
		Promise.resolveTimeout( 200 , 50 ) ,
		200 ,
		Promise.resolveTimeout( 100 , "bob" ) ,
		"jack" ,
		//Promise.rejectTimeout( 110 , 'error!' )
	] ,
	( delay , index ) => {
		return new Promise( ( resolve , reject ) => {
			setTimeout( () => {
				console.log( '#' + index + ' -- delay: ' + delay ) ;
				resolve( delay ) ;
			} , delay ) ;
		} ) ;
	}
)
.then( values => console.log( 'Finished!' , values ) )
.catch( error => console.log( 'Error:' , error ) ) ;


