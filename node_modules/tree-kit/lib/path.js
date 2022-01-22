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



const treePath = {} ;
module.exports = treePath ;



const PROTO_POLLUTION_MESSAGE = 'This would cause prototype pollution' ;



treePath.op = function( type , object , path , value ) {
	var i , parts , last , pointer , key , isArray = false , pathArrayMode = false , isGenericSet , canBeEmpty = true ;

	if ( ! object || typeof object !== 'object' ) { return ; }

	if ( typeof path === 'string' ) {
		// Split the path into parts
		if ( path ) { parts = path.match( /([.#[\]]|[^.#[\]]+)/g ) ; }
		else { parts = [ '' ] ; }

		if ( parts[ 0 ] === '.' ) { parts.unshift( '' ) ; }
		if ( parts[ parts.length - 1 ] === '.' ) { parts.push( '' ) ; }
	}
	else if ( Array.isArray( path ) ) {
		parts = path ;
		pathArrayMode = true ;
		/*
		for ( i = 0 ; i < parts.length ; i ++ ) {
			if ( typeof parts[ i ] !== 'string' || typeof parts[ i ] !== 'number' ) { parts[ i ] = '' + parts[ i ] ; }
		}
		//*/
	}
	else {
		throw new TypeError( '[tree.path] .' + type + '(): the path argument should be a string or an array' ) ;
	}

	switch ( type ) {
		case 'get' :
		case 'delete' :
			isGenericSet = false ;
			break ;
		case 'set' :
		case 'define' :
		case 'inc' :
		case 'dec' :
		case 'append' :
		case 'prepend' :
		case 'concat' :
		case 'insert' :
		case 'autoPush' :
			isGenericSet = true ;
			break ;
		default :
			throw new TypeError( "[tree.path] .op(): wrong type of operation '" + type + "'" ) ;
	}

	//console.log( parts ) ;
	// The pointer start at the object's root
	pointer = object ;

	last = parts.length - 1 ;

	for ( i = 0 ; i <= last ; i ++ ) {
		if ( pathArrayMode ) {
			if ( key === undefined ) {
				key = parts[ i ] ;
				if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
				continue ;
			}

			if ( typeof pointer[ key ] === 'function' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
			if ( ! pointer[ key ] || typeof pointer[ key ] !== 'object' ) {
				if ( ! isGenericSet ) { return undefined ; }
				pointer[ key ] = {} ;
			}

			pointer = pointer[ key ] ;
			key = parts[ i ] ;
			if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
			continue ;
		}
		else if ( parts[ i ] === '.' ) {
			isArray = false ;

			if ( key === undefined ) {
				if ( ! canBeEmpty ) {
					canBeEmpty = true ;
					continue ;
				}

				key = '' ;
			}

			if ( typeof pointer[ key ] === 'function' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
			if ( ! pointer[ key ] || typeof pointer[ key ] !== 'object' ) {
				if ( ! isGenericSet ) { return undefined ; }
				pointer[ key ] = {} ;
			}

			pointer = pointer[ key ] ;
			canBeEmpty = true ;

			continue ;
		}
		else if ( parts[ i ] === '#' || parts[ i ] === '[' ) {
			isArray = true ;
			canBeEmpty = false ;

			if ( key === undefined ) {
				// The root element cannot be altered, we are in trouble if an array is expected but we have only a regular object.
				if ( ! Array.isArray( pointer ) ) { return undefined ; }
				continue ;
			}

			if ( typeof pointer[ key ] === 'function' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
			if ( ! pointer[ key ] || ! Array.isArray( pointer[ key ] ) ) {
				if ( ! isGenericSet ) { return undefined ; }
				pointer[ key ] = [] ;
			}

			pointer = pointer[ key ] ;

			continue ;
		}
		else if ( parts[ i ] === ']' ) {
			// Closing bracket: do nothing
			canBeEmpty = false ;
			continue ;
		}

		canBeEmpty = false ;

		if ( ! isArray ) {
			key = parts[ i ] ;
			if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
			continue ;
		}

		switch ( parts[ i ] ) {
			case 'length' :
				key = 'length' ;
				break ;

			// Pseudo-key
			case 'first' :
				key = 0 ;
				break ;
			case 'last' :
				key = pointer.length - 1 ;
				if ( key < 0 ) { key = 0 ; }
				break ;
			case 'next' :
				if ( ! isGenericSet ) { return undefined ; }
				key = pointer.length ;
				break ;
			case 'insert' :
				if ( ! isGenericSet ) { return undefined ; }
				pointer.unshift( undefined ) ;
				key = 0 ;
				break ;

			// default = number
			default :
				// Convert the string key to a numerical index
				key = parseInt( parts[ i ] , 10 ) ;
		}
	}

	switch ( type ) {
		case 'get' :
			return pointer[ key ] ;
		case 'delete' :
			if ( isArray && typeof key === 'number' ) { pointer.splice( key , 1 ) ; }
			else { delete pointer[ key ] ; }
			return ;
		case 'set' :
			pointer[ key ] = value ;
			return pointer[ key ] ;
		case 'define' :
			// define: set only if it doesn't exist
			if ( ! ( key in pointer ) ) { pointer[ key ] = value ; }
			return pointer[ key ] ;
		case 'inc' :
			if ( typeof pointer[ key ] === 'number' ) { pointer[ key ] ++ ; }
			else if ( ! pointer[ key ] || typeof pointer[ key ] !== 'object' ) { pointer[ key ] = 1 ; }
			return pointer[ key ] ;
		case 'dec' :
			if ( typeof pointer[ key ] === 'number' ) { pointer[ key ] -- ; }
			else if ( ! pointer[ key ] || typeof pointer[ key ] !== 'object' ) { pointer[ key ] = -1 ; }
			return pointer[ key ] ;
		case 'append' :
			if ( ! pointer[ key ] ) { pointer[ key ] = [ value ] ; }
			else if ( Array.isArray( pointer[ key ] ) ) { pointer[ key ].push( value ) ; }
			//else ? do nothing???
			return pointer[ key ] ;
		case 'prepend' :
			if ( ! pointer[ key ] ) { pointer[ key ] = [ value ] ; }
			else if ( Array.isArray( pointer[ key ] ) ) { pointer[ key ].unshift( value ) ; }
			//else ? do nothing???
			return pointer[ key ] ;
		case 'concat' :
			if ( ! pointer[ key ] ) { pointer[ key ] = value ; }
			else if ( Array.isArray( pointer[ key ] ) && Array.isArray( value ) ) {
				pointer[ key ] = pointer[ key ].concat( value ) ;
			}
			//else ? do nothing???
			return pointer[ key ] ;
		case 'insert' :
			if ( ! pointer[ key ] ) { pointer[ key ] = value ; }
			else if ( Array.isArray( pointer[ key ] ) && Array.isArray( value ) ) {
				pointer[ key ] = value.concat( pointer[ key ] ) ;
			}
			//else ? do nothing???
			return pointer[ key ] ;
		case 'autoPush' :
			if ( pointer[ key ] === undefined ) { pointer[ key ] = value ; }
			else if ( Array.isArray( pointer[ key ] ) ) { pointer[ key ].push( value ) ; }
			else { pointer[ key ] = [ pointer[ key ] , value ] ; }
			return pointer[ key ] ;
	}
} ;



// get, set and delete use the same op() function
treePath.get = treePath.op.bind( undefined , 'get' ) ;
treePath.delete = treePath.op.bind( undefined , 'delete' ) ;
treePath.set = treePath.op.bind( undefined , 'set' ) ;
treePath.define = treePath.op.bind( undefined , 'define' ) ;
treePath.inc = treePath.op.bind( undefined , 'inc' ) ;
treePath.dec = treePath.op.bind( undefined , 'dec' ) ;
treePath.append = treePath.op.bind( undefined , 'append' ) ;
treePath.prepend = treePath.op.bind( undefined , 'prepend' ) ;
treePath.concat = treePath.op.bind( undefined , 'concat' ) ;
treePath.insert = treePath.op.bind( undefined , 'insert' ) ;
treePath.autoPush = treePath.op.bind( undefined , 'autoPush' ) ;



// Prototype used for object creation, so they can be created with Object.create( tree.path.prototype )
treePath.prototype = {
	get: function( path ) { return treePath.get( this , path ) ; } ,
	delete: function( path ) { return treePath.delete( this , path ) ; } ,
	set: function( path , value ) { return treePath.set( this , path , value ) ; } ,
	define: function( path , value ) { return treePath.define( this , path , value ) ; } ,
	inc: function( path , value ) { return treePath.inc( this , path , value ) ; } ,
	dec: function( path , value ) { return treePath.dec( this , path , value ) ; } ,
	append: function( path , value ) { return treePath.append( this , path , value ) ; } ,
	prepend: function( path , value ) { return treePath.prepend( this , path , value ) ; } ,
	concat: function( path , value ) { return treePath.concat( this , path , value ) ; } ,
	insert: function( path , value ) { return treePath.insert( this , path , value ) ; } ,
	autoPush: function( path , value ) { return treePath.autoPush( this , path , value ) ; }
} ;



// Upgrade an object so it can support get, set and delete at its root
treePath.upgrade = function( object ) {
	Object.defineProperties( object , {
		get: { value: treePath.op.bind( undefined , 'get' , object ) } ,
		delete: { value: treePath.op.bind( undefined , 'delete' , object ) } ,
		set: { value: treePath.op.bind( undefined , 'set' , object ) } ,
		define: { value: treePath.op.bind( undefined , 'define' , object ) } ,
		inc: { value: treePath.op.bind( undefined , 'inc' , object ) } ,
		dec: { value: treePath.op.bind( undefined , 'dec' , object ) } ,
		append: { value: treePath.op.bind( undefined , 'append' , object ) } ,
		prepend: { value: treePath.op.bind( undefined , 'prepend' , object ) } ,
		concat: { value: treePath.op.bind( undefined , 'concat' , object ) } ,
		insert: { value: treePath.op.bind( undefined , 'insert' , object ) } ,
		autoPush: { value: treePath.op.bind( undefined , 'autoPush' , object ) }
	} ) ;
} ;

