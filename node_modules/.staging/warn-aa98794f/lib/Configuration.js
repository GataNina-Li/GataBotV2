if ( typeof define !== 'function' ) {
	var define = require( 'amdefine')( module );
}

define( [ './options/index', './Option', './CustomPredefs', './Predef' ], function( options, Option, predefs, Predef) {

	'use strict';

	function Configuration( configOpts ) {
		
		var iterator,
			key,
			defaultValues = this.defaultValues,
			defaultValuesKeys = Object.keys( this.defaultValues ),
			defaultValue,
			self = this;


		// Set the value of `this`.key to the passed value or
		// the default value if a value is not passed through configOpts
		defaultValuesKeys.map( function( defaultValue ) {
			self[ defaultValue ] = new Option( defaultValues[ defaultValue ] );
			// If configOpts.key is defined, try to set it.
			if ( configOpts !== undefined && configOpts[ defaultValue ] !== undefined) {
				self[ defaultValue ].setValue( configOpts[ defaultValue ] );
			}
		});

	}

	// Default values loaded from options/index
	Configuration.prototype.defaultValues = ( function() {
		var values = { },
			iterator,
			subPropertyIterator,
			keyName,
			masterKeys,
			subKeyName,
			subKeys,
			optionName;

		masterKeys = Object.keys( options) ;

		// defaultValues.name should have the value of options.category.name
		masterKeys.map ( function( masterKey ) {
			keyName = masterKey;
			subKeys = Object.keys( options[ keyName ] );
			subKeys.map( function ( subKeyName ) {
				optionName = subKeyName;
				// Assign the object to values.
				values[ optionName ] = options[ keyName ][ subKeyName ];
			});
		});

		return values;
	}());

	// Set a configuration option to a value.
	Configuration.prototype.set = function( optionName, value ) {

		// check to see if property exists; we don't want to output
		// configuration options that aren't supported
		if ( this[ optionName ] === undefined ) {
			throw new Error( 'Unsupported JSHint operation' );
		}

		// Otherwise, use setValue on the Option to set the value.
		this[ optionName ].setValue( value );

		return value;
	};

	// Predefined globals list.
	Configuration.prototype.predefs = (function() {
		var predefinedGlobals = Object.keys( predefs ),
			iterator,
			key,
			predefsCollection = {};
		predefinedGlobals.map( function( predefinedGlobal ) {
			predefsCollection[ predefinedGlobal ] = new Predef( predefs[ predefinedGlobal ] );
		});

		return predefsCollection;
	} () );


	// Enable a predefined global, either a JSHint predefined one like jquery or dojo,
	// or a customPredefs defined by Warn or passed in.
	Configuration.prototype.enablePredef = function( name ){

		var predefinedGlobals = Object.keys( options.predefinedGlobals ),
			customPredefs,
			index,
			customPredef,
			dependencies,
			self = this;
		
		// Check if the requested value is either browser, jquery, node, etc.
		if ( this[ name ] !== undefined && name !== 'predef' ) {
			this[ name ].setValue( true );
			return;
		}

		// Otherwise, see if the value is predefined by Warn.js

		// If it's not defined by warn.js, must be custom, just push it.
		if ( this.predefs[ name ] === undefined ) {
			this.enablePredefs( [ name ] );
			return;
		}
		// Otherwise, add it to the `predef` array for JSHint.
		customPredef = this.predefs[ name ];
		// If it's an object, we'll need to load any dependencies.
		if (  customPredef.hasDeps() === true ) {
			dependencies = customPredef.getDeps();
			dependencies.map(function (dependency) {
				self.enablePredef( dependency );
			});
			this.enablePredefs( customPredef.getDict() );
			return;
		}
		// Otherwise it is an instance of Array, and values can be passed to enablePredef.
		this.enablePredefs( customPredef.getDict() );
	};

	Configuration.prototype.enablePredefs = function( predefsToEnable ) {

		var predefsAlreadyEnabled = this.predef.value;

		predefsToEnable.map( function( predef ) {
			if ( predefsAlreadyEnabled.indexOf( predef ) === -1 ) {
				predefsAlreadyEnabled.push( predef );
			}
		});
	};

	Configuration.prototype.disablePredef = function( disabled ) {
		var predefsEnabled = this.predef,
			indexOfDisabled;
		// check for JSHint predefs like jquery or browser or node	
		if ( this[ disabled ] !== undefined ) {
			this[ disabled ].setValue ( false );
			return;
		}
		// check for Warn.js defined predefs.
		if ( this.predefs[ disabled ] !== undefined ) {
			indexOfDisabled = predefsEnabled.indexOf( disabled );
			if ( indexOfDisabled !== -1 ) {
				this.predef = predefsEnabled.slice( indexOfDisabled, 1);
			}
		}
	};

	Configuration.prototype.toJSON = function(){
		var self = this,
			options = Object.keys ( self ),
			optionName,
			optionValue,
			responseBody = {};
		
		options.map( function( option ) {
			optionValue = self[ option ].value;
			responseBody[ option ] = optionValue;
		});

		return responseBody;

	};

	return Configuration;

});
