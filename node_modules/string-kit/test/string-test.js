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



const string = require( '..' ) ;



describe( "format()" , () => {

	var ansi = string.ansi ;
	var format = string.format ;
	var formatMethod = string.formatMethod ;

	it( "should perform basic examples" , () => {
		expect( format( 'Hello world' ) ).to.be( 'Hello world' ) ;
		expect( format( 'Hello %s' , 'world' ) ).to.be( 'Hello world' ) ;
		expect( format( 'Hello %s %s, how are you?' , 'Joe' , 'Doe' ) ).to.be( 'Hello Joe Doe, how are you?' ) ;
		expect( format( 'I have %i cookies.' , 3 ) ).to.be( 'I have 3 cookies.' ) ;
		expect( format( 'This company regains %d%% of market share.' , 36 ) ).to.be( 'This company regains 36% of market share.' ) ;
		expect( format( '11/8=%f' , 11 / 8 ) ).to.be( '11/8=1.375' ) ;
		expect( format( 'Binary %b %b' , 11 , 123 ) ).to.be( 'Binary 1011 1111011' ) ;
		expect( format( 'Octal %o %o' , 11 , 123 ) ).to.be( 'Octal 13 173' ) ;
		expect( format( 'Hexa %h %x %x' , 11 , 11 , 123 ) ).to.be( 'Hexa b 0b 7b' ) ;
		expect( format( 'JSON %J' , { hello: 'world' , here: 'is' , my: { wonderful: 'object' } } ) ).to.be( 'JSON {"hello":"world","here":"is","my":{"wonderful":"object"}}' ) ;
		expect( format( 'Inspect %I' , { hello: 'world' , here: 'is' , my: { wonderful: 'object' } } ) ).to.be( 'Inspect <Object> <object> {\n    hello: "world" <string>(5)\n    here: "is" <string>(2)\n    my: <Object> <object> {\n        wonderful: "object" <string>(6)\n    }\n}\n' ) ;
		//expect( format( 'Inspect %E' , new Error( 'Some error' ) ) ).to.be( '' ) ;
	} ) ;

	it( "%s should format string" , () => {
		expect( format( 'Hello %s' , 'world' ) ).to.be( 'Hello world' ) ;
		expect( format( 'Hello %s %s, how are you?' , 'Joe' , 'Doe' ) ).to.be( 'Hello Joe Doe, how are you?' ) ;

		// Should ignore formatting: taking it as literal
		expect( format( 'Hello %s' , 'w^bor^:ld' ) ).to.be( 'Hello w^bor^:ld' ) ;
		expect( format( 'Hello %s %s, how are you?' , '^rJ^go^be' , '^rD^go^be' ) ).to.be( 'Hello ^rJ^go^be ^rD^go^be, how are you?' ) ;
	} ) ;

	it( "%s padding syntax" , () => {
		expect( format( 'Cat. #1%[L10]s' , 'Cat. #2' ) ).to.be( 'Cat. #1   Cat. #2' ) ;
		expect( format( 'Cat. #1%[R10]s' , 'Cat. #2' ) ).to.be( 'Cat. #1Cat. #2   ' ) ;
		
		// Truncate
		expect( format( 'Cat. #1%[L10]s' , 'this is way to big' ) ).to.be( 'Cat. #1this is w…' ) ;
		expect( format( 'Cat. #1%[L10]s' , 'that was way to big' ) ).to.be( 'Cat. #1 that was…' ) ;
		expect( format( 'Cat. #1%[R10]s' , 'this is way to big' ) ).to.be( 'Cat. #1this is w…' ) ;
		expect( format( 'Cat. #1%[R10]s' , 'that was way to big' ) ).to.be( 'Cat. #1that was… ' ) ;

		// Unicode length/width
		expect( format( 'Cat. #1%[L10]s' , 'Cat. 備' ) ).to.be( 'Cat. #1   Cat. 備' ) ;	// 備 have length and width of 2
		expect( format( 'Cat. #1%[L10]s' , 'Cat. ＠' ) ).to.be( 'Cat. #1   Cat. ＠' ) ;	// ＠ have length of 1 but width of 2
		expect( format( 'Cat. #1%[R10]s' , 'Cat. 備' ) ).to.be( 'Cat. #1Cat. 備   ' ) ;	// 備 have length and width of 2
		expect( format( 'Cat. #1%[R10]s' , 'Cat. ＠' ) ).to.be( 'Cat. #1Cat. ＠   ' ) ;	// ＠ have length of 1 but width of 2
	} ) ;

	it( "common mode arg padding" , () => {
		expect( format( '%[L6]f' , 12.34 ) ).to.be( ' 12.34' ) ;
		expect( format( '%[L6]f' , -12.34 ) ).to.be( '-12.34' ) ;
		expect( format( '%[L8z3]f' , 12.34 ) ).to.be( '  012.34' ) ;
		expect( format( '%[L8z3]f' , -12.34 ) ).to.be( ' -012.34' ) ;
		expect( format( '%[.0L5]f' , 12.34 ) ).to.be( '   12' ) ;
		expect( format( '%[.0L5]f' , -12.34 ) ).to.be( '  -12' ) ;

		expect( format( '%[R6]f' , 12.34 ) ).to.be( '12.34 ' ) ;
		expect( format( '%[R6]f' , -12.34 ) ).to.be( '-12.34' ) ;
		expect( format( '%[R8z3]f' , 12.34 ) ).to.be( '012.34  ' ) ;
		expect( format( '%[R8z3]f' , -12.34 ) ).to.be( '-012.34 ' ) ;
		expect( format( '%[.0R5]f' , 12.34 ) ).to.be( '12   ' ) ;
		expect( format( '%[.0R5]f' , -12.34 ) ).to.be( '-12  ' ) ;
	} ) ;
	
	it( "%S should format string and interpret ^ formatting" , () => {
		expect( format( 'Hello %S' , 'w^bor^:ld' ) ).to.be( 'Hello w\x1b[34mor\x1b[0mld\x1b[0m' ) ;
		expect( format( 'Hello %S %S, how are you?' , '^rJ^go^be' , '^rD^go^be' ) ).to.be( 'Hello \x1b[31mJ\x1b[32mo\x1b[34me\x1b[0m \x1b[31mD\x1b[32mo\x1b[34me\x1b[0m, how are you?' ) ;
	} ) ;

	it( "%X should turn a string into hexadecimal" , () => {
		expect( format( '%X' , 'hello' ) ).to.be( '68656c6c6f' ) ;
		expect( format( 'Hello %X' , 'w' ) ).to.be( 'Hello 77' ) ;
		expect( format( 'Hello %X' , 'world' ) ).to.be( 'Hello 776f726c64' ) ;
		expect( format( 'Hello %X' , 'Cédric' ) ).to.be( 'Hello 43c3a964726963' ) ;
		expect( format( 'Hello %X' , Buffer.from( 'Cédric' ) ) ).to.be( 'Hello 43c3a964726963' ) ;
	} ) ;

	it( "argument sanitizing" , () => {
		expect( format( 'Some string: %s' , 'one\ntwo' ) ).to.be( 'Some string: one\ntwo' ) ;
		expect( format( 'Some string: %s' , 'one\x00two' ) ).to.be( 'Some string: one\\x00two' ) ;
		expect( format( 'Some string: %s' , 'one\n\x00two' ) ).to.be( 'Some string: one\n\\x00two' ) ;
	} ) ;

	it( "%u should format unsigned integer" , () => {
		expect( format( '%u' , 123 ) ).to.be( '123' ) ;
		expect( format( '%u' , 0 ) ).to.be( '0' ) ;
		expect( format( '%u' , -123 ) ).to.be( '0' ) ;
		expect( format( '%u' ) ).to.be( '0' ) ;
	} ) ;

	it( "%U should format *positive* unsigned integer" , () => {
		expect( format( '%U' , 123 ) ).to.be( '123' ) ;
		expect( format( '%U' , 0 ) ).to.be( '1' ) ;
		expect( format( '%U' , -123 ) ).to.be( '1' ) ;
		expect( format( '%U' ) ).to.be( '1' ) ;
	} ) ;

	it( "%f should format floating point numbers" , () => {
		expect( format( '%f' , 12345.6789 ) ).to.be( '12345.6789' ) ;
		expect( format( '%f' , 0.00123456789 ) ).to.be( '0.00123456789' ) ;
	} ) ;
	
	it( "%f group separator syntax" , () => {
		expect( format( '%[g]f' , 12345.6789 ) ).to.be( '12 345.6789' ) ;
		expect( format( '%[g ]f' , 12345.6789 ) ).to.be( '12 345.6789' ) ;
		expect( format( '%[g,]f' , 12345.6789 ) ).to.be( '12,345.6789' ) ;
		expect( format( "%[g']f" , 12345.6789 ) ).to.be( "12'345.6789" ) ;
		expect( format( '%[g_]f' , 12345.6789 ) ).to.be( '12_345.6789' ) ;

		expect( format( '%[g]f' , 1 ) ).to.be( '1' ) ;
		expect( format( '%[g]f' , 12 ) ).to.be( '12' ) ;
		expect( format( '%[g]f' , 123 ) ).to.be( '123' ) ;
		expect( format( '%[g]f' , 1234 ) ).to.be( '1 234' ) ;
		expect( format( '%[g]f' , 12345 ) ).to.be( '12 345' ) ;
		expect( format( '%[g]f' , 123456 ) ).to.be( '123 456' ) ;
		expect( format( '%[g]f' , 1234567 ) ).to.be( '1 234 567' ) ;
		expect( format( '%[g]f' , 12345678 ) ).to.be( '12 345 678' ) ;
		expect( format( '%[g]f' , 123456789 ) ).to.be( '123 456 789' ) ;
		expect( format( '%[g]f' , 1234567891 ) ).to.be( '1 234 567 891' ) ;

		expect( format( '%[g]f' , 0.1234 ) ).to.be( '0.1234' ) ;
	} ) ;
	
	it( "%f precision syntax" , () => {
		expect( format( '%[1]f' , 12345.6789 ) ).to.be( '10000' ) ;
		expect( format( '%[2]f' , 12345.6789 ) ).to.be( '12000' ) ;
		expect( format( '%[3]f' , 12345.6789 ) ).to.be( '12300' ) ;
		expect( format( '%[4]f' , 12345.6789 ) ).to.be( '12350' ) ;
		expect( format( '%[5]f' , 12345.6789 ) ).to.be( '12346' ) ;
		expect( format( '%[6]f' , 12345.6789 ) ).to.be( '12345.7' ) ;
		expect( format( '%[7]f' , 12345.6789 ) ).to.be( '12345.68' ) ;
		expect( format( '%[8]f' , 12345.6789 ) ).to.be( '12345.679' ) ;
		expect( format( '%[9]f' , 12345.6789 ) ).to.be( '12345.6789' ) ;
		expect( format( '%[10]f' , 12345.6789 ) ).to.be( '12345.6789' ) ;

		expect( format( '%[1]f' , 0.1234 ) ).to.be( '0.1' ) ;
		expect( format( '%[2]f' , 0.1234 ) ).to.be( '0.12' ) ;
		expect( format( '%[3]f' , 0.1234 ) ).to.be( '0.123' ) ;

		expect( format( '%[1]f' , 0.001234 ) ).to.be( '0.001' ) ;
		expect( format( '%[2]f' , 0.001234 ) ).to.be( '0.0012' ) ;
		expect( format( '%[3]f' , 0.001234 ) ).to.be( '0.00123' ) ;
	} ) ;
	
	it( "%f integer rounding syntax" , () => {
		expect( format( '%[1.]f' , 12345.6789 ) ).to.be( '12350' ) ;
		expect( format( '%[2.]f' , 12345.6789 ) ).to.be( '12300' ) ;
		expect( format( '%[3.]f' , 12345.6789 ) ).to.be( '12000' ) ;
		expect( format( '%[4.]f' , 12345.6789 ) ).to.be( '10000' ) ;
		expect( format( '%[5.]f' , 12345.6789 ) ).to.be( '0' ) ;
	} ) ;
	
	it( "%f decimal rounding syntax" , () => {
		expect( format( '%[.0]f' , 12345.6789 ) ).to.be( '12346' ) ;
		expect( format( '%[.1]f' , 12345.6789 ) ).to.be( '12345.7' ) ;
		expect( format( '%[.2]f' , 12345.6789 ) ).to.be( '12345.68' ) ;
		expect( format( '%[.3]f' , 12345.6789 ) ).to.be( '12345.679' ) ;

		expect( format( '%[.2]f' , 12345 ) ).to.be( '12345' ) ;
		expect( format( '%[.2]f' , 12345.6 ) ).to.be( '12345.6' ) ;
	} ) ;

	it( "%f decimal rounding artifact" , () => {
		// JS artifact, without the StringNumber class, it is impossible to get this working unless breaking anything else:
		expect( format( '%[.5]f' , 1000000 ) ).to.be( '1000000' ) ;
	} ) ;
	
	it( "%f decimal rounding syntax forcing 0 padding after decimal" , () => {
		expect( format( '%[.2!]f' , 12.523 ) ).to.be( '12.52' ) ;
		expect( format( '%[.2!]f' , 12.5 ) ).to.be( '12.50' ) ;
		expect( format( '%[.2!]f' , 12 ) ).to.be( '12.00' ) ;
	} ) ;

	it( "%f decimal rounding syntax forcing 0 padding after decimal only if there is decimal" , () => {
		expect( format( '%[.2?]f' , 12.523 ) ).to.be( '12.52' ) ;
		expect( format( '%[.2?]f' , 12.5 ) ).to.be( '12.50' ) ;
		expect( format( '%[.2?]f' , 12 ) ).to.be( '12' ) ;
	} ) ;
	
	it( "%f zero-left-padding syntax" , () => {
		expect( format( '%[z3]f' , 12.34 ) ).to.be( '012.34' ) ;
		expect( format( '%[z5]f' , 12.34 ) ).to.be( '00012.34' ) ;
		expect( format( '%[.0z5]f' , 12.34 ) ).to.be( '00012' ) ;
		
		// That nasty minus bug...
		expect( format( '%[z3]f' , -12.34 ) ).to.be( '-012.34' ) ;
		expect( format( '%[z5]f' , -12.34 ) ).to.be( '-00012.34' ) ;
		expect( format( '%[.0z5]f' , -12.34 ) ).to.be( '-00012' ) ;

		// Forcing no zero before the dot
		expect( format( '%[z0]f' , 0.1234 ) ).to.be( '.1234' ) ;
		expect( format( '%[z0]f' , 0.001234 ) ).to.be( '.001234' ) ;
	} ) ;
	
	it( "%e exponential notation" , () => {
		expect( format( '%e' , 0.001234 ) ).to.be( '1.234e-3' ) ;
		expect( format( '%e' , 0.01234 ) ).to.be( '1.234e-2' ) ;
		expect( format( '%e' , 0.1234 ) ).to.be( '1.234e-1' ) ;
		expect( format( '%e' , 1.234 ) ).to.be( '1.234e+0' ) ;
		expect( format( '%e' , 12.34 ) ).to.be( '1.234e+1' ) ;
		expect( format( '%e' , 123.4 ) ).to.be( '1.234e+2' ) ;
		expect( format( '%e' , 1234 ) ).to.be( '1.234e+3' ) ;

		// Precision
		expect( format( '%[2]e' , 123.4 ) ).to.be( '1.2e+2' ) ;
		expect( format( '%[3]e' , 123.4 ) ).to.be( '1.23e+2' ) ;

		// With padding
		expect( format( '%[2L7]e' , 123.4 ) ).to.be( ' 1.2e+2' ) ;

		// Rounding (make no sense with scientific notation, but it works)
		expect( format( '%[.2]e' , 123.4567 ) ).to.be( '1.2346e+2' ) ;
		expect( format( '%[.1]e' , 123.4567 ) ).to.be( '1.235e+2' ) ;
		expect( format( '%[1.]e' , 123.4567 ) ).to.be( '1.2e+2' ) ;
	} ) ;
	
	it( "%K scientific notation" , () => {
		expect( format( '%K' , 0.001234 ) ).to.be( '1.234 × 10⁻³' ) ;
		expect( format( '%K' , 0.01234 ) ).to.be( '1.234 × 10⁻²' ) ;
		expect( format( '%K' , 0.1234 ) ).to.be( '1.234 × 10⁻¹' ) ;
		expect( format( '%K' , 1.234 ) ).to.be( '1.234 × 10⁰' ) ;
		expect( format( '%K' , 12.34 ) ).to.be( '1.234 × 10¹' ) ;
		expect( format( '%K' , 123.4 ) ).to.be( '1.234 × 10²' ) ;
		expect( format( '%K' , 1234 ) ).to.be( '1.234 × 10³' ) ;

		// Precision
		expect( format( '%[2]K' , 123.4 ) ).to.be( '1.2 × 10²' ) ;
		expect( format( '%[3]K' , 123.4 ) ).to.be( '1.23 × 10²' ) ;

		// With padding
		expect( format( '%[2L11]K' , 123.4 ) ).to.be( '  1.2 × 10²' ) ;

		// Rounding (make no sense with scientific notation, but it works)
		expect( format( '%[.2]K' , 123.4567 ) ).to.be( '1.2346 × 10²' ) ;
		expect( format( '%[.1]K' , 123.4567 ) ).to.be( '1.235 × 10²' ) ;
		expect( format( '%[1.]K' , 123.4567 ) ).to.be( '1.2 × 10²' ) ;
	} ) ;
	
	it( "%P should format with (absolute) percent" , () => {
		expect( format( '%P' , 2 ) ).to.be( '200%' ) ;
		expect( format( '%P' , 1 ) ).to.be( '100%' ) ;
		expect( format( '%P' , 0 ) ).to.be( '0%' ) ;
		expect( format( '%P' , -1 ) ).to.be( '-100%' ) ;
		expect( format( '%P' , 1.23 ) ).to.be( '123%' ) ;
		expect( format( '%P' , 0.45 ) ).to.be( '45%' ) ;

		expect( format( '%P' , 0.12345 ) ).to.be( '12%' ) ;
		expect( format( '%[.1]P' , 0.12345 ) ).to.be( '12.3%' ) ;

		expect( format( '%[.1]P' , 0.00345 ) ).to.be( '0.3%' ) ;
		expect( format( '%[.1z0]P' , 0.00345 ) ).to.be( '.3%' ) ;

		// Check that setting up precision bypass the default rounding
		expect( format( '%[4]P' , 0.9975 ) ).to.be( '99.75%' ) ;
		expect( format( '%[5]P' , 1.2345 ) ).to.be( '123.45%' ) ;
	} ) ;

	it( "%p should format with relative percent" , () => {
		expect( format( '%p' , 2 ) ).to.be( '+100%' ) ;
		expect( format( '%p' , 1 ) ).to.be( '+0%' ) ;
		expect( format( '%p' , 0 ) ).to.be( '-100%' ) ;
		expect( format( '%p' , -1 ) ).to.be( '-200%' ) ;
		expect( format( '%p' , 1.23 ) ).to.be( '+23%' ) ;
		expect( format( '%p' , 0.45 ) ).to.be( '-55%' ) ;

		expect( format( '%p' , 1.2345 ) ).to.be( '+23%' ) ;
		expect( format( '%[.1]p' , 1.2345 ) ).to.be( '+23.4%' ) ;
		expect( format( '%p' , 0.12345 ) ).to.be( '-88%' ) ;
		expect( format( '%[.1]p' , 0.12345 ) ).to.be( '-87.7%' ) ;

		expect( format( '%[.1]p' , 1.00345 ) ).to.be( '+0.3%' ) ;
		expect( format( '%[.1z0]p' , 1.00345 ) ).to.be( '+.3%' ) ;
		expect( format( '%[.1]p' , 0.997 ) ).to.be( '-0.3%' ) ;
		expect( format( '%[.1z0]p' , 0.997 ) ).to.be( '-.3%' ) ;

		// Check that setting up precision bypass the default rounding
		expect( format( '%[4]p' , 0.9975 ) ).to.be( '-0.25%' ) ;
		expect( format( '%[5]p' , 1.2345 ) ).to.be( '+23.45%' ) ;
	} ) ;

	it( "%k should format with multipliers" , () => {
		expect( format( '%k' , 123 ) ).to.be( '123' ) ;
		expect( format( '%k' , 1234 ) ).to.be( '1.23k' ) ;
		expect( format( '%k' , 12345 ) ).to.be( '12.3k' ) ;
		expect( format( '%k' , 123456 ) ).to.be( '123k' ) ;
		expect( format( '%k' , 1.2345 ) ).to.be( '1.23' ) ;
		expect( format( '%k' , 12.345 ) ).to.be( '12.3' ) ;
		expect( format( '%k' , 123.45 ) ).to.be( '123' ) ;
		expect( format( '%k' , 1000 ) ).to.be( '1k' ) ;
		expect( format( '%k' , 1001 ) ).to.be( '1k' ) ;
		expect( format( '%k' , 1005 ) ).to.be( '1.01k' ) ;
		expect( format( '%k' , 999.999 ) ).to.be( '1k' ) ;
		expect( format( '%k' , 999.499 ) ).to.be( '999' ) ;
		expect( format( '%k' , 0.999 ) ).to.be( '999m' ) ;
		expect( format( '%k' , 0.0999 ) ).to.be( '99.9m' ) ;
		expect( format( '%k' , 0.00999 ) ).to.be( '9.99m' ) ;
		expect( format( '%k' , 0.000999 ) ).to.be( '999µ' ) ;
		expect( format( '%k' , 0.0000999 ) ).to.be( '99.9µ' ) ;
		expect( format( '%k' , 0.00000999 ) ).to.be( '9.99µ' ) ;
		expect( format( '%k' , 0.00000000999 ) ).to.be( '9.99n' ) ;
		expect( format( '%k' , 0.00000000000999 ) ).to.be( '9.99p' ) ;
		expect( format( '%k' , 0.00000000000000999 ) ).to.be( '9.99f' ) ;
		expect( format( '%k' , 123400 ) ).to.be( '123k' ) ;
		expect( format( '%k' , 123400000 ) ).to.be( '123M' ) ;
		expect( format( '%k' , 123400000000 ) ).to.be( '123G' ) ;
		expect( format( '%k' , 123400000000000 ) ).to.be( '123T' ) ;
		expect( format( '%k' , 123400000000000000 ) ).to.be( '123P' ) ;
		expect( format( '%k' , 123400000000000000000 ) ).to.be( '123E' ) ;
		expect( format( '%k' , -12.345 ) ).to.be( '-12.3' ) ;
		expect( format( '%k' , -123400000 ) ).to.be( '-123M' ) ;
		expect( format( '%k' , -0.00000000999 ) ).to.be( '-9.99n' ) ;

		// With modes
		expect( format( '%[4]k' , 1234 ) ).to.be( '1.234k' ) ;
	} ) ;

	it( "%m degree minute seconds notation" , () => {
		expect( format( '%m' , 0 ) ).to.be( '0°' ) ;
		expect( format( '%m' , 10 ) ).to.be( '10°' ) ;
		expect( format( '%m' , -10 ) ).to.be( '-10°' ) ;
		expect( format( '%m' , 1 + 17 / 60 ) ).to.be( '1°17′' ) ;
		expect( format( '%m' , 1 + 1 / 60 + 1 / 3600 ) ).to.be( '1°01′01″' ) ;
		expect( format( '%m' , 1 + 59 / 60 + 59 / 3600 ) ).to.be( '1°59′59″' ) ;
		expect( format( '%m' , - ( 1 + 59 / 60 + 59 / 3600 ) ) ).to.be( '-1°59′59″' ) ;
	} ) ;
	
	it( "%t should format time duration" , () => {
		expect( format( '%t' , 1000 ) ).to.be( '1s' ) ;
		expect( format( '%t' , 1234 ) ).to.be( '1s' ) ;
		expect( format( '%t' , 56789 ) ).to.be( '56s' ) ;
		expect( format( '%t' , 60000 ) ).to.be( '1min00s' ) ;
		expect( format( '%t' , 123456 ) ).to.be( '2min03s' ) ;
		expect( format( '%t' , 3600000 ) ).to.be( '1h00min00s' ) ;
		expect( format( '%t' , 3599999 ) ).to.be( '59min59s' ) ;
		expect( format( '%t' , 7890000 ) ).to.be( '2h11min30s' ) ;
	} ) ;

	it( "%z should format as base64" , () => {
		expect( format( '%z' , 'some text' ) ).to.be( 'c29tZSB0ZXh0' ) ;
		expect( format( '%z' , Buffer.from( 'some text' ) ) ).to.be( 'c29tZSB0ZXh0' ) ;
		expect( format( '%z' , 'some longer text' ) ).to.be( 'c29tZSBsb25nZXIgdGV4dA==' ) ;
		expect( format( '%z' , Buffer.from( 'some longer text' ) ) ).to.be( 'c29tZSBsb25nZXIgdGV4dA==' ) ;
		expect( format( '%z' , Buffer.from( '+/c=' , 'base64' ) ) ).to.be( '+/c=' ) ;
	} ) ;

	it( "%Z should format as base64-url" , () => {
		expect( format( '%Z' , 'some text' ) ).to.be( 'c29tZSB0ZXh0' ) ;
		expect( format( '%Z' , Buffer.from( 'some text' ) ) ).to.be( 'c29tZSB0ZXh0' ) ;
		expect( format( '%Z' , 'some longer text' ) ).to.be( 'c29tZSBsb25nZXIgdGV4dA' ) ;
		expect( format( '%Z' , Buffer.from( 'some longer text' ) ) ).to.be( 'c29tZSBsb25nZXIgdGV4dA' ) ;
		expect( format( '%Z' , Buffer.from( '+/c=' , 'base64' ) ) ).to.be( '-_c' ) ;
	} ) ;

	it( "should perform well the argument's index feature" , () => {
		expect( format( '%s%s%s' , 'A' , 'B' , 'C' ) ).to.be( 'ABC' ) ;
		expect( format( '%+1s%-1s%s' , 'A' , 'B' , 'C' ) ).to.be( 'BAC' ) ;
		expect( format( '%3s%s' , 'A' , 'B' , 'C' ) ).to.be( 'CBC' ) ;
	} ) ;

	it( "%n natural" , () => {
		expect( format( '%n' , 12345 ) ).to.be( '12 345' ) ;
		expect( format( '%n' , 1.23456789 ) ).to.be( '1.235' ) ;
		expect( format( '%n' , true ) ).to.be( 'true' ) ;
		expect( format( '%n' , false ) ).to.be( 'false' ) ;
		expect( format( '%n' , null ) ).to.be( 'null' ) ;

		expect( format( '%n' , [ 'one' , 'two' , 'three' ] ) ).to.be( '[one,two,three]' ) ;
		
		// Object and key sorting
		expect( format( '%n' , { bob: 3 , alice: 4 , john: 2 , jack: 3 } ) ).to.be( '{alice: 4, bob: 3, jack: 3, john: 2}' ) ;
	} ) ;

	it( "%N more natural" , () => {
		expect( format( '%N' , 12345 ) ).to.be( '12 345' ) ;
		expect( format( '%N' , 1.23456789 ) ).to.be( '1.235' ) ;
		expect( format( '%N' , true ) ).to.be( 'true' ) ;
		expect( format( '%N' , false ) ).to.be( 'false' ) ;
		expect( format( '%N' , null ) ).to.be( 'null' ) ;

		expect( format( '%N' , [ 'one' , 'two' , 'three' ] ) ).to.be( 'one, two, three' ) ;

		// Object and key sorting
		expect( format( '%N' , { bob: 3 , alice: 4 , john: 2 , jack: 3 } ) ).to.be( 'alice: 4, bob: 3, jack: 3, john: 2' ) ;
	} ) ;
	
	it( "format.count() should count the number of arguments found" , () => {
		expect( format.count( 'blah blih blah' ) ).to.be( 0 ) ;
		expect( format.count( 'blah blih %% blah' ) ).to.be( 0 ) ;
		expect( format.count( '%i %s' ) ).to.be( 2 ) ;
		expect( format.count( '%1i %1s' ) ).to.be( 1 ) ;
		expect( format.count( '%5i' ) ).to.be( 5 ) ;
		expect( format.count( '%[unexistant]F' ) ).to.be( 0 ) ;
		expect( format.count( '%[unexistant:%a%a]F' ) ).to.be( 2 ) ;
	} ) ;

	it( "format.hasFormatting() should return true if the string has formatting and thus need to be interpreted, or false otherwise" , () => {
		expect( format.hasFormatting( 'blah blih blah' ) ).to.be( false ) ;
		expect( format.hasFormatting( 'blah blih %% blah' ) ).to.be( true ) ;
		expect( format.hasFormatting( '%i %s' ) ).to.be( true ) ;
		expect( format.hasFormatting( '%[unexistant]F' ) ).to.be( true ) ;
		expect( format.hasFormatting( '%[unexistant:%a%a]F' ) ).to.be( true ) ;
	} ) ;

	it( "when using a filter object as the *this* context, the %[functionName]F format should use a custom function to format the input" , () => {
		var customFormat = string.createFormatter( {
			fn: {
				fixed: function() { return 'f' ; } ,
				double: function( str ) { return '' + str + str ; } ,
				fxy: function( a , b ) { return '' + ( a * a + b ) ; }
			}
		} ) ;

		expect( customFormat( '%[fixed]F' ) ).to.be( 'f' ) ;
		expect( customFormat( '%[fixed]F%s%s%s' , 'A' , 'B' , 'C' ) ).to.be( 'fABC' ) ;
		expect( customFormat( '%s%[fxy:%a%a]F' , 'f(x,y)=' , 5 , 3 ) ).to.be( 'f(x,y)=28' ) ;
		expect( customFormat( '%s%[fxy:%+1a%-1a]F' , 'f(x,y)=' , 5 , 3 ) ).to.be( 'f(x,y)=14' ) ;
		expect( customFormat( '%[unexistant]F' ) ).to.be( '' ) ;
	} ) ;

	it( "'^' should add markup, defaulting to ansi markup" , () => {
		expect( format( 'this is ^^ a caret' ) ).to.be( 'this is ^ a caret' ) ;
		expect( format( 'this is ^_underlined^: this is not' ) )
			.to.be( 'this is ' + ansi.underline + 'underlined' + ansi.reset + ' this is not' + ansi.reset ) ;
		expect( format( 'this is ^_underlined^ this is not' ) )
			.to.be( 'this is ' + ansi.underline + 'underlined' + ansi.reset + ' this is not' + ansi.reset ) ;
		expect( format( 'this is ^_underlined^:this is not' ) )
			.to.be( 'this is ' + ansi.underline + 'underlined' + ansi.reset + 'this is not' + ansi.reset ) ;
		expect( format( 'this is ^Bblue^: this is not' ) )
			.to.be( 'this is ' + ansi.brightBlue + 'blue' + ansi.reset + ' this is not' + ansi.reset ) ;
		expect( format( 'this is ^Bblue^ this is not' ) )
			.to.be( 'this is ' + ansi.brightBlue + 'blue' + ansi.reset + ' this is not' + ansi.reset ) ;
	} ) ;

	it( "'^' markups are ignored when then 'noMarkup' option is on" , () => {
		var customFormat = string.createFormatter( { noMarkup: true } ) ;

		expect( customFormat( 'this is ^^ a caret' ) ).to.be( 'this is ^^ a caret' ) ;
		expect( customFormat( 'this is ^_underlined' ) ).to.be( 'this is ^_underlined' ) ;
		expect( customFormat( 'this is ^_underlined^: nope' ) ).to.be( 'this is ^_underlined^: nope' ) ;
	} ) ;

	it( "'^' markup: shift feature" , () => {
		expect( format( 'this background is ^#^bblue^ this is ^wwhite' ) )
			.to.be( 'this background is ' + ansi.bgBlue + 'blue' + ansi.reset + ' this is ' + ansi.white + 'white' + ansi.reset ) ;
	} ) ;

	it( "should expose a stand-alone markup only method" , () => {
		expect( string.markup( 'this is ^^ a caret' ) ).to.be( 'this is ^ a caret' ) ;
		expect( string.markup( 'this is ^_underlined^: this is not' ) )
			.to.be( 'this is ' + ansi.underline + 'underlined' + ansi.reset + ' this is not' + ansi.reset ) ;
		expect( string.markup( 'this is ^_underlined^ this is not' ) )
			.to.be( 'this is ' + ansi.underline + 'underlined' + ansi.reset + ' this is not' + ansi.reset ) ;
		expect( string.markup( 'this is ^_underlined^:this is not' ) )
			.to.be( 'this is ' + ansi.underline + 'underlined' + ansi.reset + 'this is not' + ansi.reset ) ;
		expect( string.markup( 'this is ^Bblue^: this is not' ) )
			.to.be( 'this is ' + ansi.brightBlue + 'blue' + ansi.reset + ' this is not' + ansi.reset ) ;
		expect( string.markup( 'this is ^Bblue^ this is not' ) )
			.to.be( 'this is ' + ansi.brightBlue + 'blue' + ansi.reset + ' this is not' + ansi.reset ) ;

		// format syntax should be ignored
		expect( string.markup( 'this is ^Bblue^ this is not %d' , 5 ) )
			.to.be( 'this is ' + ansi.brightBlue + 'blue' + ansi.reset + ' this is not %d' + ansi.reset ) ;
	} ) ;

	it( "should expose a stand-alone markup only method" , () => {
		var wwwFormatter = {
			endingMarkupReset: true ,
			markupReset: function( markupStack ) {
				var str = '</span>'.repeat( markupStack.length ) ;
				markupStack.length = 0 ;
				return str ;
			} ,
			markup: {
				":": function( markupStack ) {
					var str = '</span>'.repeat( markupStack.length ) ;
					markupStack.length = 0 ;
					return str ;
				} ,
				" ": function( markupStack ) {
					var str = '</span>'.repeat( markupStack.length ) ;
					markupStack.length = 0 ;
					return str + ' ' ;
				} ,

				"+": '<span style="font-weight:bold">' ,
				"b": '<span style="color:blue">'
			}
		} ;

		var wwwMarkup = string.markupMethod.bind( wwwFormatter ) ;
		var wwwFormat = string.formatMethod.bind( wwwFormatter ) ;

		expect( wwwMarkup( 'this is ^^ a caret' ) ).to.be( 'this is ^ a caret' ) ;
		expect( wwwMarkup( 'this is ^+bold^: this is not' ) )
			.to.be( 'this is <span style="font-weight:bold">bold</span> this is not' ) ;
		expect( wwwMarkup( 'this is ^+bold^ this is not' ) )
			.to.be( 'this is <span style="font-weight:bold">bold</span> this is not' ) ;
		expect( wwwMarkup( 'this is ^+bold^:this is not' ) )
			.to.be( 'this is <span style="font-weight:bold">bold</span>this is not' ) ;
		expect( wwwMarkup( 'this is ^b^+blue bold' ) )
			.to.be( 'this is <span style="color:blue"><span style="font-weight:bold">blue bold</span></span>' ) ;

		expect( wwwFormat( 'this is ^b^+blue bold' ) )
			.to.be( 'this is <span style="color:blue"><span style="font-weight:bold">blue bold</span></span>' ) ;
	} ) ;
} ) ;



