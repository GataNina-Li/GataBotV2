/*
	String Kit

	Copyright (c) 2014 - 2021 Cédric Ronvel

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



const stringKit = {} ;
module.exports = stringKit ;



// Tier 0: add polyfills to stringKit
var fn_ ;
var polyfill = require( './polyfill.js' ) ;

for ( fn_ in polyfill ) {
	stringKit[ fn_ ] = function( str , ... args ) {
		return polyfill[ fn_ ].call( str , ... args ) ;
	} ;
}



Object.assign( stringKit ,

	// Tier 1
	{ escape: require( './escape.js' ) } ,
	{ ansi: require( './ansi.js' ) } ,
	{ unicode: require( './unicode.js' ) }
) ;



Object.assign( stringKit ,

	// Tier 2
	require( './format.js' ) ,

	// Tier 3
	require( './misc.js' ) ,
	require( './inspect.js' ) ,
	require( './regexp.js' ) ,
	require( './camel.js' ) ,
	{
		latinize: require( './latinize.js' ) ,
		toTitleCase: require( './toTitleCase.js' ) ,
		wordwrap: require( './wordwrap.js' ) ,
		naturalSort: require( './naturalSort.js' ) ,
		fuzzy: require( './fuzzy.js' ) ,
		StringNumber: require( './StringNumber.js' )
	}
) ;



// Install all polyfill into String.prototype
stringKit.installPolyfills = function installPolyfills() {
	var fn ;

	for ( fn in polyfill ) {
		if ( ! String.prototype[ fn ] ) {
			String.prototype[ fn ] = polyfill[ fn ] ;
		}
	}
} ;

