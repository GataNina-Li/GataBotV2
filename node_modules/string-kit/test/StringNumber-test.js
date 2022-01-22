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

/* global describe, it, expect */

"use strict" ;



const StringNumber = require( '..' ).StringNumber ;



describe( "StringNumber" , () => {

	it( "convert back and forth" , () => {
		var sn ;
		
		sn = new StringNumber( 0 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [], exposant: 0 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 0 ) ;

		sn = new StringNumber( 0.1234 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1, 2, 3, 4 ], exposant: 0 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 0.1234 ) ;

		sn = new StringNumber( 0.0001234 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1, 2, 3, 4 ], exposant: -3 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 0.0001234 ) ;

		sn = new StringNumber( 1.234 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1, 2, 3, 4 ], exposant: 1 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 1.234 ) ;

		sn = new StringNumber( 123.4 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1, 2, 3, 4 ], exposant: 3 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 123.4 ) ;

		sn = new StringNumber( 1234 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1, 2, 3, 4 ], exposant: 4 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 1234 ) ;

		sn = new StringNumber( 12340 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1, 2, 3, 4 ], exposant: 5 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 12340 ) ;

		sn = new StringNumber( 123400000 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1, 2, 3, 4 ], exposant: 9 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 123400000 ) ;

		sn = new StringNumber( 123400000000000 ) ;
		//console.log( sn , sn.toNumber() ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1, 2, 3, 4 ], exposant: 15 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 123400000000000 ) ;

		sn = new StringNumber( 1234000000000000000000000 ) ;
		//console.log( sn , sn.toNumber() ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1, 2, 3, 4 ], exposant: 25 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 1234000000000000000000000 ) ;

		sn = new StringNumber( 0.000000000000000000001234 ) ;
		//console.log( sn , sn.toNumber() ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1, 2, 3, 4 ], exposant: -20 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 0.000000000000000000001234 ) ;

		sn = new StringNumber( 987.00000000001234 ) ;
		//console.log( sn , sn.toNumber() ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 9, 8, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 4 ], exposant: 3 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 987.00000000001234 ) ;

		sn = new StringNumber( -0.1234 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: -1, digits: [ 1, 2, 3, 4 ], exposant: 0 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( -0.1234 ) ;

		sn = new StringNumber( -123.4 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: -1, digits: [ 1, 2, 3, 4 ], exposant: 3 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( -123.4 ) ;
	} ) ;

	it( "precision" , () => {
		var sn ;
		
		sn = new StringNumber( 1001 ).precision( 3 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1 ], exposant: 4 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 1000 ) ;
		
		sn = new StringNumber( 1004 ).precision( 3 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1 ], exposant: 4 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 1000 ) ;
		
		sn = new StringNumber( 1005 ).precision( 3 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1, 0, 1 ], exposant: 4 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 1010 ) ;
		
		sn = new StringNumber( 1009 ).precision( 3 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1, 0, 1 ], exposant: 4 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 1010 ) ;
		
		sn = new StringNumber( 1039 ).precision( 3 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 1, 0, 4 ], exposant: 4 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 1040 ) ;
		
		sn = new StringNumber( 1999 ).precision( 3 ) ;
		//console.log( sn ) ;
		expect( sn ).to.be.like( { sign: 1, digits: [ 2 ], exposant: 4 , special: null , decimalSeparator: '.' , groupSeparator: '' } ) ;
		expect( sn.toNumber() ).to.be( 2000 ) ;
	} ) ;

	it( "rounding" ) ;
	it( "leading/trailing zero padding" ) ;
	it( "metric system" ) ;
} ) ;

