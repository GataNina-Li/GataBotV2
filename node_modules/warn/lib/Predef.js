if ( typeof define !== 'function' ) {
	var define = require('amdefine')(module);
}

define( function() {
	'use strict';

	// Predef
	// Basically a List of words that should pass JSHint as predefined globals.
	// Data property is an Array, or an Object with `deps` and `dict` property.
	// NOTE: A predef's data property is an Array, it can't have dependencies.
	function Predef( definition ) {

		// Check for best case scenario: Array.
		// Copy the values of the array to data property.
		if ( definition instanceof Array ) {
			this.data = definition.slice(0);
			return;
		}

		// If it's an object, check for the deps and dict propreties.
		if ( definition.hasOwnProperty( 'deps' ) && definition.hasOwnProperty( 'dict' ) ){

			if ( !( definition.deps instanceof Array ) || !( definition.dict instanceof Array ) ) {
				throw new Error( 'Dict and depends property of definition must be Array' );
			}
			
			this.data = {
				deps: definition.deps.slice(0),
				dict: definition.dict.slice(0)
			};
			return;
		}
		
		// Not an array or valid Object
		throw new Error( 'Predef definition must be an Array or Object with deps and dict properties' );
	}

	Predef.prototype.getDeps = function() {

		// If an array, it has no dependencies.
		if ( this.data instanceof Array ) {
			return [ ];
		}

		return this.data.deps.slice(0);
	};

	Predef.prototype.setDeps = function( dependencies ) {


		// if this.data is an Array, it has no dependencies
		if ( this.data instanceof Array ) {
			throw new Error( 'Predef is an array, cant have dependencies' );
		}

		// If no dependencies are passed, reset dependencies.
		if ( dependencies === undefined ) {
			this.data.deps = [];
			return;
		}

		if ( !( dependencies instanceof Array ) ) {
			throw new Error( 'Dependencies must be an Array' );
		}

		this.data.deps = dependencies.slice(0);
	};

	Predef.prototype.hasDeps = function() {
		return this.getDeps().length > 0;
	};

	Predef.prototype.getDict = function(){
		if ( this.data instanceof Array ) {
			return this.data;
		} else {
			return this.data.dict;
		}
	};
	
	return Predef;

});