describe( "Escape collection" , () => {

	it( "escape.control() should escape control characters" , () => {
		expect( string.escape.control( 'Hello\n\t... world!' ) ).to.be( 'Hello\\n\\t... world!' ) ;
		expect( string.escape.control( 'Hello\\n\\t... world!' ) ).to.be( 'Hello\\n\\t... world!' ) ;
		expect( string.escape.control( 'Hello\\\n\\\t... world!' ) ).to.be( 'Hello\\\\n\\\\t... world!' ) ;
		expect( string.escape.control( 'Hello\\\\n\\\\t... world!' ) ).to.be( 'Hello\\\\n\\\\t... world!' ) ;

		expect( string.escape.control( 'Nasty\x00chars\x1bhere\x7f!' ) ).to.be( 'Nasty\\x00chars\\x1bhere\\x7f!' ) ;
		expect( string.escape.control( 'Nasty\n\x00chars\t\x1bhere\x7f!' ) ).to.be( 'Nasty\\n\\x00chars\\t\\x1bhere\\x7f!' ) ;

		expect( string.escape.control( 'Hello\n\t... world!' , true ) ).to.be( 'Hello\n\t... world!' ) ;
		expect( string.escape.control( 'Nasty\n\x00chars\t\x1bhere\x7f!' , true ) ).to.be( 'Nasty\n\\x00chars\t\\x1bhere\\x7f!' ) ;
	} ) ;

	it( "escape.shellArg() should escape a string so that it will be suitable as a shell command's argument" , () => {
		//console.log( 'Shell arg:' , string.escape.shellArg( "Here's my shell's argument" ) ) ;
		expect( string.escape.shellArg( "Here's my shell's argument" ) ).to.be( "'Here'\\''s my shell'\\''s argument'" ) ;
	} ) ;

	it( "escape.jsSingleQuote() should escape a string so that it will be suitable as a JS string code" , () => {
		expect( string.escape.jsSingleQuote( "A string with 'single' quotes" ) ).to.be( "A string with \\'single\\' quotes" ) ;
		expect( string.escape.jsSingleQuote( "A string with 'single' quotes\nand new\nlines" ) ).to.be( "A string with \\'single\\' quotes\\nand new\\nlines" ) ;
	} ) ;

	it( "escape.jsDoubleQuote() should escape a string so that it will be suitable as a JS string code" , () => {
		expect( string.escape.jsDoubleQuote( 'A string with "double" quotes' ) ).to.be( 'A string with \\"double\\" quotes' ) ;
		expect( string.escape.jsDoubleQuote( 'A string with "double" quotes\nand new\nlines' ) ).to.be( 'A string with \\"double\\" quotes\\nand new\\nlines' ) ;
	} ) ;

	it( "escape.regExp() should escape a string so that it will be suitable as a literal string into a regular expression pattern" , () => {
		//console.log( 'String in RegExp:' , string.escape.regExp( "(This) {is} [my] ^$tring^... +doesn't+ *it*? |yes| \\no\\ /maybe/" ) ) ;
		expect( string.escape.regExp( "(This) {is} [my] ^$tring^... +doesn't+ *it*? |yes| \\no\\ /maybe/" ) )
			.to.be( "\\(This\\) \\{is\\} \\[my\\] \\^\\$tring\\^\\.\\.\\. \\+doesn't\\+ \\*it\\*\\? \\|yes\\| \\\\no\\\\ \\/maybe\\/" ) ;
	} ) ;

	it( "escape.regExpReplacement() should escape a string so that it will be suitable as a literal string into a regular expression replacement" , () => {
		expect( string.escape.regExpReplacement( "$he love$ dollar$ $$$" ) ).to.be( "$$he love$$ dollar$$ $$$$$$" ) ;

		expect(
			'$he love$ dollar$ $$$'.replace(
				new RegExp( string.escape.regExp( '$' ) , 'g' ) ,
				string.escape.regExpReplacement( '$1' )
			)
		).to.be( "$1he love$1 dollar$1 $1$1$1" ) ;
	} ) ;

	it( "escape.html() should escape a string so that it will be suitable as HTML content" , () => {
		//console.log( string.escape.html( "<This> isn't \"R&D\"" ) ) ;
		expect( string.escape.html( "<This> isn't \"R&D\"" ) ).to.be( "&lt;This&gt; isn't \"R&amp;D\"" ) ;
	} ) ;

	it( "escape.htmlAttr() should escape a string so that it will be suitable as an HTML tag attribute's value" , () => {
		//console.log( string.escape.htmlAttr( "<This> isn't \"R&D\"" ) ) ;
		expect( string.escape.htmlAttr( "<This> isn't \"R&D\"" ) ).to.be( "&lt;This&gt; isn't &quot;R&amp;D&quot;" ) ;
	} ) ;

	it( "escape.htmlSpecialChars() should escape all HTML special characters" , () => {
		//console.log( string.escape.htmlSpecialChars( "<This> isn't \"R&D\"" ) ) ;
		expect( string.escape.htmlSpecialChars( "<This> isn't \"R&D\"" ) ).to.be( "&lt;This&gt; isn&#039;t &quot;R&amp;D&quot;" ) ;
	} ) ;

	it( "escape.unicodePercentEncoding() should escape all control chars and codepoint greater than 255 using percent encoding" , () => {
		expect( string.escape.unicodePercentEncode( "regular" ) ).to.be( "regular" ) ;
		expect( string.escape.unicodePercentEncode( "some «sp€¢ial»" ) ).to.be( "some «sp%E2%82%AC¢ial»" ) ;
		expect( string.escape.unicodePercentEncode( "percent % encoding" ) ).to.be( "percent %25 encoding" ) ;
		expect( string.escape.unicodePercentEncode( "\n\t\r" ) ).to.be( "%0A%09%0D" ) ;
	} ) ;

	it( "escape.httpHeaderValue()" , () => {
		expect( string.escape.httpHeaderValue( "regular" ) ).to.be( "regular" ) ;
		expect( string.escape.httpHeaderValue( "some «sp€¢ial»" ) ).to.be( "some «sp%E2%82%AC¢ial»" ) ;
		expect( string.escape.httpHeaderValue( "percent % encoding" ) ).to.be( "percent %25 encoding" ) ;
		expect( string.escape.httpHeaderValue( "\n\t\r" ) ).to.be( "%0A%09%0D" ) ;
	} ) ;
} ) ;



