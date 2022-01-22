if ( typeof define !== 'function' ) {
	var define = require('amdefine')(module);
}

define(function() {
	'use strict';

	return {

		passfail : {
			name : 'passfail',
			description: 'If the scan should stop on first error',
			type : Boolean,
			defaultValue : false
		},

		maxerr : {
			name : 'maxerr',
			description : 'Maximum errors before stopping',
			type : Number,
			defaultValue : 50
		}

	};
});
