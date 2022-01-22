if (typeof define !== 'function'){
	var define = require('amdefine')(module);
}

define(function() {
	'use strict';

	// Option constructor
	function Option(options){
		// options should be an object
		if ( typeof options !== 'object' ) {
			throw new Error('options should be an object');
		}
		
		// All options except value must be provided.
		if ( !options.name || !options.description || !options.type || options.defaultValue === undefined ) {
			throw new Error('name,description, type, and defaultValue required');
		}

		// Set name of option
		this.name = options.name;

		// A description of the setting.
		this.description = options.description;

		// The type of value `this` option can have.
		if ( options.type !== Array && options.type !== Number && options.type !== Boolean &&
			options.type !== String && options.type !== Object ){

			throw new Error('Option type must be Boolean,Number,Function,String, or Object');
		}
		this.type = options.type;

		// Default value as defined by node-jshint
		this.defaultValue = options.defaultValue;

		// Current value takes default value by default.
		this.setValue(options.defaultValue);
	}

	// Set the value of `this` option.  Must match type.
	Option.prototype.setValue = function(val) {
		// boolean primitives don't pass instanceof check
		if ( typeof val === 'boolean' && this.type === Boolean ) {
			return this.value = val;	
		// number primitives don't pass instanceof check
		} else if ( typeof val === 'number' && this.type === Array ) {
			return this.value = val;
		}
		// Make sure value type matches `this.type`
		else if ( val instanceof this.type ) {
			return this.value = val;
		}
		throw new Error('Value type must match option type');
	};

	return Option;
});
