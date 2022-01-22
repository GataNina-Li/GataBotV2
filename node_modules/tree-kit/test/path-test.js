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



const path = require( '../lib/path.js' ) ;





			/* Tests */



describe( "Tree's path on objects" , function() {
	
	it( "path.get() on object structure" , function() {
		
		var o = {
			a: 5 ,
			sub: {
				b: "toto" ,
				sub: {
					c: true
				}
			} ,
			d: null
		} ;
		
		expect( path.get( o , 'a' ) ).to.be( 5 ) ;
		expect( path.get( o , 'sub' ) ).to.eql( {
			b: "toto" ,
			sub: {
				c: true
			}
		} ) ;
		expect( path.get( o , 'sub.b' ) ).to.be( "toto" ) ;
		expect( path.get( o , 'sub.sub' ) ).to.eql( { c: true } ) ;
		expect( path.get( o , 'sub.sub.c' ) ).to.be( true ) ;
		expect( path.get( o , 'd' ) ).to.be( null ) ;
		expect( path.get( o , 'nothing' ) ).to.be( undefined ) ;
		expect( path.get( o , 'sub.nothing' ) ).to.be( undefined ) ;
		expect( path.get( o , 'nothing.nothing' ) ).to.be( undefined ) ;
	} ) ;
	
	/*
	it( "bracket notation on object" , function() {
		
		var o = {
			a: 5 ,
			sub: {
				b: "toto" ,
				sub: {
					c: true
				}
			} ,
			d: null
		} ;
		
		expect( path.get( o , '[a]' ) ).to.be( 5 ) ;
		expect( path.get( o , '[sub][sub][c]' ) ).to.be( true ) ;
	} ) ;
	*/
	
	it( "path.delete() on object structure" , function() {
		
		var o = {
			a: 5 ,
			sub: {
				b: "toto" ,
				sub: {
					c: true ,
					sub: {
						f: ''
					}
				}
			} ,
			d: null
		} ;
		
		path.delete( o , 'a' ) ;
		path.delete( o , 'sub.sub' ) ;
		path.delete( o , 'non.existant.path' ) ;
		
		expect( o ).to.eql( {
			sub: {
				b: "toto" ,
			} ,
			d: null
		} ) ;
	} ) ;
	
	it( "path.set() on object structure" , function() {
		
		var o = {
			a: 5 ,
			sub: {
				b: "toto" ,
				sub: {
					c: true
				}
			} ,
			d: null
		} ;
		
		path.set( o , 'a' , "8" ) ;
		path.set( o , 'sub.b' , false ) ;
		path.set( o , 'sub.sub' , { x: 18 , y: 27 } ) ;
		path.set( o , 'non.existant.path' , 'new' ) ;
		
		expect( o ).to.eql( {
			a: "8" ,
			sub: {
				b: false ,
				sub: {
					x: 18 ,
					y: 27
				}
			} ,
			d: null ,
			non: {
				existant: {
					path: 'new'
				}
			}
		} ) ;
	} ) ;
	
	it( "path.define() on object structure" , function() {
		
		var o = {
			a: 5 ,
			sub: {
				b: "toto" ,
				sub: {
					c: true
				}
			} ,
			d: null
		} ;
		
		path.define( o , 'a' , "8" ) ;
		path.define( o , 'sub.b' , false ) ;
		path.define( o , 'unexistant' , '!' ) ;
		path.define( o , 'sub.sub' , { x: 18 , y: 27 } ) ;
		path.define( o , 'non.existant.path' , 'new' ) ;
		
		expect( o ).to.eql( {
			a: 5 ,
			unexistant: '!' ,
			sub: {
				b: "toto" ,
				sub: {
					c: true
				}
			} ,
			d: null ,
			non: {
				existant: {
					path: 'new'
				}
			}
		} ) ;
	} ) ;
	
	it( "path.inc() and path.dec() on object structure" , function() {
		
		var o = {
			a: 5 ,
			sub: {
				b: 10 ,
				sub: {
					c: true
				}
			} ,
			d: null
		} ;
		
		path.inc( o , 'a' ) ;
		path.dec( o , 'sub.b' ) ;
		path.inc( o , 'sub' ) ;
		path.dec( o , 'sub.sub' ) ;
		path.inc( o , 'non.existant.path' ) ;
		path.dec( o , 'another.non.existant.path' ) ;
		
		expect( o ).to.eql( {
			a: 6 ,
			sub: {
				b: 9 ,
				sub: {
					c: true
				}
			} ,
			d: null ,
			non: {
				existant: {
					path: 1
				}
			} ,
			another: {
				non: {
					existant: {
						path: -1
					}
				}
			}
		} ) ;
	} ) ;
	
	it( "path.append() and path.prepend() on object structure" , function() {
		
		var o = {
			a: null ,
			sub: {
				b: [ 'some' ] ,
				sub: {
					c: [ 'value' ]
				}
			} ,
		} ;
		
		path.append( o , 'a' , 'hello' ) ;
		path.append( o , 'sub.b' , 'value' ) ;
		path.prepend( o , 'sub.sub.c' , 'other' ) ;
		path.prepend( o , 'sub.sub.c' , 'some' ) ;
		path.append( o , 'sub.sub.c' , '!' ) ;
		path.append( o , 'non.existant.path' , '!' ) ;
		path.prepend( o , 'another.non.existant.path' , '!' ) ;
		
		expect( o ).to.eql( {
			a: [ 'hello' ] ,
			sub: {
				b: [ 'some' , 'value' ] ,
				sub: {
					c: [ 'some' , 'other' , 'value' , '!' ]
				}
			} ,
			non: {
				existant: {
					path: [ '!' ]
				}
			} ,
			another: {
				non: {
					existant: {
						path: [ '!' ]
					}
				}
			}
		} ) ;
	} ) ;
	
	it( "path.concat() and path.insert() on object structure" , function() {
		
		var o = {
			a: null ,
			sub: {
				b: [ 'hi' ] ,
				sub: {
					c: [ 'again' ]
				}
			} ,
		} ;
		
		path.concat( o , 'a' , [ 'hello' , 'world' ] ) ;
		path.concat( o , 'sub.b' , [ 'hello' , 'world' ] ) ;
		path.insert( o , 'sub.sub.c' , [ 'hello' , 'world' ] ) ;
		
		expect( o ).to.eql( {
			a: [ 'hello' , 'world' ] ,
			sub: {
				b: [ 'hi' , 'hello' , 'world' ] ,
				sub: {
					c: [ 'hello' , 'world' , 'again' ]
				}
			}
		} ) ;
	} ) ;
	
	it( "path.autoPush()" , function() {
		
		var o = {
			a: 1 ,
			sub: {
				b: [ 'some' ] ,
				sub: {
					c: [ 'some' , 'other' , 'value' ]
				}
			} ,
		} ;
		
		path.autoPush( o , 'a' , 'hello' ) ;
		path.autoPush( o , 'd' , 'D' ) ;
		path.autoPush( o , 'sub.b' , 'value' ) ;
		path.autoPush( o , 'sub.sub.c' , '!' ) ;
		path.autoPush( o , 'non.existant.path' , '!' ) ;
		
		expect( o ).to.eql( {
			a: [ 1 , 'hello' ] ,
			d: 'D' ,
			sub: {
				b: [ 'some' , 'value' ] ,
				sub: {
					c: [ 'some' , 'other' , 'value' , '!' ]
				}
			} ,
			non: {
				existant: {
					path: '!'
				}
			}
		} ) ;
	} ) ;
	
	it( "empty keys" , function() {
		
		var o ;
		
		o = {
			a: 5 ,
			"": {
				b: "toto" ,
				sub: {
					c: true
				}
			} ,
			d: null
		} ;
		
		expect( path.get( o , 'a' ) ).to.be( 5 ) ;
		expect( path.get( o , '' ) ).to.eql( { b: "toto" , sub: { c: true } } ) ;
		expect( path.get( o , '.b' ) ).to.be( "toto" ) ;
		expect( path.get( o , '.sub' ) ).to.eql( { c: true } ) ;
		expect( path.get( o , '.sub.c' ) ).to.be( true ) ;
		
		o = {
			"": {
				"": {
					"": {
						a: 1 ,
						b: 2
					}
				}
			} ,
		} ;
		
		expect( path.get( o , '' ) ).to.eql( { "": { "": { a: 1 , b: 2 } } } ) ;
		expect( path.get( o , '.' ) ).to.eql( { "": { a: 1 , b: 2 } } ) ;
		expect( path.get( o , '..' ) ).to.eql( { a: 1 , b: 2 } ) ;
		expect( path.get( o , '...a' ) ).to.eql( 1 ) ;
	} ) ;
	
	it( "all method should return the targeted item, like path.get() does" ) ;
	
} ) ;



