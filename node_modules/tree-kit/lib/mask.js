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



const tree = require( './tree.js' ) ;
const util = require( 'util' ) ;



// Create and export
const masklib = {} ;
module.exports = masklib ;



/*
	== Mask-family class ==

	Recursively select values in the input object if the same path in the mask object is set.
*/

/*
	TODO:
	- negative mask
	- constraint check
	- Maskable object, like in csk-php
*/

masklib.Mask = function Mask() {
	throw new Error( 'Cannot create a tree.Mask() directly' ) ;
} ;



const maskDefaultOptions = {
	clone: false ,
	path: '<object>' ,
	pathSeparator: '.'
} ;



/*
	options:
		clone: the output clone the input rather than reference it
		pathSeperator: when expressing path, this is the separator
		leaf: a callback to exec for each mask leaf
		node? a callback to exec for each mask node
*/
masklib.createMask = function createMask( maskArgument , options ) {
	if ( maskArgument === null || typeof maskArgument !== 'object' ) {
		throw new TypeError( '[tree] .createMask() : Argument #1 should be an object' ) ;
	}

	if ( options !== null && typeof options === 'object' ) { options = tree.extend( null , {} , maskDefaultOptions , options ) ; }
	else { options = maskDefaultOptions ; }

	var mask = Object.create( masklib.Mask.prototype , {
		__options__: { value: options , writable: true  }
	} ) ;

	tree.extend( null , mask , maskArgument ) ;

	return mask ;
} ;



// Apply the mask to an input tree
masklib.Mask.prototype.applyTo = function applyTo( input , context , contextOverideDefault ) {
	// Arguments checking
	if ( input === null || typeof input !== 'object' ) {
		throw new TypeError( '[tree] .applyTo() : Argument #1 should be an object' ) ;
	}

	if ( contextOverideDefault ) {
		context = tree.extend( null ,
			{
				mask: this ,
				options: this.__options__ ,
				path: this.__options__.path
			} ,
			context
		) ;
	}
	else if ( context === undefined ) {
		context = {
			mask: this ,
			options: this.__options__ ,
			path: this.__options__.path
		} ;
	}


	// Init
	//console.log( context ) ;
	var result , nextPath , output ,
		i , key , maskValue ,
		maskKeyList = Object.keys( context.mask ) ,
		j , inputKey , inputValue , inputKeyList ;

	if ( Array.isArray( input ) ) { output = [] ; }
	else { output = {} ; }


	// Iterate through mask properties
	for ( i = 0 ; i < maskKeyList.length ; i ++ ) {
		key = maskKeyList[ i ] ;
		maskValue = context.mask[ key ] ;

		//console.log( '\nnext loop: ' , key , maskValue ) ;

		// The special key * is a wildcard, it match everything
		if ( key === '*' ) {
			//console.log( 'wildcard' ) ;
			inputKeyList = Object.keys( input ) ;

			for ( j = 0 ; j < inputKeyList.length ; j ++ ) {
				inputKey = inputKeyList[ j ] ;
				inputValue = input[ inputKey ] ;

				//console.log( '*: ' , inputKey ) ;
				nextPath = context.path + context.options.pathSeparator + inputKey ;

				// If it is an array or object, recursively check it
				if ( maskValue !== null && typeof maskValue === 'object' ) {
					if ( inputValue !== null && typeof inputValue === 'object' ) {
						if ( inputValue instanceof masklib.Mask ) {
							output[ inputKey ] = inputValue.applyTo( inputValue , { path: nextPath } , true ) ;
						}
						else {
							output[ inputKey ] = this.applyTo( inputValue , tree.extend( null , {} , context , { mask: maskValue , path: nextPath } ) ) ;
						}
					}
					else if ( typeof context.options.leaf === 'function' ) {
						output[ inputKey ] = this.applyTo( {} , tree.extend( null , {} , context , { mask: maskValue , path: nextPath } ) ) ;
					}
				}
				else if ( maskValue !== null && typeof context.options.leaf === 'function' ) {
					//console.log( 'leaf callback' ) ;
					result = context.options.leaf( input , inputKey , maskValue , nextPath ) ;
					if ( ! ( result instanceof Error ) ) { output[ inputKey ] = result ; }
				}
				else if ( context.options.clone && ( inputValue !== null && typeof inputValue === 'object' ) ) {
					output[ inputKey ] = tree.extend( { deep: true } , {} , inputValue ) ;
				}
				else {
					output[ inputKey ] = inputValue ;
				}
			}

			continue ;
		}


		nextPath = context.path + context.options.pathSeparator + key ;

		// If it is an object, recursively check it
		//if ( maskValue instanceof masklib.Mask )
		if ( maskValue !== null && typeof maskValue === 'object' ) {
			//console.log( 'sub' ) ;

			if ( Object.prototype.hasOwnProperty.call( input , key ) && input[ key ] !== null && typeof input[ key ] === 'object' ) {
				//console.log( 'recursive call' ) ;

				if ( input.key instanceof masklib.Mask ) {
					output[ key ] = input.key.applyTo( input[ key ] , { path: nextPath } , true ) ;
				}
				else {
					output[ key ] = this.applyTo( input[ key ] , tree.extend( null , {} , context , { mask: maskValue , path: nextPath } ) ) ;
				}
			}
			// recursive call only if there are callback
			else if ( context.options.leaf ) {
				//console.log( 'recursive call' ) ;
				output[ key ] = this.applyTo( {} , tree.extend( null , {} , context , { mask: maskValue , path: nextPath } ) ) ;
			}
		}
		// If mask exists, add the key
		else if ( Object.prototype.hasOwnProperty.call( input , key ) ) {
			//console.log( 'property found' ) ;

			if ( maskValue !== undefined && typeof context.options.leaf === 'function' ) {
				//console.log( 'leaf callback' ) ;
				result = context.options.leaf( input , key , maskValue , nextPath ) ;
				if ( ! ( result instanceof Error ) ) { output[ key ] = result ; }
			}
			else if ( context.options.clone && ( input[ key ] !== null && typeof input[ key ] === 'object' ) ) {
				output[ key ] = tree.extend( { deep: true } , {} , input[ key ] ) ;
			}
			else {
				output[ key ] = input[ key ] ;
			}
		}
		else if ( maskValue !== undefined && typeof context.options.leaf === 'function' ) {
			//console.log( 'leaf callback' ) ;
			result = context.options.leaf( input , key , maskValue , nextPath ) ;
			if ( ! ( result instanceof Error ) ) { output[ key ] = result ; }
		}
	}

	return output ;
} ;



