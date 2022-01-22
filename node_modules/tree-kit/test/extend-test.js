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



const extend = require( '../lib/extend.js' ) ;





			/* Helper functions */



// The input tree used in most tests

function Func() { console.log( 'Hellow!' ) ; }
Func.prototype.fn1 = function fn1() { console.log( 'fn1' ) ; } ;
Func.prototype.fn2 = function fn2() { console.log( 'fn2' ) ; } ;
Func.prop = 'property' ;



const input = {
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



describe( "extend()" , () => {
	
	it( "should extend correctly an empty Object with a flat Object without depth (with or without the 'deep' option)" , () => {
		var copy ;
		
		var expected = {
			d : 4 ,
			e : undefined ,
			f : 3.14 ,
			g : 6 ,
			h : [] ,
			i : 'iii'
		} ;
		
		copy = extend( { deep: true } , {} , input.subtree.subtree ) ;
		expect( extend( null , copy , input.subtree.subtree2 ) ).to.eql( expected ) ;
		
		copy = extend( { deep: true } , {} , input.subtree.subtree ) ;
		expect( extend( { deep: true } , copy , input.subtree.subtree2 ) ).to.eql( expected ) ;
	} ) ;
	
	it( "should extend an empty Object with a deep Object performing a SHALLOW copy, the result should be equal to the deep Object, nested object MUST be equal AND identical" , () => {
		var copy = extend( null , {} , input.subtree ) ;
		expect( copy ).to.be.a.shallow.clone.of( input.subtree ) ;
		expect( copy ).to.equal( input.subtree ) ;
	} ) ;
		
	it( "with the 'deep' option should extend an empty Object with a deep Object performing a DEEP copy, the result should be equal to the deep Object, nested object MUST be equal BUT NOT identical" , () => {
		var copy = extend( { deep: true } , {} , input.subtree ) ;
		expect( copy ).to.equal( input.subtree ) ;
		expect( copy ).not.to.be.a.shallow.clone.of( input.subtree ) ;
		expect( copy.subtree2 ).not.to.be.a.shallow.clone.of( input.subtree.subtree2 ) ;
	} ) ;
		
	it( "with the 'deep' option, sources functions are still simply copied/referenced into target" , () => {
		var copy = extend( { deep: true } , {} , input.subtreeWithFunction ) ;
		//console.log( copy ) ;
		expect( copy ).to.equal( input.subtreeWithFunction ) ;
		expect( copy.Func.prototype ).to.be( input.subtreeWithFunction.Func.prototype ) ;
	} ) ;
	
	it( "with the 'deep' & 'deepFunc' options, sources functions are treated like regular objects, creating an object rather than a function in the target location, and performing a deep copy of them" , () => {
		var copy = extend( { deep: true, deepFunc: true } , {} , input.subtreeWithFunction ) ;
		expect( copy ).not.to.equal( input.subtreeWithFunction ) ;
		expect( copy ).to.equal( { z: 'Zee' , Func: { prop: 'property' } } ) ;
	} ) ;
	
	it( "should extend (by default) properties of the prototype chain" , () => {
		var proto = {
			proto1: 'proto1' ,
			proto2: 'proto2' ,
		} ;
		
		var o = Object.create( proto ) ;
		
		o.own1 = 'own1' ;
		o.own2 = 'own2' ;
		
		expect( extend( null , {} , o ) ).to.equal( {
			proto1: 'proto1' ,
			proto2: 'proto2' ,
			own1: 'own1' ,
			own2: 'own2'
		} ) ;
		
		expect( extend( { deep: true } , {} , o ) ).to.equal( {
			proto1: 'proto1' ,
			proto2: 'proto2' ,
			own1: 'own1' ,
			own2: 'own2'
		} ) ;
	} ) ;
	
	it( "with the 'own' option, it should ONLY extend OWNED properties, non-enumerable properties and properties of the prototype chain are SKIPPED" , () => {
		var proto = {
			proto1: 'proto1' ,
			proto2: 'proto2' ,
		} ;
		
		var o = Object.create( proto ) ;
		
		o.own1 = 'own1' ;
		o.own2 = 'own2' ;
		
		Object.defineProperties( o , {
			nonEnum1: { value: 'nonEnum1' } ,
			nonEnum2: { value: 'nonEnum2' }
		} ) ;
		
		expect( extend( { own: true } , {} , o ) ).to.equal( {
			own1: 'own1' ,
			own2: 'own2'
		} ) ;
		
		expect( extend( { deep: true, own: true } , {} , o ) ).to.equal( {
			own1: 'own1' ,
			own2: 'own2'
		} ) ;
	} ) ;
	
	it( "with the 'own' & 'nonEnum' option, it should ONLY extend OWNED properties, enumerable or not, but properties of the prototype chain are SKIPPED" , () => {
		var proto = {
			proto1: 'proto1' ,
			proto2: 'proto2' ,
		} ;
		
		var o = Object.create( proto ) ;
		
		o.own1 = 'own1' ;
		o.own2 = 'own2' ;
		
		Object.defineProperties( o , {
			nonEnum1: { value: 'nonEnum1' } ,
			nonEnum2: { value: 'nonEnum2' }
		} ) ;
		
		expect( extend( { own: true , nonEnum: true } , {} , o ) ).to.equal( {
			own1: 'own1' ,
			own2: 'own2' ,
			nonEnum1: 'nonEnum1' ,
			nonEnum2: 'nonEnum2'
		} ) ;
		
		expect( extend( { deep: true, own: true , nonEnum: true } , {} , o ) ).to.equal( {
			own1: 'own1' ,
			own2: 'own2' ,
			nonEnum1: 'nonEnum1' ,
			nonEnum2: 'nonEnum2'
		} ) ;
	} ) ;
	
	it( "with the 'descriptor' option, it should preserve descriptor as well" , () => {
		var r ;
		
		var proto = {
			proto1: 'proto1' ,
			proto2: 'proto2' ,
		} ;
		
		var o = Object.create( proto ) ;
		
		o.own1 = 'own1' ;
		o.own2 = 'own2' ;
		o.nested = { a: 1 , b: 2 } ;
		
		var getter = function() { return 5 ; } ;
		var setter = function( value ) {} ;
		
		Object.defineProperties( o , {
			nonEnum1: { value: 'nonEnum1' } ,
			nonEnum2: { value: 'nonEnum2' , writable: true } ,
			nonEnum3: { value: 'nonEnum3' , configurable: true } ,
			nonEnumNested: { value: { c: 3 , d: 4 } } ,
			getter: { get: getter } ,
			getterAndSetter: { get: getter , set: setter }
		} ) ;
		
		r = extend( { own: true , nonEnum: true , descriptor: true } , {} , o ) ;
		
		expect( Object.getOwnPropertyNames( r ) ).to.equal( [ 'own1' , 'own2' , 'nested' , 'nonEnum1' , 'nonEnum2' , 'nonEnum3' , 'nonEnumNested' , 'getter' , 'getterAndSetter' ] ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'own1' ) ).to.equal( { value: 'own1' , enumerable: true , writable: true , configurable: true } ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'own2' ) ).to.equal( { value: 'own2' , enumerable: true , writable: true , configurable: true } ) ;
		expect( r.nested ).to.be( o.nested ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'nested' ) ).to.equal( { value: o.nested , enumerable: true , writable: true , configurable: true } ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'nonEnum1' ) ).to.equal( { value: 'nonEnum1' , enumerable: false , writable: false , configurable: false } ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'nonEnum2' ) ).to.equal( { value: 'nonEnum2' , enumerable: false , writable: true , configurable: false } ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'nonEnum3' ) ).to.equal( { value: 'nonEnum3' , enumerable: false , writable: false , configurable: true } ) ;
		expect( r.nonEnumNested ).to.be( o.nonEnumNested ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'nonEnumNested' ) ).to.equal( { value: o.nonEnumNested , enumerable: false , writable: false , configurable: false } ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'getter' ) ).to.equal( { get: getter , set: undefined , enumerable: false , configurable: false } ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'getterAndSetter' ) ).to.equal( { get: getter , set: setter , enumerable: false , configurable: false } ) ;
		
		r = extend( { deep: true , own: true , nonEnum: true , descriptor: true } , {} , o ) ;
		
		expect( Object.getOwnPropertyNames( r ) ).to.equal( [ 'own1' , 'own2' , 'nested' , 'nonEnum1' , 'nonEnum2' , 'nonEnum3' , 'nonEnumNested' , 'getter' , 'getterAndSetter' ] ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'own1' ) ).to.equal( { value: 'own1' , enumerable: true , writable: true , configurable: true } ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'own2' ) ).to.equal( { value: 'own2' , enumerable: true , writable: true , configurable: true } ) ;
		expect( r.nested ).not.to.be( o.nested ) ;
		expect( r.nested ).to.equal( o.nested ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'nested' ) ).to.equal( { value: o.nested , enumerable: true , writable: true , configurable: true } ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'nonEnum1' ) ).to.equal( { value: 'nonEnum1' , enumerable: false , writable: false , configurable: false } ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'nonEnum2' ) ).to.equal( { value: 'nonEnum2' , enumerable: false , writable: true , configurable: false } ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'nonEnum3' ) ).to.equal( { value: 'nonEnum3' , enumerable: false , writable: false , configurable: true } ) ;
		expect( r.nonEnumNested ).not.to.be( o.nonEnumNested ) ;
		expect( r.nonEnumNested ).to.equal( o.nonEnumNested ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'nonEnumNested' ) ).to.equal( { value: o.nonEnumNested , enumerable: false , writable: false , configurable: false } ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'getter' ) ).to.equal( { get: getter , set: undefined , enumerable: false , configurable: false } ) ;
		expect( Object.getOwnPropertyDescriptor( r , 'getterAndSetter' ) ).to.equal( { get: getter , set: setter , enumerable: false , configurable: false } ) ;
	} ) ;
	
	it( "with the 'deep' option should extend a deep Object into another deep Object correctly" , () => {
		var copy ;
		
		copy = extend( { deep: true } , {} , input.subtree ) ;
		expect( extend( null , copy , input.anotherSubtree ) ).to.equal( {
			a : 'A' ,
			b : 2 ,
			subtree: {
				l : '1one' ,
				m : false ,
				n : 'nay'
			} ,
			c : 'plusplus' ,
			subtree2: {
				p : true ,
				q : [4,5,6] ,
				r : '2'
			} ,
			j : 'Djay' ,
			k : 'ok' ,
			o : 'mg'
		} ) ;
		
		copy = extend( { deep: true } , {} , input.subtree ) ;
		expect( extend( { deep: true } , copy , input.anotherSubtree ) ).to.equal( {
			a : 'A' ,
			b : 2 ,
			subtree: {
				d : 4 ,
				e : undefined ,
				f : 3.14 ,
				l : '1one' ,
				m : false ,
				n : 'nay'
			} ,
			c : 'plusplus' ,
			subtree2: {
				g : 6 ,
				h : [] ,
				i : 'iii',
				p : true ,
				q : [4,5,6] ,
				r : '2'
			} ,
			j : 'Djay' ,
			k : 'ok' ,
			o : 'mg'
		} ) ;
	} ) ;
	
	it( "with the 'proto' option and a null (or falsy) target, it should create and return a new Object with the prototype of the source Object" , () => {
		var e , o , proto ;
		
		proto = {
			proto1: 'proto1' ,
			proto2: 'proto2' ,
			hello: function() { console.log( "Hello!" ) ; }
		} ;
		
		o = Object.create( proto ) ;
		o.own1 = 'own1' ;
		o.own2 = 'own2' ;
		
		e = extend( { proto: true } , null , o ) ;
		
		expect( e ).not.to.be( o ) ;
		expect( e.__proto__ ).to.be( proto ) ;
		expect( e ).to.be.like( { own1: 'own1' , own2: 'own2' } ) ;
		expect( e.proto1 ).to.be( 'proto1' ) ;
		expect( e.proto2 ).to.be( 'proto2' ) ;
		expect( e.hello ).to.be.a( 'function' ) ;
	} ) ;
	
	it( "with the 'proto' option should change the prototype of each target properties for the prototype of the related source properties, if 'deep' is enabled it does so recursively" , () => {
		var e , o , proto1 , proto2 ;
		
		proto1 = {
			proto1: 'proto1' ,
			hello: function() { console.log( "Hello!" ) ; }
		} ;
		
		proto2 = {
			proto2: 'proto2' ,
			world: function() { console.log( "World!" ) ; }
		} ;
		
		o = {
			own1: 'own1' ,
			own2: 'own2' ,
			embed1: Object.create( proto1 , { a: { value: 'a' , enumerable: true } } ) ,
			embed2: Object.create( proto2 , { b: { value: 'b' , enumerable: true } } )
		} ;
		
		e = extend( { proto: true } , {} , o ) ;
		
		expect( e ).to.be.a.shallow.clone.of( o ) ;
		expect( e ).to.be.like( {
			own1: 'own1' ,
			own2: 'own2' ,
			embed1: { a: 'a' } ,
			embed2: { b: 'b' }
		} ) ;
		expect( e.embed1 ).to.be( o.embed1 ) ;
		expect( e.embed2 ).to.be( o.embed2 ) ;
		expect( e.embed1.proto1 ).to.be( 'proto1' ) ;
		expect( e.embed2.proto2 ).to.be( 'proto2' ) ;
		expect( e.embed1.hello ).to.be.a( 'function' ) ;
		expect( e.embed2.world ).to.be.a( 'function' ) ;
		
		
		e = extend( { proto: true, deep: true } , {} , o ) ;
		
		expect( e ).not.to.be( o ) ;
		expect( e ).to.be.like( {
			own1: 'own1' ,
			own2: 'own2' ,
			embed1: { a: 'a' } ,
			embed2: { b: 'b' }
		} ) ;
		expect( e.embed1 ).not.to.be( o.embed1 ) ;
		expect( e.embed2 ).not.to.be( o.embed2 ) ;
		expect( e.embed1.proto1 ).to.be( 'proto1' ) ;
		expect( e.embed2.proto2 ).to.be( 'proto2' ) ;
		expect( e.embed1.hello ).to.be.a( 'function' ) ;
		expect( e.embed2.world ).to.be.a( 'function' ) ;
	} ) ;
	
	it( "with 'nofunc' option should skip function" , () => {
		var e , o , proto ;
		
		proto = {
			proto1: 'proto1' ,
			proto2: 'proto2' ,
			hello: function() { console.log( "Hello..." ) ; }
		} ;
		
		o = Object.create( proto ) ;
		o.own1 = 'own1' ;
		o.world = function() { console.log( "world!!!" ) ; } ;
		o.own2 = 'own2' ;
		
		// default behaviour
		e = extend( { nofunc: true } , null , o ) ;
		expect( e ).not.to.be( o ) ;
		expect( e ).to.be.like( { own1: 'own1' , own2: 'own2' , proto1: 'proto1' , proto2: 'proto2' } ) ;
		
		// with 'own'
		e = extend( { nofunc: true , own: true } , null , o ) ;
		expect( e ).not.to.be( o ) ;
		expect( e ).to.be.like( { own1: 'own1' , own2: 'own2' } ) ;
		
		// with 'proto', function exists if there are in the prototype
		e = extend( { nofunc: true , proto: true } , null , o ) ;
		expect( e ).not.to.be( o ) ;
		expect( e.__proto__ ).to.be( proto ) ;
		expect( e ).to.be.like( { own1: 'own1' , own2: 'own2' } ) ;
		expect( e.proto1 ).to.be( 'proto1' ) ;
		expect( e.proto2 ).to.be( 'proto2' ) ;
		expect( e.hello ).to.be.a( 'function' ) ;
	} ) ;
	
	it( "with 'mask' option should only update existing properties in the target, it should not create new properties" , () => {
		var e , o ;
		
		e = {
			one: '1' ,
			two: 2 ,
			three: 'THREE'
		} ;
		
		o = {
			three: 3 ,
			four: '4'
		} ;
		
		extend( { mask: true } , e , o ) ;
		expect( e ).to.equal( { one: '1' , two: 2 , three: 3 } ) ;
		expect( o ).to.equal( { three: 3 , four: '4' } ) ;


		e = {
			one: '1' ,
			two: { sub: 2 } ,
			three: 'THREE'
		} ;
		
		o = {
			one: 'ONE' ,
			two: 'TWO' ,
			three: { sub: 3 }  ,
			four: '4'
		} ;
		
		extend( { deep: true , mask: true } , e , o ) ;
		expect( e ).to.equal( { one: 'ONE' , two: { sub: 2 } , three: 'THREE' } ) ;
		expect( o ).to.equal( { one: 'ONE' , two: 'TWO' , three: { sub: 3 } , four: '4' } ) ;


		e = {
			one: '1' ,
			two: { sub: 2 } ,
			three: 'THREE'
		} ;
		
		o = {
			two: { sub: 'TWO' } ,
		} ;
		
		extend( { deep: true , mask: true } , e , o ) ;
		expect( e ).to.equal( { one: '1' , two: { sub: 'TWO' } , three: 'THREE' } ) ;
		expect( o ).to.equal( { two: { sub: 'TWO' } } ) ;
	} ) ;

	it( "with 'mask' option as a number" , () => {
		var e , o , r ;
		
		e = {
			one: '1' ,
			two: 2 ,
			three: 'THREE'
		} ;
		
		o = {
			three: 3 ,
			four: '4'
		} ;
		
		r = extend( { mask: true } , {} , e , o ) ;
		expect( r ).to.equal( {} ) ;
		
		r = extend( { mask: 1 } , {} , e , o ) ;
		expect( r ).to.equal( {} ) ;
		
		r = extend( { mask: 2 } , {} , e , o ) ;
		expect( r ).to.equal( { one: '1' , two: 2 , three: 3 } ) ;
	} ) ;

	it( "with 'preserve' option should not overwrite existing properties in the target" , () => {
		var e , o ;
		
		e = {
			one: '1' ,
			two: 2 ,
			three: 'THREE'
		} ;
		
		o = {
			three: 3 ,
			four: '4'
		} ;
		
		extend( { deep: true , preserve: true } , e , o ) ;
		expect( e ).to.equal( { one: '1' , two: 2 , three: 'THREE' , four: '4' } ) ;
		expect( o ).to.equal( { three: 3 , four: '4' } ) ;
		

		e = {
			one: '1' ,
			two: { sub: 2 } ,
			three: 'THREE'
		} ;
		
		o = {
			two: 'TWO' ,			// Can't replace, even if base is an object
			three: { sub: 3 }  ,	// Can't replace, even by an object
			four: '4' ,
			five: { sub: 'FIVE' }	// It's a new key, so it should be added
		} ;
		
		extend( { deep: true , preserve: true } , e , o ) ;
		expect( e ).to.equal( { one: '1' , two: { sub: 2 } , three: 'THREE' , four: '4' , five: { sub: 'FIVE' } } ) ;
		expect( o ).to.equal( { two: 'TWO' , three: { sub: 3 } , four: '4' , five: { sub: 'FIVE' } } ) ;
	} ) ;
	
	it( "with 'move' option should move source properties to target properties, i.e. delete them form the source" , () => {
		var e , o ;
		
		e = {
			one: '1' ,
			two: 2 ,
			three: 'THREE'
		} ;
		
		o = {
			three: 3 ,
			four: '4'
		} ;
		
		extend( { move: true } , e , o ) ;
		expect( e ).to.equal( { one: '1' , two: 2 , three: 3 , four: '4' } ) ;
		expect( o ).to.equal( {} ) ;
	} ) ;
	
	it( "with 'preserve' and 'move' option should not overwrite existing properties in the target, so it should not move/delete them from the source object" , () => {
		var e , o ;
		
		e = {
			one: '1' ,
			two: 2 ,
			three: 'THREE'
		} ;
		
		o = {
			three: 3 ,
			four: '4'
		} ;
		
		extend( { preserve: true , move: true } , e , o ) ;
		expect( e ).to.equal( { one: '1' , two: 2 , three: 'THREE' , four: '4' } ) ;
		expect( o ).to.equal( { three: 3 } ) ;
	} ) ;
	
	it( "with 'inherit' option should inherit rather than extend: each source property create a new Object or mutate existing Object into the related target property, using itself as the prototype" , () => {
		var e , o ;
		
		o = {
			three: 3 ,
			four: '4' ,
			subtree: {
				five: 'FIVE' ,
				six: 6
			}
		} ;
		
		e = {} ;
		
		extend( { inherit: true } , e , o ) ;
		
		expect( e.__proto__ ).to.be( o ) ;
		expect( e ).to.be.like( {} ) ;
		expect( e.three ).to.be( 3 ) ;
		expect( e.four ).to.be( '4' ) ;
		expect( e.subtree ).to.be.a.shallow.clone.of( o.subtree ) ;
		
		
		e = {
			one: '1' ,
			two: 2 ,
			three: 'THREE' ,
		} ;
		
		extend( { inherit: true } , e , o ) ;
		
		expect( e.__proto__ ).to.be( o ) ;
		expect( e ).to.be.like( { one: '1' , two: 2 , three: 'THREE' } ) ;
		expect( e.three ).to.be( 'THREE' ) ;
		expect( e.four ).to.be( '4' ) ;
		expect( e.subtree ).to.be.a.shallow.clone.of( o.subtree ) ;
		expect( e.subtree ).to.be.like( { five: 'FIVE' , six: 6 } ) ;
		
		
		e = {
			one: '1' ,
			two: 2 ,
			three: 'THREE' ,
			subtree: {
				six: 'SIX' ,
				seven: 7
			}
		} ;
		
		extend( { inherit: true } , e , o ) ;
		
		expect( e.__proto__ ).to.be( o ) ;	
		expect( e ).to.be.like( { one: '1' , two: 2 , three: 'THREE' , subtree: { six: 'SIX' , seven: 7 } } ) ;
		expect( e.three ).to.be( 'THREE' ) ;
		expect( e.four ).to.be( '4' ) ;
		expect( e.subtree ).to.be.like( { six: 'SIX' , seven: 7 } ) ;
		expect( e.subtree.five ).to.be( undefined ) ;
	} ) ;
	
	it( "with 'inherit' and 'deep' option should inherit recursively" , () => {
		var e , o ;
		
		o = {
			three: 3 ,
			four: '4' ,
			subtree: {
				five: 'FIVE' ,
				six: 6
			}
		} ;
		
		e = {} ;
		
		extend( { inherit: true , deep: true } , e , o ) ;
		
		expect( e.__proto__ ).to.be( o ) ;	
		expect( e ).to.be.like( { subtree: {} } ) ;
		expect( e.three ).to.be( 3 ) ;
		expect( e.four ).to.be( '4' ) ;
		expect( e.subtree.__proto__ ).to.be( o.subtree ) ;	
		expect( e.subtree.five ).to.be( 'FIVE' ) ;
		expect( e.subtree.six ).to.be( 6 ) ;
		
		
		e = {
			one: '1' ,
			two: 2 ,
			three: 'THREE' ,
		} ;
		
		extend( { inherit: true , deep: true } , e , o ) ;
		
		expect( e.__proto__ ).to.be( o ) ;	
		expect( e ).to.be.like( { one: '1' , two: 2 , three: 'THREE' , subtree: {} } ) ;
		expect( e.three ).to.be( 'THREE' ) ;
		expect( e.four ).to.be( '4' ) ;
		expect( e.subtree.__proto__ ).to.be( o.subtree ) ;	
		expect( e.subtree ).to.be.like( {} ) ;
		expect( e.subtree.five ).to.be( 'FIVE' ) ;
		expect( e.subtree.six ).to.be( 6 ) ;
		
		
		e = {
			one: '1' ,
			two: 2 ,
			three: 'THREE' ,
			subtree: {
				six: 'SIX' ,
				seven: 7
			}
		} ;
		
		extend( { inherit: true , deep: true } , e , o ) ;
		
		expect( e.__proto__ ).to.be( o ) ;	
		expect( e ).to.be.like( { one: '1' , two: 2 , three: 'THREE' , subtree: { six: 'SIX' , seven: 7 } } ) ;
		expect( e.three ).to.be( 'THREE' ) ;
		expect( e.four ).to.be( '4' ) ;
		expect( e.subtree.__proto__ ).to.be( o.subtree ) ;	
		expect( e.subtree ).to.be.like( { six: 'SIX' , seven: 7 } ) ;
		expect( e.subtree.five ).to.be( 'FIVE' ) ;
	} ) ;
	
	it( "with 'flat' option" , () => {
		var e , o ;
		
		o = {
			three: 3 ,
			four: '4' ,
			subtree: {
				five: 'FIVE' ,
				six: 6 ,
				subsubtree: {
					subsubsubtree: { one: 'ONE' } ,
					seven: 'seven'
				} ,
				emptysubtree: {}
			} ,
			eight: 8 ,
			anothersubtree: {
				nine: '9'
			}
		} ;
		
		e = extend( { flat: true } , {} , o ) ;
		expect( e ).to.equal( {
			three: 3 ,
			four: '4' ,
			'subtree.five': 'FIVE' ,
			'subtree.six': 6 ,
			'subtree.subsubtree.seven': 'seven' ,
			'subtree.subsubtree.subsubsubtree.one': 'ONE' ,
			eight: 8 ,
			'anothersubtree.nine': '9'
		} ) ;
		
		e = extend( { flat: '/' } , {} , o ) ;
		expect( e ).to.equal( {
			three: 3 ,
			four: '4' ,
			'subtree/five': 'FIVE' ,
			'subtree/six': 6 ,
			'subtree/subsubtree/seven': 'seven' ,
			'subtree/subsubtree/subsubsubtree/one': 'ONE' ,
			eight: 8 ,
			'anothersubtree/nine': '9'
		} ) ;
	} ) ;
	
	it( "with 'unflat' option" , () => {
		var e , o ;
		
		o = {
			three: 3 ,
			four: '4' ,
			'subtree.five': 'FIVE' ,
			'subtree.six': 6 ,
			'subtree.subsubtree.seven': 'seven' ,
			'subtree.subsubtree.subsubsubtree.one': 'ONE' ,
			eight: 8 ,
			'anothersubtree.nine': '9'
		} ;
		
		e = extend( { unflat: true } , {} , o ) ;
		expect( e ).to.equal( {
			three: 3 ,
			four: '4' ,
			subtree: {
				five: 'FIVE' ,
				six: 6 ,
				subsubtree: {
					subsubsubtree: { one: 'ONE' } ,
					seven: 'seven'
				}
			} ,
			eight: 8 ,
			anothersubtree: {
				nine: '9'
			}
		} ) ;
		
		o = {
			three: 3 ,
			four: '4' ,
			'subtree/five': 'FIVE' ,
			'subtree/six': 6 ,
			'subtree/subsubtree/seven': 'seven' ,
			'subtree/subsubtree/subsubsubtree/one': 'ONE' ,
			eight: 8 ,
			'anothersubtree/nine': '9'
		} ;
		
		e = extend( { unflat: '/' } , {} , o ) ;
		expect( e ).to.equal( {
			three: 3 ,
			four: '4' ,
			subtree: {
				five: 'FIVE' ,
				six: 6 ,
				subsubtree: {
					subsubsubtree: { one: 'ONE' } ,
					seven: 'seven'
				}
			} ,
			eight: 8 ,
			anothersubtree: {
				nine: '9'
			}
		} ) ;
	} ) ;
	
	it( "with 'deep' option as an Array/Set of eligible prototype for deep copy" , () => {
		var o , e , buf = Buffer.from( "My buffer" ) ;
		
		o = {
			one: '1' ,
			buf: buf ,
			subtree: {
				two: 2 ,
				three: 'THREE'
			}
		} ;
		
		e = extend( { deep: new Set( [ Object.prototype ] ) } , {} , o ) ;
		
		o.subtree.three = 3 ;
		buf[ 0 ] = 'm'.charCodeAt() ;
		
		expect( e.buf ).to.be.a( Buffer ) ;
		expect( e.buf.toString() ).to.be( "my buffer" ) ;
		expect( e.buf ).to.be( buf ) ;
		
		expect( e ).to.equal( {
			one: '1' ,
			buf: buf ,
			subtree: {
				two: 2 ,
				three: 'THREE'
			}
		} ) ;
		
		
		e = extend( { deep: [ Object.prototype ] } , {} , o ) ;
		
		o.subtree.three = 'three' ;
		buf[ 0 ] = 'y'.charCodeAt() ;
		
		expect( e.buf ).to.be.a( Buffer ) ;
		expect( e.buf.toString() ).to.be( "yy buffer" ) ;
		expect( e.buf ).to.be( buf ) ;
		
		expect( e ).to.equal( {
			one: '1' ,
			buf: buf ,
			subtree: {
				two: 2 ,
				three: 3
			}
		} ) ;
		
	} ) ;
	
	it( "with the 'immutables' options, an Array/Set of prototypes of object that are immutables, it should not deep-copy those object and treat them as opaque direct values" , () => {
		var o , e , buf = Buffer.from( "My buffer" ) ;
		
		o = {
			one: '1' ,
			buf: buf ,
			subtree: {
				two: 2 ,
				three: 'THREE'
			}
		} ;
		
		e = extend( { deep: true, immutables: new Set( [ Buffer.prototype ] ) } , {} , o ) ;
		
		o.subtree.three = 3 ;
		buf[ 0 ] = 'm'.charCodeAt() ;
		
		expect( e.buf ).to.be.a( Buffer ) ;
		expect( e.buf.toString() ).to.be( "my buffer" ) ;
		expect( e.buf ).to.be( buf ) ;
		
		expect( e ).to.equal( {
			one: '1' ,
			buf: buf ,
			subtree: {
				two: 2 ,
				three: 'THREE'
			}
		} ) ;
		
		
		e = extend( { deep: true, immutables: [ Buffer.prototype ] } , {} , o ) ;
		
		o.subtree.three = 'three' ;
		buf[ 0 ] = 'y'.charCodeAt() ;
		
		expect( e.buf ).to.be.a( Buffer ) ;
		expect( e.buf.toString() ).to.be( "yy buffer" ) ;
		expect( e.buf ).to.be( buf ) ;
		
		expect( e ).to.equal( {
			one: '1' ,
			buf: buf ,
			subtree: {
				two: 2 ,
				three: 3
			}
		} ) ;
	} ) ;
	
	it( "circular references test" , () => {
		var c , o = {
			a: 'a',
			sub: {
				b: 'b'
			},
			sub2: {
				c: 'c'
			}
		} ;
		
		o.loop = o ;
		o.sub.loop = o ;
		o.subcopy = o.sub ;
		o.sub.link = o.sub2 ;
		o.sub2.link = o.sub ;
		
		
		try {
			c = extend( { deep: true } , null , o ) ;
			throw new Error( 'Should throw an error: max depth reached' ) ;
		}
		catch ( error ) {
		}
		
		c = extend( { deep: true , circular: true } , null , o ) ;
		
		expect( c.loop ).to.be( c ) ;
		expect( c.sub ).to.be( c.subcopy ) ;
		expect( c.sub.loop ).to.be( c ) ;
		expect( c.subcopy.loop ).to.be( c ) ;
		expect( c.sub.link ).to.be( c.sub2 ) ;
		expect( c.sub2.link ).to.be( c.sub ) ;
	} ) ;
	
	it( "with 'skipRoot' option" ) ;
} ) ;