describe( "Tree's path on arrays" , function() {
	
	it( "path.get() on a simple array" , function() {
		
		var a = [ 'a' , 'b' , 'c' ] ;
		
		expect( path.get( a , '0' ) ).to.be( 'a' ) ;
		expect( path.get( a , '1' ) ).to.be( 'b' ) ;
		expect( path.get( a , '2' ) ).to.be( 'c' ) ;
		expect( path.get( a , '3' ) ).to.be( undefined ) ;
		expect( path.get( a , '#0' ) ).to.be( 'a' ) ;
		expect( path.get( a , '#1' ) ).to.be( 'b' ) ;
		expect( path.get( a , '#2' ) ).to.be( 'c' ) ;
		expect( path.get( a , '#3' ) ).to.be( undefined ) ;
		expect( path.get( a , '[0]' ) ).to.be( 'a' ) ;
		expect( path.get( a , '[1]' ) ).to.be( 'b' ) ;
		expect( path.get( a , '[2]' ) ).to.be( 'c' ) ;
		expect( path.get( a , '[3]' ) ).to.be( undefined ) ;
		expect( path.get( a , 'length' ) ).to.be( 3 ) ;
		expect( path.get( a , '#length' ) ).to.be( 3 ) ;
		expect( path.get( a , 'first' ) ).to.be( undefined ) ;
		expect( path.get( a , '#first' ) ).to.be( 'a' ) ;
		expect( path.get( a , 'last' ) ).to.be( undefined ) ;
		expect( path.get( a , '#last' ) ).to.be( 'c' ) ;
		expect( path.get( a , 'next' ) ).to.be( undefined ) ;
		expect( path.get( a , '#next' ) ).to.be( undefined ) ;
	} ) ;
	
	it( "path.get() on nested arrays" , function() {
		
		var a = [ 'a' , [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ] ;
		
		expect( path.get( a , '#0' ) ).to.be( 'a' ) ;
		expect( path.get( a , '#1' ) ).to.eql( [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ) ;
		expect( path.get( a , '#2' ) ).to.be( undefined ) ;
		expect( path.get( a , '[0]' ) ).to.be( 'a' ) ;
		expect( path.get( a , '[1]' ) ).to.eql( [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ) ;
		expect( path.get( a , '[2]' ) ).to.be( undefined ) ;
		expect( path.get( a , '#length' ) ).to.be( 2 ) ;
		expect( path.get( a , '#first' ) ).to.be( 'a' ) ;
		expect( path.get( a , '#last' ) ).to.eql( [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ) ;
		expect( path.get( a , '#next' ) ).to.be( undefined ) ;
		
		expect( path.get( a , '1#0' ) ).to.eql( [ 'b' , 'c' ] ) ;
		expect( path.get( a , '1#1' ) ).to.eql( 'd' ) ;
		expect( path.get( a , '1#2' ) ).to.eql( [ 'e' , 'f' ] ) ;
		expect( path.get( a , '1#3' ) ).to.be( undefined ) ;
		expect( path.get( a , '[1][0]' ) ).to.eql( [ 'b' , 'c' ] ) ;
		expect( path.get( a , '[1][1]' ) ).to.eql( 'd' ) ;
		expect( path.get( a , '[1][2]' ) ).to.eql( [ 'e' , 'f' ] ) ;
		expect( path.get( a , '[1][3]' ) ).to.be( undefined ) ;
		expect( path.get( a , '1#length' ) ).to.be( 3 ) ;
		expect( path.get( a , '1#first' ) ).to.eql( [ 'b' , 'c' ] ) ;
		expect( path.get( a , '1#last' ) ).to.eql( [ 'e' , 'f' ] ) ;
		expect( path.get( a , '1#next' ) ).to.be( undefined ) ;
		
		expect( path.get( a , '1#2#last' ) ).to.eql( 'f' ) ;
	} ) ;
	
	it( "path.set() on a simple array" , function() {
		
		var a ;
		
		a = [ 'a' , 'b' , 'c' ] ;
		
		path.set( a , '1' , 'B' ) ;
		path.set( a , '#last' , 3 ) ;
		path.set( a , '#next' , 'D' ) ;
		path.set( a , '#first' , 1 ) ;
		
		expect( a ).to.eql( [ 1 , 'B' , 3 , 'D' ] ) ;
		expect( path.get( a , '#length' ) ).to.be( 4 ) ;
		
		a = [ 'a' , 'b' , 'c' ] ;
		
		path.set( a , '[1]' , 'BBB' ) ;
		path.set( a , '#last' , 3 ) ;
		path.set( a , '#next' , 'D' ) ;
		path.set( a , '#first' , 1 ) ;
		
		expect( a ).to.eql( [ 1 , 'BBB' , 3 , 'D' ] ) ;
		expect( path.get( a , '#length' ) ).to.be( 4 ) ;
	} ) ;
	
	it( "path.set() using multiple #next and #insert" , function() {
		
		var a = [ 'a' , 'b' , 'c' ] ;
		
		path.set( a , '#next' , 'D' ) ;
		path.set( a , '#next.f#next' , 'g' ) ;
		path.set( a , '#next#next#next' , 'E' ) ;
		path.set( a , '#insert' , '@' ) ;
		path.set( a , '#last#insert' , '@' ) ;
		
		expect( a ).to.eql( [ '@' , 'a' , 'b' , 'c' , 'D' ,  { f: [ 'g' ] } , [ '@' , [ 'E' ] ] ] ) ;
		expect( path.get( a , '#length' ) ).to.be( 7 ) ;
	} ) ;
	
	it( "path.delete() on a simple array" , function() {
		
		var a ;
		
		a = [ 'a' , 'b' , 'c' ] ;
		path.delete( a , '1' ) ;
		//expect( a ).to.eql( [ 'a' , undefined , 'c' ] ) ;	// expect() bug here...
		expect( path.get( a , '#length' ) ).to.be( 3 ) ;
		
		a = [ 'a' , 'b' , 'c' ] ;
		path.delete( a , '#1' ) ;
		expect( a ).to.eql( [ 'a' , 'c' ] ) ;
		expect( path.get( a , '#length' ) ).to.be( 2 ) ;
		
		a = [ 'a' , 'b' , 'c' ] ;
		path.delete( a , '[1]' ) ;
		expect( a ).to.eql( [ 'a' , 'c' ] ) ;
		expect( path.get( a , '#length' ) ).to.be( 2 ) ;
		
		a = [ 'a' , 'b' , 'c' ] ;
		path.delete( a , '#2' ) ;
		expect( a ).to.eql( [ 'a' , 'b' ] ) ;
		expect( path.get( a , '#length' ) ).to.be( 2 ) ;
		
		a = [ 'a' , 'b' , 'c' ] ;
		path.delete( a , '[2]' ) ;
		expect( a ).to.eql( [ 'a' , 'b' ] ) ;
		expect( path.get( a , '#length' ) ).to.be( 2 ) ;
		
		a = [ 'a' , 'b' , 'c' ] ;
		path.delete( a , '#last' ) ;
		expect( a ).to.eql( [ 'a' , 'b' ] ) ;
		expect( path.get( a , '#length' ) ).to.be( 2 ) ;
		path.delete( a , '#last' ) ;
		expect( a ).to.eql( [ 'a' ] ) ;
		expect( path.get( a , '#length' ) ).to.be( 1 ) ;
		path.delete( a , '#last' ) ;
		expect( a ).to.eql( [] ) ;
		expect( path.get( a , '#length' ) ).to.be( 0 ) ;
		
		a = [ 'a' , 'b' , 'c' ] ;
		path.delete( a , '#first' ) ;
		expect( a ).to.eql( [ 'b' , 'c' ] ) ;
		expect( path.get( a , '#length' ) ).to.be( 2 ) ;
		path.delete( a , '#first' ) ;
		expect( a ).to.eql( [ 'c' ] ) ;
		expect( path.get( a , '#length' ) ).to.be( 1 ) ;
		path.delete( a , '#first' ) ;
		expect( a ).to.eql( [] ) ;
		expect( path.get( a , '#length' ) ).to.be( 0 ) ;
	} ) ;
	
	it( "path.set() on structure mixing arrays and objects" ) ;
	
} ) ;



describe( "Tree's path on mixed object and arrays" , function() {
	
	it( "path.get() on a simple array" , function() {
		
		var a = {
			method: 'get' ,
			populate: [ 'parents', 'godfather' ]
		} ;
		
		expect( path.get( a , 'method' ) ).to.be( 'get' ) ;
		expect( path.get( a , 'populate' ) ).to.eql( [ 'parents', 'godfather' ] ) ;
		expect( path.get( a , 'populate[0]' ) ).to.be( 'parents' ) ;
		expect( path.get( a , 'populate[1]' ) ).to.be( 'godfather' ) ;
		expect( path.get( a , 'populate[2]' ) ).to.be( undefined ) ;
	} ) ;
	
	it( "path.set() on a simple array" , function() {
		
		var a = {
			method: 'get' ,
			populate: [ 'parent', 'godfather' ]
		} ;
		
		path.set( a , 'method' , 'post' ) ;
		path.set( a , 'populate[0]' , 'friends' ) ;
		expect( a ).to.eql( {
			method: 'post' ,
			populate: [ 'friends', 'godfather' ]
		} ) ;
	} ) ;
} ) ;
	


describe( "Inheritance, using Object.create( path.prototype )" , function() {
	
	it( ".get()" , function() {
		
		var o = Object.create( path.prototype ) ;
		
		o.a = 5 ;
		o.sub = {
			b: "toto" ,
			sub: {
				c: true
			}
		} ;
		o.d = null ;
		
		expect( o.get( 'a' ) ).to.be( 5 ) ;
		expect( o.get( 'sub' ) ).to.eql( {
			b: "toto" ,
			sub: {
				c: true
			}
		} ) ;
		expect( o.get( 'sub.b' ) ).to.be( "toto" ) ;
		expect( o.get( 'sub.sub' ) ).to.eql( { c: true } ) ;
		expect( o.get( 'sub.sub.c' ) ).to.be( true ) ;
		expect( o.get( 'd' ) ).to.be( null ) ;
		expect( o.get( 'nothing' ) ).to.be( undefined ) ;
		expect( o.get( 'sub.nothing' ) ).to.be( undefined ) ;
		expect( o.get( 'nothing.nothing' ) ).to.be( undefined ) ;
	} ) ;
	
	it( ".delete()" , function() {
		
		var o = Object.create( path.prototype ) ;
		
		o.a = 5 ;
		o.sub = {
			b: "toto" ,
			sub: {
				c: true ,
				sub: {
					f: ''
				}
			}
		} ;
		o.d = null ;
		
		o.delete( 'a' ) ;
		o.delete( 'sub.sub' ) ;
		o.delete( 'non.existant.path' ) ;
		
		expect( o ).to.be.like( {
			sub: {
				b: "toto" ,
			} ,
			d: null
		} ) ;
		
	} ) ;
	
	it( ".set()" , function() {
		
		var o = Object.create( path.prototype ) ;
		
		o.a = 5 ;
		o.sub = {
			b: "toto" ,
			sub: {
				c: true
			}
		} ;
		o.d = null ;
		
		o.set( 'a' , "8" ) ;
		o.set( 'sub.b' , false ) ;
		o.set( 'sub.sub' , { x: 18 , y: 27 } ) ;
		o.set( 'non.existant.path' , 'new' ) ;
		
		expect( o ).to.be.like( {
			a: "8" ,
			sub: {
				b: false ,
				sub: {
					x: 18 ,
					y: 27
				}
			} ,
			d: null ,
			non: {
				existant: {
					path: 'new'
				}
			}
		} ) ;
		
	} ) ;
	
	it( ".define()" , function() {
		
		var o = Object.create( path.prototype ) ;
		
		o.a = 5 ;
		o.sub = {
			b: "toto" ,
			sub: {
				c: true
			}
		} ;
		o.d = null ;
		
		o.define( 'a' , "8" ) ;
		o.define( 'sub.b' , false ) ;
		o.define( 'unexistant' , '!' ) ;
		o.define( 'sub.sub' , { x: 18 , y: 27 } ) ;
		o.define( 'non.existant.path' , 'new' ) ;
		
		expect( o ).to.be.like( {
			a: 5 ,
			unexistant: '!' ,
			sub: {
				b: "toto" ,
				sub: {
					c: true
				}
			} ,
			d: null ,
			non: {
				existant: {
					path: 'new'
				}
			}
		} ) ;
	} ) ;
	
	it( ".inc() and .dec()" , function() {
		
		var o = Object.create( path.prototype ) ;
		
		o.a = 5 ;
		o.sub = {
			b: 10 ,
			sub: {
				c: true
			}
		} ;
		o.d = null ;
		
		o.inc( 'a' ) ;
		o.dec( 'sub.b' ) ;
		o.inc( 'sub' ) ;
		o.dec( 'sub.sub' ) ;
		o.inc( 'non.existant.path' ) ;
		o.dec( 'another.non.existant.path' ) ;
		
		expect( o ).to.be.like( {
			a: 6 ,
			sub: {
				b: 9 ,
				sub: {
					c: true
				}
			} ,
			d: null ,
			non: {
				existant: {
					path: 1
				}
			} ,
			another: {
				non: {
					existant: {
						path: -1
					}
				}
			}
		} ) ;
		
	} ) ;
} ) ;



describe( "Tree's array path on objects" , function() {
	
	it( "path.get() on object structure" , function() {
		
		var o = {
			a: 5 ,
			sub: {
				b: "toto" ,
				sub: {
					c: true
				}
			} ,
			d: null
		} ;
		
		expect( path.get( o , [ 'a' ] ) ).to.be( 5 ) ;
		expect( path.get( o , [ 'sub' ] ) ).to.be.like( {
			b: "toto" ,
			sub: {
				c: true
			}
		} ) ;
		
		expect( path.get( o , [ 'sub' , 'b' ] ) ).to.be( "toto" ) ;
		expect( path.get( o , [ 'sub' , 'sub' ] ) ).to.be.like( { c: true } ) ;
		expect( path.get( o , [ 'sub' , 'sub' , 'c' ] ) ).to.be( true ) ;
		expect( path.get( o , [ 'd' ] ) ).to.be( null ) ;
		expect( path.get( o , [ 'nothing' ] ) ).to.be( undefined ) ;
		expect( path.get( o , [ 'sub' , 'nothing' ] ) ).to.be( undefined ) ;
		expect( path.get( o , [ 'nothing' , 'nothing' ] ) ).to.be( undefined ) ;
	} ) ;
	
	it( "path.delete() on object structure" , function() {
		
		var o = {
			a: 5 ,
			sub: {
				b: "toto" ,
				sub: {
					c: true ,
					sub: {
						f: ''
					}
				}
			} ,
			d: null
		} ;
		
		path.delete( o , [ 'a' ] ) ;
		path.delete( o , [ 'sub' , 'sub' ] ) ;
		path.delete( o , [ 'non' , 'existant' , 'path' ] ) ;
		
		expect( o ).to.be.like( {
			sub: {
				b: "toto" ,
			} ,
			d: null
		} ) ;
		
	} ) ;
	
	it( "path.set() on object structure" , function() {
		
		var o = {
			a: 5 ,
			sub: {
				b: "toto" ,
				sub: {
					c: true
				}
			} ,
			d: null
		} ;
		
		path.set( o , [ 'a' ] , "8" ) ;
		path.set( o , [ 'sub' , 'b' ] , false ) ;
		path.set( o , [ 'sub' , 'sub' ] , { x: 18 , y: 27 } ) ;
		path.set( o , [ 'non' , 'existant' , 'path' ] , 'new' ) ;
		
		expect( o ).to.be.like( {
			a: "8" ,
			sub: {
				b: false ,
				sub: {
					x: 18 ,
					y: 27
				}
			} ,
			d: null ,
			non: {
				existant: {
					path: 'new'
				}
			}
		} ) ;
		
	} ) ;
	
	it( "path.define() on object structure" , function() {
		
		var o = {
			a: 5 ,
			sub: {
				b: "toto" ,
				sub: {
					c: true
				}
			} ,
			d: null
		} ;
		
		path.define( o , [ 'a' ] , "8" ) ;
		path.define( o , [ 'sub' , 'b' ] , false ) ;
		path.define( o , [ 'unexistant' ] , '!' ) ;
		path.define( o , [ 'sub' , 'sub' ] , { x: 18 , y: 27 } ) ;
		path.define( o , [ 'non' , 'existant' , 'path' ] , 'new' ) ;
		
		expect( o ).to.be.like( {
			a: 5 ,
			unexistant: '!' ,
			sub: {
				b: "toto" ,
				sub: {
					c: true
				}
			} ,
			d: null ,
			non: {
				existant: {
					path: 'new'
				}
			}
		} ) ;
	} ) ;
	
	it( "path.inc() and path.dec() on object structure" , function() {
		
		var o = {
			a: 5 ,
			sub: {
				b: 10 ,
				sub: {
					c: true
				}
			} ,
			d: null
		} ;
		
		path.inc( o , [ 'a' ] ) ;
		path.dec( o , [ 'sub' , 'b' ] ) ;
		path.inc( o , [ 'sub' ] ) ;
		path.dec( o , [ 'sub' , 'sub' ] ) ;
		path.inc( o , [ 'non' , 'existant' , 'path' ] ) ;
		path.dec( o , [ 'another' , 'non' , 'existant' , 'path' ] ) ;
		
		expect( o ).to.be.like( {
			a: 6 ,
			sub: {
				b: 9 ,
				sub: {
					c: true
				}
			} ,
			d: null ,
			non: {
				existant: {
					path: 1
				}
			} ,
			another: {
				non: {
					existant: {
						path: -1
					}
				}
			}
		} ) ;
		
	} ) ;
} ) ;



describe( ".path() security issues" , () => {

	it( "Prototype pollution using .__proto__" , () => {
		expect( () => path.set( {} , '__proto__.hack' , 'hacked' ) ).to.throw() ;
		expect( Object.prototype.hack ).to.be.undefined() ;
		expect( () => path.set( {} , '__proto__' , 'hacked' ) ).to.throw() ;
		expect( () => path.set( {a:{}} , 'a.__proto__' , 'hacked' ) ).to.throw() ;
		expect( () => path.delete( {} , '__proto__' , 'hacked' ) ).to.throw() ;
		expect( () => path.delete( {} , '__proto__.hack' , 'hacked' ) ).to.throw() ;
	} ) ;

	it( "Prototype pollution using a path array: [['__proto__']]" , () => {
		expect( () => path.set( {} , [['__proto__'],'hack'] , 'hacked' ) ).to.throw() ;
		expect( Object.prototype.hack ).to.be.undefined() ;
		expect( () => path.set( {} , '__proto__' , 'hacked' ) ).to.throw() ;
		expect( () => path.set( {a:{}} , 'a.__proto__' , 'hacked' ) ).to.throw() ;
		expect( () => path.delete( {} , '__proto__' , 'hacked' ) ).to.throw() ;
		expect( () => path.delete( {} , '__proto__.hack' , 'hacked' ) ).to.throw() ;
	} ) ;

	it( "Prototype pollution using .constructor" , () => {
		expect( () => path.set( {} , 'constructor.prototype' , 'hacked' ) ).to.throw() ;
		expect( () => path.set( {} , 'constructor.prototype.hack' , 'hacked' ) ).to.throw() ;
		expect( Object.prototype.hack ).to.be.undefined() ;
		expect( path.get( {} , 'constructor' ) ).to.be( Object ) ;
		expect( () => path.get( {} , 'constructor.prototype' ) ).to.throw() ;
		
		// Check that we can still return a function, but not go inside of it
		function fn() {}
		fn.a = 'A' ;
		expect( path.get( { fn } , 'fn' ) ).to.be( fn ) ;
		expect( () => path.get( { fn } , 'fn.a' ) ).to.throw() ;
		expect( () => path.get( { fn } , 'fn.prototype' ) ).to.throw() ;
		expect( () => path.set( { fn } , 'fn.a' , 'B' ) ).to.throw() ;
		expect( fn.a ).to.be( 'A' ) ;

		var o = { fn } ;
		path.set( o , 'fn' , 'notfn' ) ;
		expect( o.fn ).to.be( 'notfn' ) ;
	} ) ;
} ) ;

