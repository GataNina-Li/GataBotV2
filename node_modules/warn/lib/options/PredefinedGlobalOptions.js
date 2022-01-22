if ( typeof define !== 'function' ) {
	var define = require('amdefine')(module);
}

define( function() {
	'use strict';
		
	return {
		browser : {
			name : 'browser',
			description : 'If standard browser globals (window,document,etc) should be defined',
			type : Boolean,
			defaultValue : false
		},

		node : {
			name : 'node',
			description : 'If Node environment variables should be predefined',
			type : Boolean,
			defaultValue : false
		},

		rhino : {
			name : 'rhino',
			description : 'If Rhino environment variables should be predefined',
			type : Boolean,
			defaultValue : false
		},

		couch : {
			name : 'couch',
			description : 'If couchDB globals should be predefined',
			type : Boolean,
			defaultValue : false
		},

		wsh : {
			name : 'wsh',
			description : 'If Windows Scripting Host environment variables should be predefined',
			type : Boolean,
			defaultValue : false
		},

		jquery : {
			name : 'jquery',
			description : 'If jQuery globals should be predefined',
			type : Boolean,
			defaultValue : false
		},

		prototypejs : {
			name : 'prototypejs',
			description : 'If PrototypeJS globals should be predefined',
			type : Boolean,
			defaultValue : false
		},

		mootools : {
			name : 'mootools',
			description : 'If Mootools globals should be predefined',
			type : Boolean,
			defaultValue : false
		},

		dojo : {
			name : 'dojo',
			description : 'If Dojo Toolkit globals should be predefined',
			type : Boolean,
			defaultValue : false
		},

		predef : {
			name : 'predef',
			description : 'Custom predefined globals',
			type : Array,
			defaultValue : [ ]
		}

	// end return
	};

});