describe( "Camel case" , () => {

	it( ".toCamelCase() should transform a string composed of alphanum - minus - underscore to a camelCase string" , () => {
		expect( string.toCamelCase( 'one-two-three' ) ).to.be( 'oneTwoThree' ) ;
		expect( string.toCamelCase( 'one_two_three' ) ).to.be( 'oneTwoThree' ) ;
		expect( string.toCamelCase( 'OnE-tWo_tHree' ) ).to.be( 'oneTwoThree' ) ;
		expect( string.toCamelCase( 'ONE-TWO-THREE' ) ).to.be( 'oneTwoThree' ) ;
		expect( string.toCamelCase( 'a-b-c' ) ).to.be( 'aBC' ) ;
	} ) ;

	it( ".toCamelCase() with uppercase preservation on" , () => {
		expect( string.toCamelCase( 'one-two-three' , true ) ).to.be( 'oneTwoThree' ) ;
		expect( string.toCamelCase( 'one_two_three' , true ) ).to.be( 'oneTwoThree' ) ;
		expect( string.toCamelCase( 'OnE-tWo_tHree' , true ) ).to.be( 'OnETWoTHree' ) ;
		expect( string.toCamelCase( 'onE-TWo_tHree' , true ) ).to.be( 'onETWoTHree' ) ;
		expect( string.toCamelCase( 'ONE-TWO-THREE' , true ) ).to.be( 'ONETWOTHREE' ) ;
		expect( string.toCamelCase( 'a-b-c' , true ) ).to.be( 'aBC' ) ;
	} ) ;

	it( ".toCamelCase() edge cases" , () => {
		expect( string.toCamelCase( '' ) ).to.be( '' ) ;
		expect( string.toCamelCase() ).to.be( '' ) ;
		expect( string.toCamelCase( 'u' ) ).to.be( 'u' ) ;
		expect( string.toCamelCase( 'U' ) ).to.be( 'u' ) ;
		expect( string.toCamelCase( 'U-b' ) ).to.be( 'uB' ) ;
		expect( string.toCamelCase( 'U-' ) ).to.be( 'u' ) ;
		expect( string.toCamelCase( '-U' ) ).to.be( 'u' ) ;
	} ) ;

	it( ".camelCaseToDashed() should transform a string composed of alphanum - minus - underscore to a camelCase string" , () => {
		expect( string.camelCaseToDashed( 'oneTwoThree' ) ).to.be( 'one-two-three' ) ;
		expect( string.camelCaseToDashed( 'OneTwoThree' ) ).to.be( 'one-two-three' ) ;
		expect( string.camelCaseToDashed( 'aBC' ) ).to.be( 'a-b-c' ) ;
	} ) ;

	//it( ".camelCaseToDashed() edge cases" , function() {} ) ;
} ) ;



