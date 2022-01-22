if ( typeof define !== 'function' ) {
	var define = require('amdefine')(module);
}

define( function() {
	'use strict';

	return {

		indent: {
			name: 'indent',
			description: 'Specify indentation',
			type : Number,
			defaultValue: 4
		},

		newcap: {
			name: 'newcap',
			description: 'If Constructor names must be capitalized',
			type: Boolean,
			defaultValue: false
		},

		noempty: {
			name: 'noempty',
			description: 'If empty blocks should be disallowed',
			type: Boolean,
			defaultValue: false
		},

		nomen: {
			name: 'nomen',
			description: 'If names should be checked for leading ' +
				'or trailing underscores (_) (object._attribute) ' +
				'would be disallowed',
			type: Boolean,
			defaultValue: false
		},

		onevar: {
			name: 'onevar',
			description: 'Only one `var` statement per function should be allowed',
			type: Boolean,
			defaultValue: false
		},

		plusplus: {
			name: 'plusplus',
			description: 'If increment and decrement (++) and (--) should not be allowed',
			type: Boolean,
			defaultValue: false
		},

		sub: {
			name: 'sub',
			description: 'If all forms of subscript notation should be allowed',
			type: Boolean,
			defaultValue: false
		},

		trailing: {
			name: 'trailing',
			description: 'If trailing whitespace rules apply',
			type: Boolean,
			defaultValue: false
		},

		white: {
			name: 'white',
			description: 'If strict whitespace rules apply',
			type: Boolean,
			defaultValue: false
		}

	// end return
	};


});
