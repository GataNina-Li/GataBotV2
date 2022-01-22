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



const dotPath = {} ;
module.exports = dotPath ;



const EMPTY_PATH = [] ;
const PROTO_POLLUTION_MESSAGE = 'This would cause prototype pollution' ;



function toPathArray( path ) {
	if ( Array.isArray( path ) ) {
		/*
		let i , iMax = path.length ;
		for ( i = 0 ; i < iMax ; i ++ ) {
			if ( typeof path[ i ] !== 'string' || typeof path[ i ] !== 'number' ) { path[ i ] = '' + path[ i ] ; }
		}
		//*/
		return path ;
	}

	if ( ! path ) { return EMPTY_PATH ; }
	if ( typeof path === 'string' ) { return path.split( '.' ) ; }

	throw new TypeError( '[tree.dotPath]: the path argument should be a string or an array' ) ;
}



// Walk the tree using the path array.
function walk( object , pathArray , maxOffset = 0 ) {
	var i , iMax , key ,
		pointer = object ;

	for ( i = 0 , iMax = pathArray.length + maxOffset ; i < iMax ; i ++ ) {
		key = pathArray[ i ] ;

		if ( typeof key === 'object' || key === '__proto__' || typeof pointer === 'function' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
		if ( ! pointer || typeof pointer !== 'object' ) { return undefined ; }

		pointer = pointer[ key ] ;
	}

	return pointer ;
}



// Walk the tree, create missing element: pave the path up to before the last part of the path.
// Return that before-the-last element.
// Object MUST be an object! no check are performed for the first step!
function pave( object , pathArray ) {
	var i , iMax , key ,
		pointer = object ;

	for ( i = 0 , iMax = pathArray.length - 1 ; i < iMax ; i ++ ) {
		key = pathArray[ i ] ;

		if ( typeof key === 'object' || key === '__proto__' || typeof pointer[ key ] === 'function' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }
		if ( ! pointer[ key ] || typeof pointer[ key ] !== 'object' ) { pointer[ key ] = {} ; }

		pointer = pointer[ key ] ;
	}

	return pointer ;
}



dotPath.get = ( object , path ) => walk( object , toPathArray( path ) ) ;



dotPath.set = ( object , path , value ) => {
	if ( ! object || typeof object !== 'object' ) {
		// Throw?
		return undefined ;
	}

	var pathArray = toPathArray( path ) ,
		key = pathArray[ pathArray.length - 1 ] ;

	if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }

	var pointer = pave( object , pathArray ) ;

	pointer[ key ] = value ;

	return value ;
} ;



dotPath.define = ( object , path , value ) => {
	if ( ! object || typeof object !== 'object' ) {
		// Throw?
		return undefined ;
	}

	var pathArray = toPathArray( path ) ,
		key = pathArray[ pathArray.length - 1 ] ;

	if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }

	var pointer = pave( object , pathArray ) ;

	if ( ! ( key in pointer ) ) { pointer[ key ] = value ; }

	return value ;
} ;



dotPath.inc = ( object , path , value ) => {
	if ( ! object || typeof object !== 'object' ) {
		// Throw?
		return undefined ;
	}

	var pathArray = toPathArray( path ) ,
		key = pathArray[ pathArray.length - 1 ] ;

	if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }

	var pointer = pave( object , pathArray ) ;

	if ( typeof pointer[ key ] === 'number' ) { pointer[ key ] ++ ; }
	else if ( ! pointer[ key ] || typeof pointer[ key ] !== 'object' ) { pointer[ key ] = 1 ; }

	return value ;
} ;



dotPath.dec = ( object , path , value ) => {
	if ( ! object || typeof object !== 'object' ) {
		// Throw?
		return undefined ;
	}

	var pathArray = toPathArray( path ) ,
		key = pathArray[ pathArray.length - 1 ] ;

	if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }

	var pointer = pave( object , pathArray ) ;

	if ( typeof pointer[ key ] === 'number' ) { pointer[ key ] -- ; }
	else if ( ! pointer[ key ] || typeof pointer[ key ] !== 'object' ) { pointer[ key ] = -1 ; }

	return value ;
} ;



dotPath.concat = ( object , path , value ) => {
	if ( ! object || typeof object !== 'object' ) {
		// Throw?
		return undefined ;
	}

	var pathArray = toPathArray( path ) ,
		key = pathArray[ pathArray.length - 1 ] ;

	if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }

	var pointer = pave( object , pathArray ) ;

	if ( ! pointer[ key ] ) { pointer[ key ] = value ; }
	else if ( Array.isArray( pointer[ key ] ) && Array.isArray( value ) ) {
		pointer[ key ] = pointer[ key ].concat( value ) ;
	}
	//else ? do nothing???

	return value ;
} ;



dotPath.insert = ( object , path , value ) => {
	if ( ! object || typeof object !== 'object' ) {
		// Throw?
		return undefined ;
	}

	var pathArray = toPathArray( path ) ,
		key = pathArray[ pathArray.length - 1 ] ;

	if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }

	var pointer = pave( object , pathArray ) ;

	if ( ! pointer[ key ] ) { pointer[ key ] = value ; }
	else if ( Array.isArray( pointer[ key ] ) && Array.isArray( value ) ) {
		pointer[ key ] = value.concat( pointer[ key ] ) ;
	}
	//else ? do nothing???

	return value ;
} ;



dotPath.delete = ( object , path ) => {
	var pathArray = toPathArray( path ) ,
		key = pathArray[ pathArray.length - 1 ] ;

	if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }

	var pointer = walk( object , pathArray , -1 ) ;

	if ( ! pointer || typeof pointer !== 'object' ) { return false ; }

	return delete pointer[ key ] ;
} ;



dotPath.autoPush = ( object , path , value ) => {
	if ( ! object || typeof object !== 'object' ) {
		// Throw?
		return undefined ;
	}

	var pathArray = toPathArray( path ) ,
		key = pathArray[ pathArray.length - 1 ] ;

	if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }

	var pointer = pave( object , pathArray ) ;

	if ( pointer[ key ] === undefined ) { pointer[ key ] = value ; }
	else if ( Array.isArray( pointer[ key ] ) ) { pointer[ key ].push( value ) ; }
	else { pointer[ key ] = [ pointer[ key ] , value ] ; }

	return pointer[ key ] ;
} ;



dotPath.append = ( object , path , value ) => {
	if ( ! object || typeof object !== 'object' ) {
		// Throw?
		return undefined ;
	}

	var pathArray = toPathArray( path ) ,
		key = pathArray[ pathArray.length - 1 ] ;

	if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }

	var pointer = pave( object , pathArray ) ;

	if ( ! pointer[ key ] ) { pointer[ key ] = [ value ] ; }
	else if ( Array.isArray( pointer[ key ] ) ) { pointer[ key ].push( value ) ; }
	//else ? do nothing???

	return pointer[ key ] ;
} ;



dotPath.prepend = ( object , path , value ) => {
	if ( ! object || typeof object !== 'object' ) {
		// Throw?
		return undefined ;
	}

	var pathArray = toPathArray( path ) ,
		key = pathArray[ pathArray.length - 1 ] ;

	if ( typeof key === 'object' || key === '__proto__' ) { throw new Error( PROTO_POLLUTION_MESSAGE ) ; }

	var pointer = pave( object , pathArray ) ;

	if ( ! pointer[ key ] ) { pointer[ key ] = [ value ] ; }
	else if ( Array.isArray( pointer[ key ] ) ) { pointer[ key ].unshift( value ) ; }
	//else ? do nothing???

	return pointer[ key ] ;
} ;