describe( "Latinize" , () => {

	it( ".latinize() should transform to regular latin letters without any accent" , () => {
		expect( string.latinize( 'éàèùâêîôûÂÊÎÔÛäëïöüÄËÏÖÜæÆŧøþßðđħł' ) )
			.to.be( 'eaeuaeiouAEIOUaeiouAEIOUaeAEtothssdhdhl' ) ;
	} ) ;
} ) ;



describe( "Wordwrap" , () => {

	it( ".wordwrap() should wrap words" , () => {
		expect( string.wordwrap( 'one two three four five six seven' , 10 ) ).to.be( 'one two\nthree four\nfive six\nseven' ) ;
		expect( string.wordwrap( 'one\ntwo three four five six seven' , 10 ) ).to.be( 'one\ntwo three\nfour five\nsix seven' ) ;
		expect( string.wordwrap( '   one\ntwo three four five six seven' , 10 ) ).to.be( '   one\ntwo three\nfour five\nsix seven' ) ;
		expect( string.wordwrap( '   one        \ntwo three four five six seven' , 10 ) ).to.be( '   one\ntwo three\nfour five\nsix seven' ) ;
		expect( string.wordwrap( '   one        \ntwo three four five six' , 10 ) ).to.be( '   one\ntwo three\nfour five\nsix' ) ;
		expect( string.wordwrap( '   one        \ntwo three four five six   ' , 10 ) ).to.be( '   one\ntwo three\nfour five\nsix   ' ) ;
	} ) ;

	it( ".wordwrap() should preserve explicit new lines" , () => {
		expect( string.wordwrap( 'one\ntwo three four five six' , 10 ) ).to.be( 'one\ntwo three\nfour five\nsix' ) ;
		expect( string.wordwrap( 'one\ntwo three four five six\n' , 10 ) ).to.be( 'one\ntwo three\nfour five\nsix\n' ) ;
		expect( string.wordwrap( 'one\ntwo three four five six\n\n' , 10 ) ).to.be( 'one\ntwo three\nfour five\nsix\n\n' ) ;
		expect( string.wordwrap( 'one\ntwo three four five six\n ' , 10 ) ).to.be( 'one\ntwo three\nfour five\nsix\n ' ) ;
	} ) ;

	it( ".wordwrap() should right-trim all lines except the last" , () => {
		expect( string.wordwrap( '   one        \ntwo three four five six' , 10 ) ).to.be( '   one\ntwo three\nfour five\nsix' ) ;
		expect( string.wordwrap( '   one        \ntwo three four five six ' , 10 ) ).to.be( '   one\ntwo three\nfour five\nsix ' ) ;
		expect( string.wordwrap( '   one        \ntwo three four five six   ' , 10 ) ).to.be( '   one\ntwo three\nfour five\nsix   ' ) ;
		expect( string.wordwrap( '   one        \ntwo three four five six\n' , 10 ) ).to.be( '   one\ntwo three\nfour five\nsix\n' ) ;
		expect( string.wordwrap( '   one        \ntwo three four five six\n ' , 10 ) ).to.be( '   one\ntwo three\nfour five\nsix\n ' ) ;
		expect( string.wordwrap( '   one        \ntwo three four five six \n' , 10 ) ).to.be( '   one\ntwo three\nfour five\nsix\n' ) ;
		expect( string.wordwrap( '   one        \ntwo three four five six\n\n' , 10 ) ).to.be( '   one\ntwo three\nfour five\nsix\n\n' ) ;
		expect( string.wordwrap( '   one        \ntwo three! four five! six \n' , 10 ) ).to.be( '   one\ntwo three!\nfour five!\nsix\n' ) ;
	} ) ;

	it( ".wordwrap() should preserve space before breaking-lines" , () => {
		expect( string.wordwrap( '   one        \ntwo three four five six \n' , { width: 10 , noTrim: true } ) ).to.be( '   one    \ntwo three\nfour five\nsix \n' ) ;
		expect( string.wordwrap( '   one        \ntwo three! four five! six \n' , { width: 10 , noTrim: true } ) ).to.be( '   one    \ntwo three!\nfour five!\nsix \n' ) ;
	} ) ;

	it( ".wordwrap() and the 'fill' option" , () => {
		expect( string.wordwrap( '   one        \ntwo three four five six \n' , { width: 10 , fill: true } ) ).to.be( '   one    \ntwo three \nfour five \nsix       \n' ) ;
		expect( string.wordwrap( '   one        \ntwo three four five six' , { width: 10 , fill: true } ) ).to.be( '   one    \ntwo three \nfour five \nsix' ) ;
		expect( string.wordwrap( '   one\ntwo three four five six' , { width: 10 , fill: true } ) ).to.be( '   one    \ntwo three \nfour five \nsix' ) ;
		expect( string.wordwrap( '   one\ntwo three four five six' , { width: 10 , fill: true } ) ).to.be( '   one    \ntwo three \nfour five \nsix' ) ;
		expect( string.wordwrap( 'onetwo three four five six' , { width: 10 , fill: true } ) ).to.be( 'onetwo    \nthree four\nfive six' ) ;
	} ) ;

	it( ".wordwrap() and the 'offset' option" , () => {
		expect( string.wordwrap( 'one two three four five six seven' , { width: 10 , offset: 5 } ) ).to.be( 'one\ntwo three\nfour five\nsix seven' ) ;
	} ) ;

	it( ".wordwrap() and the 'offset' and 'updateOffset' options" , () => {
		var column = { width: 10 , offset: 5 , updateOffset: true } ;
		expect( string.wordwrap( 'one two three four five six seven' , column ) ).to.be( 'one\ntwo three\nfour five\nsix seven' ) ;
		expect( column.offset ).to.be( 9 ) ;
	} ) ;

	it( ".wordwrap() and the 'glue' option" , () => {
		expect( string.wordwrap( 'one two three four five six seven' , { width: 10 , glue: '<br />\n' } ) ).to.be( 'one two<br />\nthree four<br />\nfive six<br />\nseven' ) ;
	} ) ;

	it( ".wordwrap() and the 'noJoin' option" , () => {
		expect( string.wordwrap( 'one two three four five six seven' , { width: 10 , noJoin: true } ) ).to.equal( [ 'one two' , 'three four' , 'five six' , 'seven' ] ) ;
	} ) ;

	it( ".wordwrap() and surrogate pairs" , () => {
		expect( string.wordwrap( '𝌆𝌆𝌆 𝌆𝌆𝌆 𝌆𝌆𝌆𝌆𝌆 𝌆𝌆𝌆𝌆 𝌆𝌆𝌆𝌆 𝌆𝌆𝌆 𝌆𝌆𝌆𝌆𝌆' , 9 ) ).to.be( '𝌆𝌆𝌆 𝌆𝌆𝌆\n𝌆𝌆𝌆𝌆𝌆\n𝌆𝌆𝌆𝌆 𝌆𝌆𝌆𝌆\n𝌆𝌆𝌆 𝌆𝌆𝌆𝌆𝌆' ) ;
	} ) ;

	it( ".wordwrap() and fullwidth chars" , () => {
		expect( string.wordwrap( '備備 備備備 備備備備 備備' , 10 ) ).to.be( '備備\n備備備\n備備備備\n備備' ) ;
		expect( string.wordwrap( '備備 備備 備 備備備備 備備' , 10 ) ).to.be( '備備 備備\n備\n備備備備\n備備' ) ;
		expect( string.wordwrap( '備備 備備 備 備 備 備備 備備備' , 10 ) ).to.be( '備備 備備\n備 備 備\n備備\n備備備' ) ;
	} ) ;

	it( ".wordwrap() and french typography rules with '!', '?', ':' and ';'" , () => {
		expect( string.wordwrap( 'un ! deux ? trois : quatre ; cinq !' , 10 ) ).to.be( 'un !\ndeux ?\ntrois :\nquatre ;\ncinq !' ) ;
	} ) ;
} ) ;



