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



/*
	== Diff function ==
*/

function diff( left , right , options ) {
	var i , key , keyPath ,
		leftKeys , rightKeys , leftTypeof , rightTypeof ,
		depth , diffObject , length , arrayMode ;

	leftTypeof = typeof left ;
	rightTypeof = typeof right ;

	if (
		! left || ( leftTypeof !== 'object' && leftTypeof !== 'function' ) ||
		! right || ( rightTypeof !== 'object' && rightTypeof !== 'function' )
	) {
		throw new Error( '[tree] diff() needs objects as argument #0 and #1' ) ;
	}

	if ( ! options || typeof options !== 'object' ) { options = {} ; }

	depth = options.depth || 0 ;

	// Things applied only for the root, not for recursive call
	if ( ! depth ) {
		options.diffObject = {} ;
		if ( ! options.path ) { options.path = '' ; }
		if ( ! options.pathSeparator ) { options.pathSeparator = '.' ; }
	}

	diffObject = options.diffObject ;


	// Left part
	if ( Array.isArray( left ) ) {
		arrayMode = true ;
		length = left.length ;
	}
	else {
		arrayMode = false ;
		leftKeys = Object.keys( left ) ;
		length = leftKeys.length ;
	}

	for ( i = 0 ; i < length ; i ++ ) {
		key = arrayMode ? i : leftKeys[ i ] ;
		keyPath = options.path + options.pathSeparator + key ;
		//console.log( 'L keyPath:' , keyPath ) ;

		if ( ! Object.prototype.hasOwnProperty.call( right , key ) ) {
			diffObject[ keyPath ] = { path: keyPath , message: 'does not exist in right-hand side' } ;
			continue ;
		}

		leftTypeof = typeof left[ key ] ;
		rightTypeof = typeof right[ key ] ;

		if ( leftTypeof !== rightTypeof ) {
			diffObject[ keyPath ] = { path: keyPath , message: 'different typeof: ' + leftTypeof + ' - ' + rightTypeof } ;
			continue ;
		}

		if ( leftTypeof === 'object' || leftTypeof === 'function' ) {
			// Cleanup the 'null is an object' mess
			if ( ! left[ key ] ) {
				if ( right[ key ] ) { diffObject[ keyPath ] = { path: keyPath , message: 'different type: null - Object' } ; }
				continue ;
			}

			if ( ! right[ key ] ) {
				diffObject[ keyPath ] = { path: keyPath , message: 'different type: Object - null' } ;
				continue ;
			}

			if ( Array.isArray( left[ key ] ) && ! Array.isArray( right[ key ] ) ) {
				diffObject[ keyPath ] = { path: keyPath , message: 'different type: Array - Object' } ;
				continue ;
			}

			if ( ! Array.isArray( left[ key ] ) && Array.isArray( right[ key ] ) ) {
				diffObject[ keyPath ] = { path: keyPath , message: 'different type: Object - Array' } ;
				continue ;
			}

			diff( left[ key ] , right[ key ] , {
				path: keyPath , pathSeparator: options.pathSeparator , depth: depth + 1 , diffObject: diffObject
			} ) ;
			continue ;
		}

		if ( left[ key ] !== right[ key ] ) {
			diffObject[ keyPath ] = { path: keyPath , message: 'different value: ' + left[ key ] + ' - ' + right[ key ] } ;
			continue ;
		}
	}


	// Right part
	if ( Array.isArray( right ) ) {
		arrayMode = true ;
		length = right.length ;
	}
	else {
		arrayMode = false ;
		rightKeys = Object.keys( right ) ;
		length = rightKeys.length ;
	}

	for ( i = 0 ; i < length ; i ++ ) {
		key = arrayMode ? i : rightKeys[ i ] ;
		keyPath = options.path + options.pathSeparator + key ;
		//console.log( 'R keyPath:' , keyPath ) ;

		if ( ! Object.prototype.hasOwnProperty.call( left , key ) ) {
			diffObject[ keyPath ] = { path: keyPath , message: 'does not exist in left-hand side' } ;
			continue ;
		}
	}

	return Object.keys( diffObject ).length ? diffObject : null ;
}

exports.diff = diff ;

