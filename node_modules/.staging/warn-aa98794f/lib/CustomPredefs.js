if ( typeof define !== 'function' ) {
	var define = require('amdefine')(module);
}

define ( function(){
	'use strict';

	var libraries,
		testSuites;
	
	return {

		// Libraries

		agility: [ '$$' ],

		angular: [ 'angular' ],

    'angular-scenario': {
      deps: [ 'angular' ],
      dict: [ 'pause', 'sleep', 'browser', 'expect', 'using', 'binding', 'input', 'repeater', 'select', 'element' ]
    },

		backbone: {
			deps: [ 'jquery', 'underscore'],
			dict: [ 'Backbone' ]
		},

		closure: [ 'goog' ],

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

		zepto: [ '$' ],

		// Test Suites

		buster: [ 'assert', 'buster', 'expect', 'refute'],

		'chai-tdd': [ 'assert' ],

		'chai-bdd': [ 'expect' ],

		expect: [ 'expect' ],

		hiro: [ 'hiro' ],

		jasmine: [ 'jasmine', 'isCommonJS', 'exports', 'spyOn', 'it', 'xit',
				'expect', 'runs', 'waits', 'waitsFor', 'beforeEach', 'afterEach',
				'describe', 'xdescribe' ],

		mocha: [ 'Mocha' ],

		'mocha-bdd': {
			deps: [ 'mocha' ],
			dict: [ 'after', 'afterEach', 'before', 'beforeEach', 'describe', 'it']
		},

		'mocha-exports': {
			deps: [ 'mocha' ],
			dict: [ 'after', 'afterEach', 'before', 'beforeEach']
		},

		'mocha-qunit': {
			deps: [ 'mocha' ],
			dict: [ 'ok', 'suite', 'test' ]
		},

		'mocha-tdd': {
			deps: [ 'mocha' ],
			dict: [ 'setup', 'suite', 'teardown', 'test' ]
		},

		qunit: [ 'asyncTest', 'deepEqual', 'equal', 'expect', 'module', 'ok',
				'notDeepEqual', 'notEqual', 'notStrictEqual', 'QUnit',
				'raises', 'start', 'stop', 'strictEqual', 'test' ],

		sinon: [ 'sinon' ],

		vows: [ 'vows', 'assert' ]
	};
});	