describe( "inspect()" , () => {

	it( "should inspect a variable with default options accordingly" , () => {
		var MyClass = function MyClass() {
			this.variable = 1 ;
		} ;

		MyClass.prototype.report = function report() { console.log( 'Variable value:' , this.variable ) ; } ;
		MyClass.staticFunc = function staticFunc() { console.log( 'Static function.' ) ; } ;

		var sparseArray = [] ;
		sparseArray[ 3 ] = 'three' ;
		sparseArray[ 10 ] = 'ten' ;
		sparseArray[ 20 ] = 'twenty' ;
		sparseArray.customProperty = 'customProperty' ;

		var object = {
			a: 'A' ,
			b: 2 ,
			str: 'Woot\nWoot\rWoot\tWoot' ,
			sub: {
				u: undefined ,
				n: null ,
				t: true ,
				f: false
			} ,
			emptyString: '' ,
			emptyObject: {} ,
			list: [ 'one' , 'two' , 'three' ] ,
			emptyList: [] ,
			sparseArray: sparseArray ,
			hello: function hello() { console.log( 'Hello!' ) ; } ,
			anonymous: function() { console.log( 'anonymous...' ) ; } ,
			class: MyClass ,
			instance: new MyClass() ,
			buf: Buffer.from( 'This is a buffer!' )
		} ;

		object.sub.circular = object ;

		Object.defineProperties( object , {
			c: { value: '3' } ,
			d: {
				get: function() { throw new Error( 'Should not be called by the test' ) ; } ,
				set: function( value ) {}
			}
		} ) ;

		//console.log( '>>>>>' , string.escape.control( string.inspect( object ) ) ) ;
		//console.log( string.inspect( { style: 'color' } , object ) ) ;
		var actual = string.inspect( object ) ;
		var expected = '<Object> <object> {\n    a: "A" <string>(1)\n    b: 2 <number>\n    str: "Woot\\nWoot\\rWoot\\tWoot" <string>(19)\n    sub: <Object> <object> {\n        u: undefined\n        n: null\n        t: true\n        f: false\n        circular: <Object> <object> [circular]\n    }\n    emptyString: "" <string>(0)\n    emptyObject: <Object> <object> {}\n    list: <Array>(3) <object> [\n        [0] "one" <string>(3)\n        [1] "two" <string>(3)\n        [2] "three" <string>(5)\n        length: 3 <number> <-conf -enum>\n    ]\n    emptyList: <Array>(0) <object> [\n        length: 0 <number> <-conf -enum>\n    ]\n    sparseArray: <Array>(21) <object> [\n        [3] "three" <string>(5)\n        [10] "ten" <string>(3)\n        [20] "twenty" <string>(6)\n        length: 21 <number> <-conf -enum>\n        customProperty: "customProperty" <string>(14)\n    ]\n    hello: <Function> hello(0) <function>\n    anonymous: <Function> anonymous(0) <function>\n    class: <Function> MyClass(0) <function>\n    instance: <MyClass> <object> {\n        variable: 1 <number>\n    }\n    buf: <Buffer 54 68 69 73 20 69 73 20 61 20 62 75 66 66 65 72 21> <Buffer>(17)\n    c: "3" <string>(1) <-conf -enum -w>\n    d: <getter/setter> {\n        get: <Function> get(0) <function>\n        set: <Function> set(1) <function>\n    }\n}\n' ;
		//console.log( '\n' + expected + '\n\n' + actual + '\n\n' ) ;
		expect( actual ).to.be( expected ) ;
		//console.log( string.inspect( { style: 'color' } , object ) ) ;
	} ) ;

	it( "should pass the Array circular references bug" , () => {
		var array = [ [ 1 ] ] ;
		expect( string.inspect( array ) ).to.be( '<Array>(1) <object> [\n    [0] <Array>(1) <object> [\n        [0] 1 <number>\n        length: 1 <number> <-conf -enum>\n    ]\n    length: 1 <number> <-conf -enum>\n]\n' ) ;
	} ) ;

	it( "should inspect object with no constructor" , () => {
		expect( string.inspect( Object.assign( Object.create( null ) , { a: 1 , b: 2 } ) ) ).to.be( '<(no constructor)> <object> {\n    a: 1 <number>\n    b: 2 <number>\n}\n' ) ;
	} ) ;

	it( "should use target-specified's object substitution (.inspect method) when the option 'useInspect' is set" , () => {
		function Obj() {
			this.name = 'bob' ;
		}

		Obj.prototype.inspect = function() { return '<' + this.name + '>' ; } ;

		expect( string.inspect( { useInspect: true } , new Obj() ) ).to.be( '<Obj> <object> => <bob>\n' ) ;
	} ) ;

	it( "should use target-specified's blacklist (.inspectPropertyBlackList is a Set) when the option 'useInspectPropertyBlackList' is set" , () => {
		function Obj() {
			this.name = 'bob' ;
			this.app = {} ;
		}

		Obj.prototype.inspectPropertyBlackList = new Set( [ 'app' ] ) ;

		expect( string.inspect( { useInspectPropertyBlackList: true } , new Obj() ) ).to.be( '<Obj> <object> {\n    name: "bob" <string>(3)\n}\n' ) ;
	} ) ;

	it( "special objects tests (ES6 Set & Map, MongoDB ObjectID)" ) ;
} ) ;



