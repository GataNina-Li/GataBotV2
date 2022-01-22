if ( typeof define !== 'function' ) {
	var define = require('amdefine')(module);
}

define(['Option'], function(Option) {

	var browser,
		node,
		rhino,
		couch,
		wsh,
		jquery,
		prototypejs,
		mootools,
		dojo,
		predef;

	browser = new Option({
		name : 'browser',
		description : 'If standard browser globals (window,document,etc) should be defined',
		type : Boolean,
		defaultValue : false
	});

	node = new Option({
		name : 'node',
		description : 'If Node environment variables should be predefined',
		type : Boolean,
		defaultValue : false
	});

	rhino = new Option({
		name : 'rhino',
		description : 'If Rhino environment variables should be predefined',
		type : Boolean,
		defaultValue : false
	});

	couch = new Option({
		name : 'couch',
		description : 'If couchDB globals should be predefined',
		type : Boolean,
		defaultValue : false
	});

	wsh = new Option({
		name : 'wsh',
		description : 'If Windows Scripting Host environment variables should be predefined',
		type : Boolean,
		defaultValue : false
	});

	jquery = new Option({
		name : 'jquery',
		description : 'If jQuery globals should be predefined',
		type : Boolean,
		defaultValue : false
	});

	prototypejs = new Option({
		name : 'prototypejs',
		description : 'If PrototypeJS globals should be predefined',
		type : Booelan,
		defaultValue : false
	});

	mootools = new Option({
		name : 'mootools',
		description : 'If Mootools globals should be predefined',
		type : Boolean,
		defaultValue : false
	});

	dojo = new Option({
		name : 'dojo',
		description : 'If Dojo Toolkit globals should be predefined',
		type : Boolean,
		defaultValue : false
	});

	predef = new Option({
		name : 'predef',
		description : 'Custom predefined globals',
		type : Array,
		defaultValue : [ ]
	});

	return {
		'browser' : browser,
		'node' : node,
		'rhino' : rhino,
		'couch' : couch,
		'wsh' : wsh,
		'jquery' : jquery,
		'prototypejs' : prototypejs,
		'mootools' : mootools,
		'dojo' : dojo,
		'predef' : predef
	};

});
