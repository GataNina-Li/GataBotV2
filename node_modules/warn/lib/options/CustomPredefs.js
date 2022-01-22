if ( typeof define !== 'function' ) {
	var define = require('amdefine')(module);
}

define ( function(){

	var libraries,
		testSuites;

	libraries = {

		agility: [ '$$' ],

		angular: [ 'angular' ],

		backbone: {
			deps: [ 'jquery', 'underscore'],
			dict: [ 'Backbone' ]
		},

		closure: [ 'goog' ],

		dojo: [ 'dojo', 'dijit', 'dojox' ],

		ember: [ 'Ember', 'Handlebars' ],

		ext: [ 'Ext' ],

		knockout: [ 'ko' ],

		knockback: {
			deps: [ 'knockout' ],
			dict: [ 'kb' ]
		},

		requirejs: [ 'require', 'define' ],

		spine: {
			deps: [ 'jquery', 'underscore' ],
			dict: [ 'Spine' ]
		},

		underscore: [ '_' ],

		yui: [ 'YUI' ],

		zepto: [ '$' ]

	};

	testSuites = {

		buster: [ 'assert', 'buster', 'expect', 'refute'],

		chai : {
			'tdd': [ 'assert' ],
			'bdd': [ 'expect' ]
		},

		expect: [ 'expect' ],

		hiro: [ 'hiro' ],

		jasmine: [ 'jasmine', 'isCommonJS', 'exports', 'spyOn', 'it', 'xit',
				'expect', 'runs', 'waits', 'waitsFor', 'beforeEach', 'beforeAfter',
				'describe', 'xdescribe' ],

		mocha: {
			bdd: [ 'after', 'afterEach', 'before', 'beforeEach', 'describe', 'it' ],
			tdd: [ 'suite', 'setup', 'teardown', 'test' ],
			exports : [ 'after', 'afterEach', 'before', 'beforeEach' ],
			qunit : [ 'suite', 'test', 'ok' ]
		},

		qunit: [ 'asyncTest', 'deepEqual', 'equal', 'expect', 'module', 'ok',
				'notDeepEqual', 'notEqual', 'notStrictEqual', 'QUnit',
				'raises', 'start', 'stop', 'strictEqual', 'test' ],

		sinon: [ 'sinon' ],

		vows: [ 'vows', 'assert' ]
	};

	return {
		testSuites: testSuites,
		libraries: libraries
	};

});	