describe( "Title case" , () => {

	it( "Basic .toTitleCase() usages" , () => {
		expect( string.toTitleCase( 'bob bill booo électron hétérogénéité ALLCAPS McDowell jean-michel' ) )
			.to.be( 'Bob Bill Booo Électron Hétérogénéité ALLCAPS McDowell Jean-Michel' ) ;
		expect( string.toTitleCase( 'bob bill booo électron hétérogénéité ALLCAPS McDowell jean-michel' , { zealous: true } ) )
			.to.be( 'Bob Bill Booo Électron Hétérogénéité Allcaps Mcdowell Jean-Michel' ) ;
		expect( string.toTitleCase( 'bob bill booo électron hétérogénéité ALLCAPS McDowell jean-michel' , { zealous: true , preserveAllCaps: true } ) )
			.to.be( 'Bob Bill Booo Électron Hétérogénéité ALLCAPS Mcdowell Jean-Michel' ) ;
	} ) ;
} ) ;



describe( "Fuzzy string matching" , () => {

	const continents = [ 'africa' , 'america' , 'australia' , 'asia' , 'europe' ] ;
	
	const things = [
		'the elven sword' ,
		'a jewel-encrusted egg' ,
		'a brass lantern' ,
		'a bag' ,
		'a lunch' ,
		'a rope' ,
		'a knife' ,
		'a throwing knife' ,
		'a bottle of water' ,
		'a rattle' ,
		'a helm' ,
		'a crossbow' ,
		'a bolt'
	] ;
	
	it( "Levenshtein" , () => {
		expect( string.fuzzy.levenshtein( 'amrica' , 'africa' ) ).to.be( 1 ) ;
		expect( string.fuzzy.levenshtein( 'america' , 'amrica' ) ).to.be( 1 ) ;
		expect( string.fuzzy.levenshtein( 'america' , 'armorica' ) ).to.be( 2 ) ;
		expect( string.fuzzy.levenshtein( 'america' , 'amierca' ) ).to.be( 2 ) ;
		expect( string.fuzzy.levenshtein( 'bottle' , 'rattle' ) ).to.be( 2 ) ;

		expect( string.fuzzy.levenshtein( 'america' , 'america' ) ).to.be( 0 ) ;
		expect( string.fuzzy.levenshtein( 'america' , '' ) ).to.be( 7 ) ;
		expect( string.fuzzy.levenshtein( '' , 'america' ) ).to.be( 7 ) ;
		expect( string.fuzzy.levenshtein( '' , '' ) ).to.be( 0 ) ;
	} ) ;

	it( "Score" , () => {
		expect( string.fuzzy.score( 'armorica' , 'america' ) ).to.be.around( 5 / 7 ) ;
		expect( string.fuzzy.score( 'amrica' , 'africa' ) ).to.be.around( 5 / 6 ) ;
		expect( string.fuzzy.score( 'amrica' , 'america' ) ).to.be.around( 6 / 7 ) ;
		expect( string.fuzzy.score( 'amierca' , 'america' ) ).to.be.around( 5 / 7 ) ;
		expect( string.fuzzy.score( 'austia' , 'australia' ) ).to.be.around( 6 / 9 ) ;
		expect( string.fuzzy.score( 'austia' , 'asia' ) ).to.be.around( 2 / 4 ) ;
		expect( string.fuzzy.score( 'random' , 'australia' ) ).to.be.around( 1 / 9 ) ;
		expect( string.fuzzy.score( 'random' , 'africa' ) ).to.be.around( 0 ) ;
		expect( string.fuzzy.score( 'walter' , 'a bottle of water' ) ).to.be.around( 4 / 17 ) ;
		expect( string.fuzzy.score( 'walter' , 'a brass lantern' ) ).to.be.around( 5 / 15 ) ;
		expect( string.fuzzy.score( 'bottle' , 'a bottle of water' ) ).to.be.around( 6 / 17 ) ;
		expect( string.fuzzy.score( 'rattle' , 'a bottle of water' ) ).to.be.around( 4 / 17 ) ;
		expect( string.fuzzy.score( 'rottle' , 'bottle' ) ).to.be.around( 5 / 6 ) ;
		expect( string.fuzzy.score( 'battle' , 'bottle' ) ).to.be.around( 5 / 6 ) ;
		expect( string.fuzzy.score( 'lunctern' , 'a brass lantern' ) ).to.be.around( 5 / 15 ) ;
		expect( string.fuzzy.score( 'lunctern' , 'lantern' ) ).to.be.around( 5 / 7 ) ;
		
		expect( string.fuzzy.score( 'america' , 'america' ) ).to.be.around( 1 ) ;
		expect( string.fuzzy.score( 'america' , '' ) ).to.be.around( 0 ) ;
		expect( string.fuzzy.score( '' , 'america' ) ).to.be.around( 0 ) ;
		expect( string.fuzzy.score( '' , '' ) ).to.be.around( 1 ) ;
	} ) ;

	it( "Best match" , () => {
		expect( string.fuzzy.bestMatch( 'arica' , continents ) ).to.be( 'africa' ) ;
		expect( string.fuzzy.bestMatch( 'amrica' , continents ) ).to.be( 'america' ) ;
		expect( string.fuzzy.bestMatch( 'armorica' , continents ) ).to.be( 'america' ) ;
		expect( string.fuzzy.bestMatch( 'armrica' , continents ) ).to.be( 'america' ) ;
		expect( string.fuzzy.bestMatch( 'austrica' , continents ) ).to.be( 'australia' ) ;
		expect( string.fuzzy.bestMatch( 'ausia' , continents ) ).to.be( 'asia' ) ;
		expect( string.fuzzy.bestMatch( 'austia' , continents ) ).to.be( 'australia' ) ;
		expect( string.fuzzy.bestMatch( 'astia' , continents ) ).to.be( 'asia' ) ;
		expect( string.fuzzy.bestMatch( 'random' , continents ) ).to.be( 'australia' ) ;

		expect( string.fuzzy.bestMatch( 'sword' , things ) ).to.be( 'the elven sword' ) ;
		expect( string.fuzzy.bestMatch( 'word' , things ) ).to.be( 'the elven sword' ) ;
		expect( string.fuzzy.bestMatch( 'lantern' , things ) ).to.be( 'a brass lantern' ) ;
		expect( string.fuzzy.bestMatch( 'luntern' , things ) ).to.be( 'a brass lantern' ) ;
		expect( string.fuzzy.bestMatch( 'lunctern' , things ) ).to.be( 'a brass lantern' ) ;
		expect( string.fuzzy.bestMatch( 'luncten' , things ) ).to.be( 'a lunch' ) ;
		//expect( string.fuzzy.bestMatch( 'bottle' , things ) ).to.be( 'a bottle of water' ) ;
		expect( string.fuzzy.bestMatch( 'bottle' , things ) ).to.be( 'a rattle' ) ;
		expect( string.fuzzy.bestMatch( 'water' , things ) ).to.be( 'a bottle of water' ) ;
		expect( string.fuzzy.bestMatch( 'walter' , things ) ).to.be( 'a brass lantern' ) ;

		expect( string.fuzzy.bestMatch( 'knife' , things ) ).to.be( 'a knife' ) ;

		// Using indexOf option
		expect( string.fuzzy.bestMatch( 'sword' , things , { indexOf: true } ) ).to.be( 0 ) ;
		expect( string.fuzzy.bestMatch( 'lunctern' , things , { indexOf: true } ) ).to.be( 2 ) ;
		expect( string.fuzzy.bestMatch( 'bottle' , things , { indexOf: true } ) ).to.be( 9 ) ;
	} ) ;

	it( "Best match with scoreLimit" , () => {
		expect( string.fuzzy.bestMatch( 'lunctern' , things ) ).to.be( 'a brass lantern' ) ;
		expect( string.fuzzy.bestMatch( 'lunctern' , things , { scoreLimit: 0.3 } ) ).to.be( 'a brass lantern' ) ;
		expect( string.fuzzy.bestMatch( 'lunctern' , things , { scoreLimit: 0.4 } ) ).to.be( null ) ;
		
		expect( string.fuzzy.bestMatch( 'armrica' , continents ) ).to.be( 'america' ) ;
		expect( string.fuzzy.bestMatch( 'armrica' , continents , { scoreLimit: 0.7 } ) ).to.be( 'america' ) ;
		expect( string.fuzzy.bestMatch( 'armrica' , continents , { scoreLimit: 0.8 } ) ).to.be( null ) ;

		expect( string.fuzzy.bestMatch( 'amierca' , continents ) ).to.be( 'america' ) ;
		expect( string.fuzzy.bestMatch( 'amierca' , continents , { scoreLimit: 0.7 } ) ).to.be( 'america' ) ;
		expect( string.fuzzy.bestMatch( 'amierca' , continents , { scoreLimit: 0.8 } ) ).to.be( null ) ;

		// Using indexOf option
		expect( string.fuzzy.bestMatch( 'lunctern' , things , { scoreLimit: 0.4 , indexOf: true } ) ).to.be( -1 ) ;
		expect( string.fuzzy.bestMatch( 'armrica' , continents , { scoreLimit: 0.7 , indexOf: true } ) ).to.be( 1 ) ;
	} ) ;

	it( "Best token match" , () => {
		expect( string.fuzzy.bestTokenMatch( 'sword' , things ) ).to.be( 'the elven sword' ) ;
		expect( string.fuzzy.bestTokenMatch( 'word' , things ) ).to.be( 'the elven sword' ) ;
		expect( string.fuzzy.bestTokenMatch( 'lantern' , things ) ).to.be( 'a brass lantern' ) ;
		expect( string.fuzzy.bestTokenMatch( 'luntern' , things ) ).to.be( 'a brass lantern' ) ;
		expect( string.fuzzy.bestTokenMatch( 'lunctern' , things ) ).to.be( 'a brass lantern' ) ;
		expect( string.fuzzy.bestTokenMatch( 'luncten' , things ) ).to.be( 'a brass lantern' ) ;
		expect( string.fuzzy.bestTokenMatch( 'bottle' , things ) ).to.be( 'a bottle of water' ) ;
		expect( string.fuzzy.bestTokenMatch( 'water' , things ) ).to.be( 'a bottle of water' ) ;
		expect( string.fuzzy.bestTokenMatch( 'walter' , things ) ).to.be( 'a bottle of water' ) ;
		expect( string.fuzzy.bestTokenMatch( 'a walter' , things ) ).to.be( 'a bottle of water' ) ;
		expect( string.fuzzy.bestTokenMatch( 'some walter' , things ) ).to.be( 'a bottle of water' ) ;

		expect( string.fuzzy.bestTokenMatch( 'knife' , things ) ).to.be( 'a knife' ) ;
		expect( string.fuzzy.bestTokenMatch( 'throwing knife' , things ) ).to.be( 'a throwing knife' ) ;
		expect( string.fuzzy.bestTokenMatch( 'throwing' , things ) ).to.be( 'a throwing knife' ) ;

		// Using indexOf option
		expect( string.fuzzy.bestTokenMatch( 'some walter' , things , { indexOf: true } ) ).to.be( 8 ) ;
	} ) ;

	it( "Best token match with scoreLimit" , () => {
		expect( string.fuzzy.bestTokenMatch( 'lunctern' , things ) ).to.be( 'a brass lantern' ) ;
		expect( string.fuzzy.bestTokenMatch( 'lunctern' , things , { scoreLimit: 0.6 } ) ).to.be( 'a brass lantern' ) ;
		expect( string.fuzzy.bestTokenMatch( 'lunctern' , things , { scoreLimit: 0.7 } ) ).to.be( null ) ;

		expect( string.fuzzy.bestTokenMatch( 'walter' , things ) ).to.be( 'a bottle of water' ) ;
		expect( string.fuzzy.bestTokenMatch( 'walter' , things , { scoreLimit: 0.7 } ) ).to.be( 'a bottle of water' ) ;
		expect( string.fuzzy.bestTokenMatch( 'walter' , things , { scoreLimit: 0.8 } ) ).to.be( null ) ;

		// Using indexOf option
		expect( string.fuzzy.bestTokenMatch( 'walter' , things , { scoreLimit: 0.7 , indexOf: true } ) ).to.be( 8 ) ;
		expect( string.fuzzy.bestTokenMatch( 'walter' , things , { scoreLimit: 0.8 , indexOf: true } ) ).to.be( -1 ) ;
	} ) ;

	it( "Top match" , () => {
		expect( string.fuzzy.topMatch( 'arica' , continents ) ).to.equal( [ 'africa' ] ) ;
		expect( string.fuzzy.topMatch( 'amrica' , continents ) ).to.equal( [ 'america' , 'africa' ] ) ;
		expect( string.fuzzy.topMatch( 'armorica' , continents ) ).to.equal( [ 'america' ] ) ;
		expect( string.fuzzy.topMatch( 'armrica' , continents ) ).to.equal( [ 'america' , 'africa' ] ) ;
		expect( string.fuzzy.topMatch( 'austrica' , continents ) ).to.equal( [ 'australia' ] ) ;
		expect( string.fuzzy.topMatch( 'ausia' , continents ) ).to.equal( [ 'asia' ] ) ;
		expect( string.fuzzy.topMatch( 'austia' , continents ) ).to.equal( [ 'australia' ] ) ;
		expect( string.fuzzy.topMatch( 'astia' , continents ) ).to.equal( [ 'asia' ] ) ;
		expect( string.fuzzy.topMatch( 'random' , continents ) ).to.equal( [ 'australia' ] ) ;

		expect( string.fuzzy.topMatch( 'sword' , things ) ).to.equal( [ 'the elven sword' ] ) ;
		expect( string.fuzzy.topMatch( 'word' , things ) ).to.equal( [ 'the elven sword' ] ) ;
		expect( string.fuzzy.topMatch( 'lantern' , things ) ).to.equal( [ 'a brass lantern' ] ) ;
		expect( string.fuzzy.topMatch( 'luntern' , things ) ).to.equal( [ 'a brass lantern' ] ) ;
		expect( string.fuzzy.topMatch( 'lunctern' , things ) ).to.equal( [ 'a brass lantern' ] ) ;
		expect( string.fuzzy.topMatch( 'luncten' , things ) ).to.equal( [ 'a lunch' , 'a brass lantern' ] ) ;
		//expect( string.fuzzy.topMatch( 'bottle' , things ) ).to.equal( [ 'a bottle of water' ] ) ;
		expect( string.fuzzy.topMatch( 'bottle' , things ) ).to.equal( [ 'a rattle' ] ) ;
		expect( string.fuzzy.topMatch( 'water' , things ) ).to.equal( [ 'a bottle of water' , 'a brass lantern' ] ) ;
		expect( string.fuzzy.topMatch( 'walter' , things ) ).to.equal( [ 'a brass lantern' ] ) ;

		expect( string.fuzzy.topMatch( 'knife' , things ) ).to.equal( [ 'a knife' ] ) ;

		// Using indexOf option
		expect( string.fuzzy.topMatch( 'water' , things , { indexOf: true } ) ).to.equal( [ 8 , 2 ] ) ;
	} ) ;

	it( "Top token match" , () => {
		expect( string.fuzzy.topTokenMatch( 'sword' , things ) ).to.equal( [ 'the elven sword' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'word' , things ) ).to.equal( [ 'the elven sword' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'lantern' , things ) ).to.equal( [ 'a brass lantern' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'luntern' , things ) ).to.equal( [ 'a brass lantern' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'lunctern' , things ) ).to.equal( [ 'a brass lantern' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'luncten' , things ) ).to.equal( [ 'a brass lantern' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'bottle' , things ) ).to.equal( [ 'a bottle of water' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'rattle' , things ) ).to.equal( [ 'a rattle' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'rottle' , things ) ).to.equal( [ 'a rattle' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'cottle' , things ) ).to.equal( [ 'a bottle of water' , 'a rattle' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'cattle' , things ) ).to.equal( [ 'a rattle' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'water' , things ) ).to.equal( [ 'a bottle of water' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'walter' , things ) ).to.equal( [ 'a bottle of water' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'a walter' , things ) ).to.equal( [ 'a bottle of water' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'some walter' , things ) ).to.equal( [ 'a bottle of water' ] ) ;

		expect( string.fuzzy.topTokenMatch( 'knife' , things ) ).to.equal( [ 'a knife' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'throwing knife' , things ) ).to.equal( [ 'a throwing knife' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'throwing' , things ) ).to.equal( [ 'a throwing knife' ] ) ;

		// Using indexOf option
		expect( string.fuzzy.topTokenMatch( 'cottle' , things , { indexOf: true } ) ).to.equal( [ 8 , 9 ] ) ;
	} ) ;

	it( "Top token match with deltaRate" , () => {
		expect( string.fuzzy.topTokenMatch( 'knife' , things ) ).to.equal( [ 'a knife' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'knife' , things , { deltaRate: 0.9 } ) ).to.equal( [ 'a knife' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'knife' , things , { deltaRate: 0.8 } ) ).to.equal( [ 'a knife' , 'a throwing knife' ] ) ;

		expect( string.fuzzy.topTokenMatch( 'throwing knife' , things ) ).to.equal( [ 'a throwing knife' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'throwing knife' , things , { deltaRate: 0.6 } ) ).to.equal( [ 'a throwing knife' ] ) ;
		expect( string.fuzzy.topTokenMatch( 'throwing knife' , things , { deltaRate: 0.4 } ) ).to.equal( [ 'a throwing knife' , 'a knife' ] ) ;

		// Using indexOf option
		expect( string.fuzzy.topTokenMatch( 'throwing knife' , things , { deltaRate: 0.4 , indexOf: true } ) ).to.equal( [ 7 , 6 ] ) ;
	} ) ;
} ) ;



