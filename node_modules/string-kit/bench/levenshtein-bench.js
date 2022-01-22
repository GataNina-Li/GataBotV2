
"use strict" ;



/* global benchmark, competitor */

const leven = require( './ext/leven.js' ) ;
const string = require( '..' ) ;



benchmark( 'Levenshtein' , () => {
	var l1 = 'american' , r1 = 'amecan' ,
		l2 = 'amecan' , r2 = 'american' ,
		l3 = 'america' , r3 = 'armorica' ,
		l4 = 'armorica' , r4 = 'america' ,
		l5 = 'abcdef' , r5 = 'acdbeh' ,
		l6 = 'some-random-text' , r6 = 'more-hazard' ;

	competitor( 'original leven module' , () => {
		leven( l1 , r1 ) ;
		leven( l2 , r2 ) ;
		leven( l3 , r3 ) ;
		leven( l4 , r4 ) ;
		leven( l5 , r5 ) ;
		leven( l6 , r6 ) ;
	} ) ;

	competitor( 'string-kit levenshtein' , () => {
		string.fuzzy.levenshtein( l1 , r1 ) ;
		string.fuzzy.levenshtein( l2 , r2 ) ;
		string.fuzzy.levenshtein( l3 , r3 ) ;
		string.fuzzy.levenshtein( l4 , r4 ) ;
		string.fuzzy.levenshtein( l5 , r5 ) ;
		string.fuzzy.levenshtein( l6 , r6 ) ;
	} ) ;
} ) ;

