if ( typeof define !== 'function' ) {
	var define = require( 'amdefine' )( module);
}

define([ 'commander', './CommandLine' ], function( program, CommandLine ) {
	'use strict';
	return function(){

		var command = new CommandLine(),
			configurationToLoad;
		
		function list( val ) {
			return val.split( ',' );
		}

		// set up commander.js
		program.version('0.0.3')
			.option('-l, --load <file>', 'Load a JSHint json configuration file')
			.option('-o, --output <file>', 'Specify the output file to save new configuration file. Default [.jshintrc]')
			.option('-e, --enable <items>','Enable options or predefined globals ( like browser, node, jquery, backbone)',list)
			.option('-d, --disable <items>', 'Disable options or predefined globals ( like browser, node, jquery, backbone)',list)
			.option('-m, --maxerr <number>', 'Set the number of maximum errors for JSHint to report before quitting.', parseInt)
			.option('-i, --indent', 'Specify indentation', parseInt);

		// custom help
		program.on('--help', function(){
			console.log( 'See https://github.com/fivetanley/warn.js/ for a list of predefined globals.  Options to enable or disable are available there, or you may use the JSHint names like forin or evil');
		});

		program.parse( process.argv );


		function toggle( name, value ) {
			var config = command.configuration;

			// name is a jshint supported option like browser, maxerr, etc
			if ( config[ name ] !== undefined ) {
				config[ name ].setValue( value );
				return;
			}
			if ( value === false ) {
				config.disablePredef( name );
			} else {
				config.enablePredef( name );
			}
		}

		command.on( 'readyToWrite', function( err ) {
			var optionsToEnable,
				optionsToDisable,
				outputFile = program.output,
				config = command.configuration;

			if ( program.enable ) {
				optionsToEnable = program.enable;
				optionsToEnable.map( function( option) {
					toggle( option.trim().toLowerCase(), true );
				});
			}

			if ( program.disable ) { 
				optionsToDisable = program.disable;
				optionsToDisable.map( function( option) {
					toggle( option.trim().toLowerCase(), false );
				});
			}

			if ( program.maxerr ) {
				config.maxerr.setValue( program.maxerr );	
			}

			if ( program.indent ) {
				config.indent.setValue ( program.indent );
			}
			command.output( outputFile || '.jshintrc' );
		});

		command.load( program.load || '.jshintrc' , function( err ) {
			if ( err ) {
				console.log( 'No base configuration found... starting with JSHint defaults.' );
				command.emit( 'readyToWrite' );
			}
		});
	};
});