describe( "Natural sort" , () => {

	it( "basic natural sort tests" , () => {
		expect( [ 'one' , 'two' , 'three' ].sort( string.naturalSort ) ).to.equal( [ 'one' , 'three' , 'two' ] ) ;
		
		// Case insensitive
		expect( [ 'one' , 'two' , 'Three' ].sort( string.naturalSort ) ).to.equal( [ 'one' , 'Three' , 'two' ] ) ;
		expect( [ 'One' , 'Two' , 'three' ].sort( string.naturalSort ) ).to.equal( [ 'One' , 'three' , 'Two' ] ) ;
		
		// Uppercase first as a tie-breaker
		expect( [ 'one' , 'One' , 'two' , 'Two' , 'Three' , 'three' ].sort( string.naturalSort ) ).to.equal( [ 'One' , 'one' , 'Three' , 'three' , 'Two' , 'two' ] ) ;
		
		// Lesser number first
		expect( [ 'abc121' , 'abc17' , 'abc12' , 'abc134' ].sort( string.naturalSort ) ).to.equal( [ 'abc12' , 'abc17' , 'abc121' , 'abc134' ] ) ;
		
		// White space / word separator insensitive
		expect( [ '  One  ' , '   Two   ' , 'three' ].sort( string.naturalSort ) ).to.equal( [ '  One  ' , 'three' , '   Two   ' ] ) ;
		expect( [ 'abc   121' , 'abc 17' , 'abc  12' , 'abc    134' ].sort( string.naturalSort ) ).to.equal( [ 'abc  12' , 'abc 17' , 'abc   121' , 'abc    134' ] ) ;
		expect( [ 'a-123-a' , 'a_12_a' , 'a 18 a' ].sort( string.naturalSort ) ).to.equal( [ 'a_12_a' , 'a 18 a' , 'a-123-a' ] ) ;
		expect( [ 'a_123_a' , 'a-12-a' , 'a 18 a' ].sort( string.naturalSort ) ).to.equal( [ 'a-12-a' , 'a 18 a' , 'a_123_a' ] ) ;
		
		// Number with shorter char-width as a tie-breaker
		expect( [ 'abc00012' , 'abc012' , 'abc017' , 'abc12' , 'abc134' ].sort( string.naturalSort ) ).to.equal( [ 'abc12' , 'abc012' , 'abc00012' , 'abc017' , 'abc134' ] ) ;
		
		// Symbols
		expect( [ ';+$' , '!:;,' , '“”' ].sort( string.naturalSort ) ).to.equal( [ "!:;," , ";+$" , "“”" ] ) ;
	} ) ;
} ) ;



