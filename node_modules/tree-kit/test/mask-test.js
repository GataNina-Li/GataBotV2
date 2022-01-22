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





			/* Helper functions */



// The input tree used in most tests

function Func() { console.log( 'Hellow!' ) ; }
Func.prototype.fn1 = function fn1() { console.log( 'fn1' ) ; } ;
Func.prototype.fn2 = function fn2() { console.log( 'fn2' ) ; } ;
Func.prop = 'property' ;



var input = {
	'undefined' : undefined ,
	'null' : null ,
	'bool' : true ,
	'true' : true ,
	'false' : false ,
	int : 12 ,
	float : 2.47 ,
	string : 'Oh my god' ,
	scalar : "42" ,
	email : 'toto@example.com' ,
	array : [ 1 , 2 , 3 ] ,
	object : {} ,
	range : 47 ,
	color : 'blue' ,
	note : 'sol' ,
	size : 37 ,
	useless : 'useless' ,
	attachement : {
		filename : 'preview.png' ,
		md5 : 'a20f6c76483c9702ee8f29ed42972417'
	} ,
	files: {
		'background.png' : {
			size : '97856' ,
			md5 : 'ddc349bd71d7bc5411471cb427a8a2f5'
		} ,
		'header.png' : {
			size : '44193' ,
			md5 : '6bf8104c8bcdb502fdba01dde5bada6a'
		} ,
		'footer.png' : {
			size : '36411' ,
			md5 : '69f82995d2fb6ae540fff4caa725b6b7'
		}
	} ,
	filesArray: [
		{
			name : 'background.png' ,
			size : '97856' ,
			md5 : 'ddc349bd71d7bc5411471cb427a8a2f5'
		} ,
		{
			name : 'header.png' ,
			size : '44193' ,
			md5 : '6bf8104c8bcdb502fdba01dde5bada6a'
		} ,
		{
			name : 'footer.png' ,
			size : '36411' ,
			md5 : '69f82995d2fb6ae540fff4caa725b6b7'
		}
	] ,
	subtree : {
		a : 'A' ,
		b : 2 ,
		subtree: {
			d : 4 ,
			e : undefined ,
			f : 3.14
		} ,
		c : 'plusplus' ,
		subtree2: {
			g : 6 ,
			h : [] ,
			i : 'iii'
		}
	} ,
	anotherSubtree : {
		j : 'Djay' ,
		k : 'ok' ,
		subtree: {
			l : '1one' ,
			m : false ,
			n : 'nay'
		} ,
		o : 'mg' ,
		subtree2: {
			p : true ,
			q : [4,5,6] ,
			r : '2'
		}
	} ,
	subtreeWithFunction: {
		z: 'Zee',
		Func: Func
	}
} ;



			/* Tests */



describe( "Masks" , function() {
	
	it( 'should apply a simple mask tree to the input tree' , function() {
		
		var mask = tree.createMask( {
			int: true,
			float: true,
			attachement: {
				filename: true,
				unexistant: true
			},
			unexistant: true,
			subtree: {
				subtree: true
			}
		} ) ;
		
		var output = mask.applyTo( input ) ;
		
		expect( output ).to.eql( {
			int: 12,
			float: 2.47,
			attachement: {
				filename: 'preview.png'
			},
			subtree: {
				subtree: {
					d: 4,
					e: undefined,
					f: 3.14
				}
			}
		} ) ;
	} ) ;
	
	it( "should apply a mask tree with wildcard '*' to the input tree" , function() {
		
		var mask = tree.createMask( {
			'files': {
				'*': {
					size: true,
					unexistant: true
				}
			}
		} ) ;
		
		var output = mask.applyTo( input ) ;
		
		expect( output.files ).to.be.an( Object ) ;
		expect( output ).to.eql( {
			files: {
				'background.png' : {
					size : '97856'
				} ,
				'header.png' : {
					size : '44193'
				} ,
				'footer.png' : {
					size : '36411'
				}
			}
		} ) ;
	} ) ;
	
	it( "should apply a mask tree with wildcard '*' to match array in the input tree" , function() {
		
		var mask = tree.createMask( {
			'filesArray': {
				'*': {
					name: true,
					size: true,
					unexistant: true
				}
			}
		} ) ;
		
		var output = mask.applyTo( input ) ;
		
		expect( output.filesArray ).to.be.an( Array ) ;
		expect( output ).to.eql( {
			filesArray: [
				{
					name : 'background.png' ,
					size : '97856'
				} ,
				{
					name : 'header.png' ,
					size : '44193'
				} ,
				{
					name : 'footer.png' ,
					size : '36411'
				}
			]
		} ) ;
		
		//console.log( "\n\n\n\n" , output , "\n\n\n\n" ) ;
		
	} ) ;
	
	it( "should apply a mask with a mask's leaf callback to the input tree" , function() {
		
		var leaf = function leaf( input , key , argument , path ) {
			//console.log( 'LEAF: ' , input , key , argument , path ) ;
			
			if ( ! input.hasOwnProperty( key ) ) { return new Error( 'not_found' ) ; }
			if ( typeof input[ key ] === 'number' ) { return input[ key ] + argument ; }
			return input[ key ] ;
		} ;
		
		var mask = tree.createMask(
			{
				int: 87 ,
				float: 14 ,
				subtree: {
					subtree: {
						f: 0.0016
					}
				} ,
				unexistant: 45
			} ,
			{ leaf: leaf }
		) ;
		
		var output = mask.applyTo( input ) ;
		
		expect( output ).to.eql( {
			int: 99,
			float: 16.47,
			subtree: {
				subtree: {
					f: 3.1416
				}
			}
		} ) ;
	} ) ;
	
	it( 'should apply a mask containing other masks to the input tree' , function() {
		
		var mask = tree.createMask( {
			int: true,
			float: true,
			attachement: tree.createMask( {
				filename: true,
				unexistant: true
			} ),
			unexistant: true,
			subtree: tree.createMask( {
				subtree: true
			} )
		} ) ;
		
		var output = mask.applyTo( input ) ;
		
		expect( output ).to.eql( {
			int: 12,
			float: 2.47,
			attachement: {
				filename: 'preview.png'
			},
			subtree: {
				subtree: {
					d: 4,
					e: undefined,
					f: 3.14
				}
			}
		} ) ;
	} ) ;
	
	it( 'variantes' ) ;
	/*	
		// Variante 1
		var mask1 = {
			a: true,
			b: true,
			c: true,
			sub: {
				subA: true,
				subB: true,
				subC: true
			}
		} ;
		
		// Variante 2
		var mask2 = [
			'a', 'b', 'c', [ 'sub' , [ 'subA' , 'subB' , 'subC' ] ]
		] ;
		
		// Variante 3
		var mask3 = [
			'a', 'b', 'c', [ 'sub' , 'subA' , 'subB' , 'subC' ]
		] ;
	*/
} ) ;



describe( "Inverse masks" , function() {
	
	it( 'should apply a simple mask tree to the input tree' , function() {
		
		var mask = tree.createInverseMask( {
			a: true,
			subtree: {
				d: true
			},
			subtree2: true
		} ) ;
		
		var output = mask.applyTo( input.subtree ) ;
		
		//console.log( output ) ;
		
		expect( output ).to.eql( {
			b: 2,
			subtree: {
				e: undefined,
				f: 3.14
			},
			c: 'plusplus'
		} ) ;
	} ) ;
} ) ;


