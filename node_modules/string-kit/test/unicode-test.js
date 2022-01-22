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



var string = require( '../lib/string.js' ) ;





/* Misc */



function Cell( char ) {
	this.char = char || ' ' ;
	this.filler = char === null ;
}





/* Tests */



describe( "Unicode" , () => {

	it( "unicode.length() should report correctly the length of a string" , () => {
		expect( string.unicode.length( '' ) ).to.be( 0 ) ;
		expect( string.unicode.length( 'a' ) ).to.be( 1 ) ;
		expect( string.unicode.length( 'abc' ) ).to.be( 3 ) ;
		expect( string.unicode.length( '\x1b[' ) ).to.be( 2 ) ;
		expect( string.unicode.length( '𝌆' ) ).to.be( 1 ) ;
		expect( string.unicode.length( 'a𝌆' ) ).to.be( 2 ) ;
		expect( string.unicode.length( 'a𝌆a𝌆a' ) ).to.be( 5 ) ;
		expect( string.unicode.length( 'é𝌆é𝌆é' ) ).to.be( 5 ) ;
		expect( string.unicode.length( '䷆䷆' ) ).to.be( 2 ) ;
		expect( string.unicode.length( '備' ) ).to.be( 1 ) ;
		expect( string.unicode.length( '備備' ) ).to.be( 2 ) ;
		expect( string.unicode.length( '備-備' ) ).to.be( 3 ) ;
	} ) ;

	it( "unicode.firstCodePoint() should produce the first character codepoint" , () => {
		expect( string.unicode.firstCodePoint( 'a' ) ).to.be( 97 ) ;
		expect( string.unicode.firstCodePoint( 'azdf' ) ).to.be( 97 ) ;
		expect( string.unicode.firstCodePoint( '𝌆' ) ).to.be( 119558 ) ;
		expect( string.unicode.firstCodePoint( '𝌆𝌆a𝌆' ) ).to.be( 119558 ) ;
		expect( string.unicode.firstCodePoint( 'a𝌆𝌆a𝌆' ) ).to.be( 97 ) ;
		expect( string.unicode.firstCodePoint( '' ) ).to.be( NaN ) ;
	} ) ;

	it( "unicode.firstChar() should produce the first character codepoint" , () => {
		expect( string.unicode.firstChar( 'a' ) ).to.be( 'a' ) ;
		expect( string.unicode.firstChar( 'azdf' ) ).to.be( 'a' ) ;
		expect( string.unicode.firstChar( '𝌆' ) ).to.be( '𝌆' ) ;
		expect( string.unicode.firstChar( '𝌆𝌆a𝌆' ) ).to.be( '𝌆' ) ;
		expect( string.unicode.firstChar( 'a𝌆𝌆a𝌆' ) ).to.be( 'a' ) ;
		expect( string.unicode.firstChar( '' ) ).to.be( undefined ) ;
	} ) ;

	it( "unicode.decode() should produce an array of codepoint" , () => {
		expect( string.unicode.decode( '' ) ).to.equal( [] ) ;
		expect( string.unicode.decode( 'a' ) ).to.equal( [ 97 ] ) ;
		expect( string.unicode.decode( 'abc' ) ).to.equal( [ 97 , 98 , 99 ] ) ;
		expect( string.unicode.decode( '\x1b[' ) ).to.equal( [ 27 , 91 ] ) ;
		expect( string.unicode.decode( '𝌆' ) ).to.equal( [ 119558 ] ) ;
		expect( string.unicode.decode( 'a𝌆' ) ).to.equal( [ 97 , 119558 ] ) ;
		expect( string.unicode.decode( 'a𝌆a𝌆a' ) ).to.equal( [ 97 , 119558 , 97 , 119558 , 97 ] ) ;
		expect( string.unicode.decode( '䷆䷆' ) ).to.equal( [ 19910 , 19910 ] ) ;
		expect( string.unicode.decode( '備' ) ).to.equal( [ 194569 ] ) ;
		expect( string.unicode.decode( '備備' ) ).to.equal( [ 194569 , 194569 ] ) ;
		expect( string.unicode.decode( '備-備' ) ).to.equal( [ 194569 , 45 , 194569 ] ) ;
	} ) ;

	it( "unicode.toArray() should produce an array of characters" , () => {
		expect( string.unicode.toArray( '' ) ).to.equal( [] ) ;
		expect( string.unicode.toArray( 'a' ) ).to.equal( [ 'a' ] ) ;
		expect( string.unicode.toArray( 'abc' ) ).to.equal( [ 'a' , 'b' , 'c' ] ) ;
		expect( string.unicode.toArray( '\x1b[' ) ).to.equal( [ '\x1b' , '[' ] ) ;
		expect( string.unicode.toArray( '𝌆' ) ).to.equal( [ '𝌆' ] ) ;
		expect( string.unicode.toArray( 'a𝌆' ) ).to.equal( [ 'a' , '𝌆' ] ) ;
		expect( string.unicode.toArray( 'a𝌆a𝌆a' ) ).to.equal( [ 'a' , '𝌆' , 'a' , '𝌆' , 'a' ] ) ;
		expect( string.unicode.toArray( 'é𝌆é𝌆é' ) ).to.equal( [ 'é' , '𝌆' , 'é' , '𝌆' , 'é' ] ) ;
		expect( string.unicode.toArray( '䷆䷆' ) ).to.equal( [ '䷆' , '䷆' ] ) ;
		expect( string.unicode.toArray( '備' ) ).to.equal( [ '備' ] ) ;
		expect( string.unicode.toArray( '備備' ) ).to.equal( [ '備' , '備' ] ) ;
		expect( string.unicode.toArray( '備-備' ) ).to.equal( [ '備' , '-' , '備' ] ) ;
	} ) ;

	it( "unicode.toCells() should produce an array of characters with filler chars following wide chars and tab" , () => {
		expect( string.unicode.toCells( Cell , '' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [] ) ;
		expect( string.unicode.toCells( Cell , 'a' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ 'a' ] ) ;
		expect( string.unicode.toCells( Cell , 'abc' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ 'a' , 'b' , 'c' ] ) ;
		expect( string.unicode.toCells( Cell , '\x1b[' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ '\x1b' , '[' ] ) ;
		expect( string.unicode.toCells( Cell , '𝌆' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ '𝌆' ] ) ;
		expect( string.unicode.toCells( Cell , 'a𝌆' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ 'a' , '𝌆' ] ) ;
		expect( string.unicode.toCells( Cell , 'a𝌆a𝌆a' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ 'a' , '𝌆' , 'a' , '𝌆' , 'a' ] ) ;
		expect( string.unicode.toCells( Cell , 'é𝌆é𝌆é' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ 'é' , '𝌆' , 'é' , '𝌆' , 'é' ] ) ;
		expect( string.unicode.toCells( Cell , '䷆䷆' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ '䷆' , '䷆' ] ) ;
		expect( string.unicode.toCells( Cell , '備' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ '備' , null ] ) ;
		expect( string.unicode.toCells( Cell , '備備' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ '備' , null , '備' , null ] ) ;
		expect( string.unicode.toCells( Cell , '備-備' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ '備' , null , '-' , '備' , null ] ) ;

		// Tabs
		expect( string.unicode.toCells( Cell , '\ta' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ '\t' , null , null , null , 'a' ] ) ;
		expect( string.unicode.toCells( Cell , '\ta' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ '\t' , null , null , null , 'a' ] ) ;
		expect( string.unicode.toCells( Cell , 'a\ta' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ 'a' , '\t' , null , null , 'a' ] ) ;
		expect( string.unicode.toCells( Cell , 'aa\ta' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ 'a' , 'a' , '\t' , null , 'a' ] ) ;
		expect( string.unicode.toCells( Cell , 'aaa\ta' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ 'a' , 'a' , 'a' , '\t' , 'a' ] ) ;
		expect( string.unicode.toCells( Cell , 'aaaa\ta' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ 'a' , 'a' , 'a' , 'a' , '\t' , null , null , null , 'a' ] ) ;
		expect( string.unicode.toCells( Cell , '備\ta' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ '備' , null , '\t' , null , 'a' ] ) ;

		expect( string.unicode.toCells( Cell , '\t\t' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ '\t' , null , null , null , '\t' , null , null , null ] ) ;
		expect( string.unicode.toCells( Cell , '\ta\t' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ '\t' , null , null , null , 'a' , '\t' , null , null ] ) ;
		expect( string.unicode.toCells( Cell , 'a\t\t' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ 'a' , '\t' , null , null , '\t' , null , null , null ] ) ;
		expect( string.unicode.toCells( Cell , 'a\ta\t' ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ 'a' , '\t' , null , null , 'a' , '\t' , null , null ] ) ;

		expect( string.unicode.toCells( Cell , '\ta' , undefined , 2 ).map( cell => cell.filler ? null : cell.char ) ).to.be.like( [ '\t' , null , 'a' ] ) ;
	} ) ;

	it( "unicode.fromCells() should be the inverse of the unicode.toCells()" , () => {
		expect( string.unicode.fromCells( string.unicode.toCells( Cell , '備\ta' ) ) ).to.be( '備\ta' ) ;
	} ) ;

	it( "unicode.surrogatePair() should return 0 for single char, 1 for leading surrogate, -1 for trailing surrogate" , () => {
		expect( string.unicode.surrogatePair( 'a' ) ).to.be( 0 ) ;
		expect( '𝌆'.length ).to.be( 2 ) ;
		expect( string.unicode.surrogatePair( '𝌆'[0] ) ).to.be( 1 ) ;
		expect( string.unicode.surrogatePair( '𝌆'[1] ) ).to.be( -1 ) ;
		expect( '備'.length ).to.be( 2 ) ;
		expect( string.unicode.surrogatePair( '備'[0] ) ).to.be( 1 ) ;
		expect( string.unicode.surrogatePair( '備'[1] ) ).to.be( -1 ) ;

		// Can be wide or not, but expressed in only 1 code unit
		expect( '䷆'.length ).to.be( 1 ) ;
		expect( string.unicode.surrogatePair( '䷆'[0] ) ).to.be( 0 ) ;
		//		expect( string.unicode.surrogatePair( '䷆'[1] ) ).to.be( undefined ) ;
	} ) ;

	it( "unicode.isFullWidth() should return true if the char is full-width" , () => {
		expect( string.unicode.isFullWidth( 'a' ) ).to.be( false ) ;
		expect( string.unicode.isFullWidth( 'aa' ) ).to.be( false ) ;
		expect( string.unicode.isFullWidth( '＠' ) ).to.be( true ) ;
		expect( string.unicode.isFullWidth( '𝌆' ) ).to.be( false ) ;
		expect( string.unicode.isFullWidth( '備' ) ).to.be( true ) ;
		expect( string.unicode.isFullWidth( '䷆' ) ).to.be( false ) ;

		expect( string.unicode.isFullWidth( '＠＠' ) ).to.be( true ) ;
		expect( string.unicode.isFullWidth( 'a＠' ) ).to.be( false ) ;
		expect( string.unicode.isFullWidth( '＠a' ) ).to.be( true ) ;
	} ) ;

	it( ".toFullWidth() should transform a character to its full-width variant, if it exist" , () => {
		expect( string.unicode.toFullWidth( '@' ) ).to.be( '＠' ) ;
		expect( string.unicode.toFullWidth( 'é' ) ).to.be( 'é' ) ;
	} ) ;

	it( ".width() should return the width of a string when displayed on a terminal or a monospace font" , () => {
		expect( string.unicode.width( 'aé@à' ) ).to.be( 4 ) ;
		expect( string.unicode.width( 'aé＠à' ) ).to.be( 5 ) ;
		expect( string.unicode.width( 'aé汉字à' ) ).to.be( 7 ) ;
	} ) ;

	it( ".arrayWidth() should return the width of an array of string when displayed on a terminal or a monospace font" , () => {
		expect( string.unicode.arrayWidth( [ '汉' , '字' ] ) ).to.be( 4 ) ;
		expect( string.unicode.arrayWidth( [ '汉' , '字' , '＠' ] ) ).to.be( 6 ) ;
		expect( string.unicode.arrayWidth( [ '汉' , 'a' , '字' , '&' ] ) ).to.be( 6 ) ;
		expect( string.unicode.arrayWidth( [ 'c' , '汉' , '字' , '＠' , '&' ] ) ).to.be( 8 ) ;

		expect( string.unicode.arrayWidth( [ '汉' , '字' ] , 2 ) ).to.be( 4 ) ;
		expect( string.unicode.arrayWidth( [ '汉' , '字' ] , 1 ) ).to.be( 2 ) ;
		expect( string.unicode.arrayWidth( [ 'c' , '汉' , '字' , '＠' , '&' ] , 0 ) ).to.be( 0 ) ;
		expect( string.unicode.arrayWidth( [ 'c' , '汉' , '字' , '＠' , '&' ] , 1 ) ).to.be( 1 ) ;
		expect( string.unicode.arrayWidth( [ 'c' , '汉' , '字' , '＠' , '&' ] , 2 ) ).to.be( 3 ) ;
		expect( string.unicode.arrayWidth( [ 'c' , '汉' , '字' , '＠' , '&' ] , 3 ) ).to.be( 5 ) ;
		expect( string.unicode.arrayWidth( [ 'c' , '汉' , '字' , '＠' , '&' ] , 4 ) ).to.be( 7 ) ;
		expect( string.unicode.arrayWidth( [ 'c' , '汉' , '字' , '＠' , '&' ] , 5 ) ).to.be( 8 ) ;
	} ) ;

	it( ".truncateWidth() should return a string that does not exceed the limit" , () => {
		expect( string.unicode.truncateWidth( 'aé@à' , 3 ) ).to.be( 'aé@' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 3 ) ;
		expect( string.unicode.truncateWidth( 'aé@à' , 4 ) ).to.be( 'aé@à' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 4 ) ;
		expect( string.unicode.truncateWidth( 'aé@à' , 5 ) ).to.be( 'aé@à' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 4 ) ;
		expect( string.unicode.truncateWidth( 'aé＠à' , 2 ) ).to.be( 'aé' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 2 ) ;
		expect( string.unicode.truncateWidth( 'aé＠à' , 3 ) ).to.be( 'aé' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 2 ) ;
		expect( string.unicode.truncateWidth( 'aé＠à' , 4 ) ).to.be( 'aé＠' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 4 ) ;
		expect( string.unicode.truncateWidth( 'aé＠à' , 5 ) ).to.be( 'aé＠à' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 5 ) ;
		expect( string.unicode.truncateWidth( 'aé＠à' , 6 ) ).to.be( 'aé＠à' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 5 ) ;
		expect( string.unicode.truncateWidth( 'aé汉字à' , 2 ) ).to.be( 'aé' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 2 ) ;
		expect( string.unicode.truncateWidth( 'aé汉字à' , 3 ) ).to.be( 'aé' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 2 ) ;
		expect( string.unicode.truncateWidth( 'aé汉字à' , 4 ) ).to.be( 'aé汉' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 4 ) ;
		expect( string.unicode.truncateWidth( 'aé汉字à' , 5 ) ).to.be( 'aé汉' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 4 ) ;
		expect( string.unicode.truncateWidth( 'aé汉字à' , 6 ) ).to.be( 'aé汉字' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 6 ) ;
		expect( string.unicode.truncateWidth( 'aé汉字à' , 7 ) ).to.be( 'aé汉字à' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 7 ) ;
		expect( string.unicode.truncateWidth( 'aé汉字à' , 8 ) ).to.be( 'aé汉字à' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 7 ) ;

		expect( string.unicode.truncateWidth( 'aé汉字' , 5 ) ).to.be( 'aé汉' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 4 ) ;
		expect( string.unicode.truncateWidth( 'aé汉字' , 6 ) ).to.be( 'aé汉字' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 6 ) ;
		expect( string.unicode.truncateWidth( 'aé汉字' , 7 ) ).to.be( 'aé汉字' ) ;
		expect( string.unicode.getLastTruncateWidth() ).to.be( 6 ) ;
	} ) ;
} ) ;