describe( "Misc" , () => {

	it( ".resize()" , () => {
		expect( string.resize( 'bobby' , 3 ) ).to.be( 'bob' ) ;
		expect( string.resize( 'bobby' , 5 ) ).to.be( 'bobby' ) ;
		expect( string.resize( 'bobby' , 8 ) ).to.be( 'bobby   ' ) ;
	} ) ;

	it( ".occurrenceCount()" , () => {
		expect( string.occurrenceCount( '' , '' ) ).to.be( 0 ) ;
		expect( string.occurrenceCount( 'three' , '' ) ).to.be( 0 ) ;
		expect( string.occurrenceCount( '' , 'o' ) ).to.be( 0 ) ;
		expect( string.occurrenceCount( '' , 'omg' ) ).to.be( 0 ) ;
		expect( string.occurrenceCount( 'three' , 'o' ) ).to.be( 0 ) ;
		expect( string.occurrenceCount( 'o' , 'o' ) ).to.be( 1 ) ;
		expect( string.occurrenceCount( 'ooo' , 'o' ) ).to.be( 3 ) ;
		expect( string.occurrenceCount( 'ooo' , 'oo' ) ).to.be( 1 ) ;
		expect( string.occurrenceCount( 'aooo' , 'oo' ) ).to.be( 1 ) ;
		expect( string.occurrenceCount( 'aoooo' , 'oo' ) ).to.be( 2 ) ;
		expect( string.occurrenceCount( 'one two three four' , 'o' ) ).to.be( 3 ) ;
		expect( string.occurrenceCount( 'one one one' , 'one' ) ).to.be( 3 ) ;
		expect( string.occurrenceCount( 'oneoneone' , 'one' ) ).to.be( 3 ) ;
		expect( string.occurrenceCount( 'oneoneone' , 'oneone' ) ).to.be( 1 ) ;
	} ) ;

	it( ".occurrenceCount() with overlap" , () => {
		expect( string.occurrenceCount( 'ooo' , 'oo' , true ) ).to.be( 2 ) ;
		expect( string.occurrenceCount( 'aooo' , 'oo' , true ) ).to.be( 2 ) ;
		expect( string.occurrenceCount( 'oneoneone' , 'oneone' , true ) ).to.be( 2 ) ;
	} ) ;
} ) ;

