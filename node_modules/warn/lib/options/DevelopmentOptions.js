if ( typeof define !== 'function' ) {
	var define = require('amdefine')(module);
}

define( function() { 
	'use strict';

	return {
		debug : {
			name: 'debug',
			description: 'If debugger statements should be allowed.',
			type: Boolean,
			defaultValue: false
		},

		devel: {
			name: 'devel',
			description: 'If logging globals should be predefined (console,alert, etc.)',
			type: Boolean,
			defaultValue: false
		}
	};

});
