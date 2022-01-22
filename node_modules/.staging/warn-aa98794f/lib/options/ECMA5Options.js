if ( typeof define !== 'function' ) {
	var define = require('amdefine')(module);
}

define( function() { 
	'use strict';

	return {

		es5: {
			name: 'es5',
			description: 'If ES5 syntax should be allowed',
			type: Boolean,
			defaultValue: false
		},

		strict: {
			name: 'strict',
			description: "Require the 'use strict' pragma",
			type: Boolean,
			defaultValue: false
		},

		globalstrict: {
			name: 'globalstrict',
			description: 'If global use strict should be allowed (also enables strict)',
			type: Boolean,
			defaultValue: false
		}
	};
});
