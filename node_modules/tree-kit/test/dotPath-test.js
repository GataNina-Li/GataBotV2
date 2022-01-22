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

/* global expect, describe, it */

"use strict" ;



const path = require( '../lib/dotPath.js' ) ;



describe( "Tree's dot-path on objects" , () => {

	it( "path.get() on object structure" , () => {
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
		expect( path.get( o , 'sub' ) ).to.equal( {
			b: "toto" ,
			sub: {
				c: true
			}
		} ) ;

		expect( path.get( o , 'sub.b' ) ).to.be( "toto" ) ;
		expect( path.get( o , 'sub.sub' ) ).to.equal( { c: true } ) ;
		expect( path.get( o , 'sub.sub.c' ) ).to.be( true ) ;
		expect( path.get( o , 'd' ) ).to.be( null ) ;
		expect( path.get( o , 'nothing' ) ).to.be( undefined ) ;
		expect( path.get( o , 'sub.nothing' ) ).to.be( undefined ) ;
		expect( path.get( o , 'nothing.nothing' ) ).to.be( undefined ) ;
	} ) ;

	it( "path.delete() on object structure" , () => {
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

		expect( o ).to.equal( {
			sub: {
				b: "toto"
			} ,
			d: null
		} ) ;
	} ) ;

	it( "path.set() on object structure" , () => {
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

		expect( o ).to.equal( {
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

	it( "path.define() on object structure" , () => {
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

		expect( o ).to.equal( {
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

	it( "path.inc() and path.dec() on object structure" , () => {
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

		expect( o ).to.equal( {
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

	it( "path.append() and path.prepend() on object structure" , () => {
		var o = {
			a: null ,
			sub: {
				b: [ 'some' ] ,
				sub: {
					c: [ 'value' ]
				}
			}
		} ;

		path.append( o , 'a' , 'hello' ) ;
		path.append( o , 'sub.b' , 'value' ) ;
		path.prepend( o , 'sub.sub.c' , 'other' ) ;
		path.prepend( o , 'sub.sub.c' , 'some' ) ;
		path.append( o , 'sub.sub.c' , '!' ) ;
		path.append( o , 'non.existant.path' , '!' ) ;
		path.prepend( o , 'another.non.existant.path' , '!' ) ;

		expect( o ).to.equal( {
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

	it( "path.concat() and path.insert() on object structure" , () => {
		var o = {
			a: null ,
			sub: {
				b: [ 'hi' ] ,
				sub: {
					c: [ 'again' ]
				}
			}
		} ;

		path.concat( o , 'a' , [ 'hello' , 'world' ] ) ;
		path.concat( o , 'sub.b' , [ 'hello' , 'world' ] ) ;
		path.insert( o , 'sub.sub.c' , [ 'hello' , 'world' ] ) ;

		expect( o ).to.equal( {
			a: [ 'hello' , 'world' ] ,
			sub: {
				b: [ 'hi' , 'hello' , 'world' ] ,
				sub: {
					c: [ 'hello' , 'world' , 'again' ]
				}
			}
		} ) ;
	} ) ;

	it( "path.autoPush()" , () => {
		var o = {
			a: 1 ,
			sub: {
				b: [ 'some' ] ,
				sub: {
					c: [ 'some' , 'other' , 'value' ]
				}
			}
		} ;

		path.autoPush( o , 'a' , 'hello' ) ;
		path.autoPush( o , 'd' , 'D' ) ;
		path.autoPush( o , 'sub.b' , 'value' ) ;
		path.autoPush( o , 'sub.sub.c' , '!' ) ;
		path.autoPush( o , 'non.existant.path' , '!' ) ;

		expect( o ).to.equal( {
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
} ) ;



describe( "Tree's dot-path on arrays" , () => {

	it( "path.get() on a simple array" , () => {
		var a = [ 'a' , 'b' , 'c' ] ;

		expect( path.get( a , '0' ) ).to.be( 'a' ) ;
		expect( path.get( a , '1' ) ).to.be( 'b' ) ;
		expect( path.get( a , '2' ) ).to.be( 'c' ) ;
		expect( path.get( a , '3' ) ).to.be( undefined ) ;
		expect( path.get( a , 'length' ) ).to.be( 3 ) ;
	} ) ;

	it( "path.get() on nested arrays" , () => {
		var a = [ 'a' , [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ] ;

		expect( path.get( a , '0' ) ).to.be( 'a' ) ;
		expect( path.get( a , '1' ) ).to.equal( [ [ 'b' , 'c' ] , 'd' , [ 'e' , 'f' ] ] ) ;
		expect( path.get( a , '2' ) ).to.be( undefined ) ;

		expect( path.get( a , '1.0' ) ).to.equal( [ 'b' , 'c' ] ) ;
		expect( path.get( a , '1.1' ) ).to.equal( 'd' ) ;
		expect( path.get( a , '1.2' ) ).to.equal( [ 'e' , 'f' ] ) ;
		expect( path.get( a , '1.3' ) ).to.be( undefined ) ;
		expect( path.get( a , '1.length' ) ).to.be( 3 ) ;
	} ) ;

	it( "path.set() on a simple array" , () => {
		var a ;

		a = [ 'a' , 'b' , 'c' ] ;

		path.set( a , '1' , 'B' ) ;

		expect( a ).to.equal( [ 'a' , 'B' , 'c' ] ) ;
		expect( path.get( a , 'length' ) ).to.be( 3 ) ;

		a = [ 'a' , 'b' , 'c' ] ;

		path.set( a , '1' , 'BBB' ) ;

		expect( a ).to.equal( [ 'a' , 'BBB' , 'c' ] ) ;
		expect( path.get( a , 'length' ) ).to.be( 3 ) ;
	} ) ;

	it( "path.delete() on a simple array" , () => {
		var a ;

		a = [ 'a' , 'b' , 'c' ] ;
		path.delete( a , '1' ) ;
		expect( a ).to.equal( [ 'a' , undefined , 'c' ] ) ;
		expect( path.get( a , 'length' ) ).to.be( 3 ) ;

		a = [ 'a' , 'b' , 'c' ] ;
		path.delete( a , '2' ) ;
		expect( a ).to.equal( [ 'a' , 'b' , undefined ] ) ;
		expect( path.get( a , 'length' ) ).to.be( 3 ) ;
	} ) ;

	it( "path.set() on structure mixing arrays and objects" ) ;
} ) ;



describe( "Tree's dot-path on mixed object and arrays" , () => {

	it( "path.get() on a simple array" , () => {
		var a = {
			method: 'get' ,
			populate: [ 'parents' , 'godfather' ]
		} ;

		expect( path.get( a , 'method' ) ).to.be( 'get' ) ;
		expect( path.get( a , 'populate' ) ).to.equal( [ 'parents' , 'godfather' ] ) ;
		expect( path.get( a , 'populate.0' ) ).to.be( 'parents' ) ;
		expect( path.get( a , 'populate.1' ) ).to.be( 'godfather' ) ;
		expect( path.get( a , 'populate.2' ) ).to.be( undefined ) ;
	} ) ;

	it( "path.set() on a simple array" , () => {
		var a = {
			method: 'get' ,
			populate: [ 'parent' , 'godfather' ]
		} ;

		path.set( a , 'method' , 'post' ) ;
		path.set( a , 'populate.0' , 'friends' ) ;

		expect( a ).to.equal( {
			method: 'post' ,
			populate: [ 'friends' , 'godfather' ]
		} ) ;
	} ) ;
} ) ;



describe( "Tree's array dot-path on objects" , () => {

	it( "path.get() on object structure" , () => {
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

	it( "path.delete() on object structure" , () => {
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
				b: "toto"
			} ,
			d: null
		} ) ;
	} ) ;

	it( "path.set() on object structure" , () => {
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

	it( "path.define() on object structure" , () => {
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

	it( "path.inc() and path.dec() on object structure" , () => {
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



describe( ".dotPath() security issues" , () => {

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

