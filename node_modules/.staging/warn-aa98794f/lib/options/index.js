if ( typeof define !== 'function' ) {
	var define = require('amdefine')(module);
}

define( [ './GeneralOptions',
	'./PredefinedGlobalOptions',
	'./DevelopmentOptions',
	'./ECMA5Options',
	'./GoodPartsOptions',
	'./StyleOptions' ],

		function( general,
			predefinedGlobals,
			development,
			ecma5,
			goodParts, 
			stylePrefs,
			customPredefs ) {

	'use strict';

	return {
		general:  general,
		predefinedGlobals: predefinedGlobals,
		development: development,
		ecma5: ecma5,
		goodParts: goodParts,
		stylePrefs: stylePrefs
	};
});