// InverseMask: create an output tree from the input, by excluding properties of the mask

masklib.InverseMask = function InverseMask() {
	throw new Error( 'Cannot create a tree.InverseMask() directly' ) ;
} ;

util.inherits( masklib.InverseMask , masklib.Mask ) ;



/*
	options:
		clone: the output clone the input rather than reference it
		pathSeperator: when expressing path, this is the separator
*/
masklib.createInverseMask = function createInverseMask( maskArgument , options ) {
	if ( maskArgument === null || typeof maskArgument !== 'object' ) {
		throw new TypeError( '[tree] .createInverseMask() : Argument #1 should be an object' ) ;
	}

	if ( options !== null && typeof options === 'object' ) { options = tree.extend( null , {} , maskDefaultOptions , options ) ; }
	else { options = maskDefaultOptions ; }

	var mask = Object.create( masklib.InverseMask.prototype , {
		__options__: { value: options , writable: true  }
	} ) ;

	tree.extend( null , mask , maskArgument ) ;

	return mask ;
} ;



// Apply the mask to an input tree
masklib.InverseMask.prototype.applyTo = function applyTo( input , context , contextOverideDefault ) {
	// Arguments checking
	if ( input === null || typeof input !== 'object' ) {
		throw new TypeError( '[tree] .applyTo() : Argument #1 should be an object' ) ;
	}

	if ( contextOverideDefault ) {
		context = tree.extend( null ,
			{
				mask: this ,
				options: this.__options__ ,
				path: this.__options__.path
			} ,
			context
		) ;
	}
	else if ( context === undefined ) {
		context = {
			mask: this ,
			options: this.__options__ ,
			path: this.__options__.path
		} ;
	}


	// Init
	//console.log( context ) ;
	var nextPath , output ,
		i , key , maskValue ,
		maskKeyList = Object.keys( context.mask ) ,
		j , inputKey , inputValue , inputKeyList ;

	if ( Array.isArray( input ) ) { output = tree.extend( { deep: true } , [] , input ) ; }
	else { output = tree.extend( { deep: true } , {} , input ) ; }

	//console.log( output ) ;

	// Iterate through mask properties
	for ( i = 0 ; i < maskKeyList.length ; i ++ ) {
		key = maskKeyList[ i ] ;
		maskValue = context.mask[ key ] ;

		//console.log( '\nnext loop: ' , key , maskValue ) ;

		// The special key * is a wildcard, it match everything
		if ( key === '*' ) {
			//console.log( 'wildcard' ) ;
			inputKeyList = Object.keys( input ) ;

			for ( j = 0 ; j < inputKeyList.length ; j ++ ) {
				inputKey = inputKeyList[ j ] ;
				inputValue = input[ inputKey ] ;

				//console.log( '*: ' , inputKey ) ;
				nextPath = context.path + context.options.pathSeparator + inputKey ;

				// If it is an array or object, recursively check it
				if ( maskValue !== null && typeof maskValue === 'object' ) {
					if ( inputValue !== null && typeof inputValue === 'object' ) {
						if ( inputValue instanceof masklib.Mask ) {
							output[ inputKey ] = inputValue.applyTo( inputValue , { path: nextPath } , true ) ;
						}
						else {
							output[ inputKey ] = this.applyTo( inputValue , tree.extend( null , {} , context , { mask: maskValue , path: nextPath } ) ) ;
						}
					}
				}
				else {
					delete output[ inputKey ] ;
				}
			}

			continue ;
		}


		nextPath = context.path + context.options.pathSeparator + key ;

		// If it is an object, recursively check it
		//if ( maskValue instanceof masklib.Mask )
		if ( maskValue !== null && typeof maskValue === 'object' ) {
			//console.log( 'sub' ) ;

			if ( Object.prototype.hasOwnProperty.call( input , key ) && input[ key ] !== null && typeof input[ key ] === 'object' ) {
				//console.log( 'recursive call' ) ;

				if ( input.key instanceof masklib.Mask ) {
					output[ key ] = input.key.applyTo( input[ key ] , { path: nextPath } , true ) ;
				}
				else {
					output[ key ] = this.applyTo( input[ key ] , tree.extend( null , {} , context , { mask: maskValue , path: nextPath } ) ) ;
				}
			}
		}
		// If mask exists, remove the key
		else if ( Object.prototype.hasOwnProperty.call( input , key ) ) {
			delete output[ key ] ;
		}
	}

	return output ;
} ;

