if ( typeof define !== 'function' ) {
	var define = require( 'amdefine' )( module );
}

define( [ 'events', 'fs', './Configuration' ], function( events, fs, Configuration ) {

	'use strict';

	function CommandLine(){
		var self = this;
		this.configuration = new Configuration();
		events.EventEmitter.call( this );
		this.on( 'configLoaded', function() {
			self.emit( 'readyToWrite' );	
		});
	}

	CommandLine.prototype = Object.create ( events.EventEmitter.prototype, {
		constructor: {
			value: CommandLine,
			enumerable: false
		}
	} );

	CommandLine.super_ = events.EventEmitter;

	CommandLine.prototype.load = function( configurationFile, callback ) {
		var self = this;
		fs.readFile( configurationFile, 'UTF-8', function( err, data ) {
			var contents;
			if ( err ) {
				return callback( err );
			}
			contents = JSON.parse( data );
			self.configuration = new Configuration( contents );
			self.emit( 'configLoaded' );
			return callback();
		});
	};

	CommandLine.prototype.output = function ( outputFile ) {
		var self = this;

		fs.writeFile( outputFile, JSON.stringify( self.configuration ), 'UTF-8', function(err, data) {
			if ( err ) {
				throw err;
			}
			self.emit( 'outputWritten' );
		});

	};

	return CommandLine;

});
