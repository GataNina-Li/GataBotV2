/*
	Tree Kit

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



var tree = require( '../lib/tree.js' ) ;



			/* Tests */



describe( "defineLazyProperty()" , function() {
	
	it( 'should define property using a getter that after its first execution is reconfigured as its return-value and is not writable' , function() {
		
		var object = {} ;
		var counter = 0 ;
		
		tree.defineLazyProperty( object , 'myprop' , function() {
			counter ++ ;
			return counter ;
		} ) ;
		
		expect( object.myprop ).to.be( 1 ) ;
		expect( object.myprop ).to.be( 1 ) ;
		expect( object.myprop ).to.be( 1 ) ;
		expect( counter ).to.be( 1 ) ;
		expect( function() { object.myprop ++ ; } ).to.throw() ;
		expect( object.myprop ).to.be( 1 ) ;
	} ) ;
} ) ;



