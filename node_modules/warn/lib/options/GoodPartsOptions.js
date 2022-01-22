if ( typeof define !== 'function' ) {
	var define = require('amdefine')(module);
}

define( function() {

	'use strict';

	return {
		
		asi: {
			name: 'asi',
			description: 'If automatic semicolon insertion should be tolerated',
			type: Boolean,
			defaultValue: false
		},

		bitwise: {
			name: 'bitwise',
			description: 'If bitwise operators (&, |, ^, etc.) should not be allowed',
			type: Boolean,
			defaultValue: false
		},

		boss: {
			name: 'boss',
			description: 'If assignments inside if, for and while should be allowed. Usually conditions and loops are for comparison, not assignments',
			type: Boolean,
			defaultValue: false
		},

		curly: {
			name: 'curly',
			description: 'If curly braces around all blocks should be required',
			type: Boolean,
			defaultValue: false
		},

		eqeqeq: {
			name: 'eqeqeq',
			description: 'If strict equals ( === ) should be required',
			type: Boolean,
			defaultValue: false
		},

		eqnull: {
			name: 'eqnull',
			description: 'If == null comparisons should be allowed',
			type: Boolean,
			defaultValue: false
		},

		esnext: {
			name: 'esnext',
			description: 'If es.next specific syntax should be allowed',
			type: Boolean,
			defaultValue: false
		},

		evil: {
			name: 'evil',
			description: 'If eval should be allowed',
			type: Boolean,
			defaultValue: false
		},

		expr: {
			name: 'expr',
			description: 'If ExpressionStatement should be allowed as Program',
			type: Boolean,
			defaultValue: false
		},

		forin: {
			name: 'forin',
			description: 'If forin loops must be filtered with `hasOwnPrototype`',
			type: Boolean,
			defaultValue: false
		},

		funcscope: {
			name: 'funcscope',
			description: 'If only function scope should be used for scope tests',
			type: Boolean,
			defaultValue: false
		},

		immed: {
			name: 'immed',
			description: 'If immediate invocations must be wrapped in parens, e.g `( function(){}() )`',
			type: Boolean,
			defaultValue: false
		},

		iterator: {
			name: 'iterator',
			description: 'If the __iterator__ property should be allowed',
			type: Boolean,
			defaultValue: false
		},

		latedef: {
			name: 'latedef',
			description: 'If use before define should be tolerated',
			type: Boolean,
			defaultValue: false
		},

		lastsemic: {
			name: 'lastsemic',
			description: 'If semicolons may be omitted for the trailing statement inside of a one-line blocks.',
			type: Boolean,
			defaultValue: false
		},

		laxbreak: {
			name: 'laxbreak',
			description: 'If line breaks should not be checked, e.g. `return [\n] x`',
			type: Boolean,
			defaultValue: false
		},

		laxcomma: {
			name: 'laxcomma',
			description: 'If line breaks should not be checked around commas',
			type: Boolean,
			defaultValue: false
		},

		loopfunc: {
			name: 'loopfunc',
			description: 'If functions should be allowed to be defined within loops',
			type: Boolean,
			defaultValue: false
		},

		multistr: {
			name: 'multistr',
			description: 'If multiline strings should be allowed',
			type: Boolean,
			defaultValue: false
		},

		nonstandard: {
			name: 'nonstandard',
			description: 'If non-standard (but widely adopted) globals should be predefined',
			type: Boolean,
			defaultValue: false
		},
		
		onecase: {
			name: 'onecase',
			description: 'If one case switch statements should be allowed',
			type: Boolean,
			defaultValue: false
		},

		proto: {
			name: 'proto',
			description: 'If the __proto__ property should be allowed',
			type: Boolean,
			defaultValue: false
		},	


		noarg: {
			name: 'noarg',
			description: 'If arguments.callee and arguments.caller should be disallowed',
			type: Boolean,
			defaultValue: false
		},

		regexp: {
			name: 'regexp',
			description: 'If the . should not be allowed in regexp',
			type: Boolean,
			defaultValue: false
		},

		regexdash: {
			name: 'regexdash',
			description: 'If unescaped first/last dash (-) inside brackets should be tolerated',
			type: Boolean,
			defaultValue: false
		},

		scripturl: {
			name: 'scripturl',
			description: 'If script-targeted URLs should be tolerated',
			type: Boolean,
			defaultValue: false
		},

		shadow: {
			name: 'shadow',
			description: 'If variable shadowing should be tolerated',
			type: Boolean,
			defaultValue: false
		},

		smarttabs: {
			name: 'smarttabs',
			description: 'If super-tabs should be tolerated (http://www.emacswiki.org/emacs/SmartTabs)',
			type: Boolean,
			defaultValue: false
		},


		supernew: {
			name: 'supernew',
			description: 'If `new function(){}` and `new Object;` should be tolerated',
			type: Boolean,
			defaultValue: false
		},

		undef: {
			name: 'undef',
			description: 'If variables should be declared before use',
			type: Boolean,
			defaultValue: false
		},

		validthis: {
			name: 'validthis',
			description: 'If `this` inside a non constructor function is valid',
			type: Boolean,
			defaultValue: false
		}

	// end return
	};	

});
