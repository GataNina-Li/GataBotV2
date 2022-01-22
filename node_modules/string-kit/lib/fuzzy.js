/*
	String Kit

	Copyright (c) 2014 - 2021 Cédric Ronvel

	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

"use strict" ;


const fuzzy = {} ;
module.exports = fuzzy ;



fuzzy.score = ( input , pattern ) => {
	if ( input === pattern ) { return 1 ; }
	if ( input.length === 0 || pattern.length === 0 ) { return 0 ; }
	//return 1 - fuzzy.levenshtein( input , pattern ) / ( pattern.length >= input.length ? pattern.length : input.length ) ;
	return Math.max( 0 , 1 - fuzzy.levenshtein( input , pattern ) / pattern.length ) ;
} ;



const DEFAULT_SCORE_LIMIT = 0 ;
const DEFAULT_TOKEN_DISPARITY_PENALTY = 0.88 ;
// deltaRate should be just above tokenDisparityPenalty
const DEFAULT_DELTA_RATE = 0.9 ;



fuzzy.bestMatch = ( input , patterns , options = {} ) => {
	var bestScore = options.scoreLimit || DEFAULT_SCORE_LIMIT ,
		i , iMax , currentScore , currentPattern ,
		bestIndex = -1 ,
		bestPattern = null ;

	for ( i = 0 , iMax = patterns.length ; i < iMax ; i ++ ) {
		currentPattern = patterns[ i ] ;
		currentScore = fuzzy.score( input , currentPattern ) ;
		if ( currentScore === 1 ) { return options.indexOf ? i : currentPattern ; }
		if ( currentScore > bestScore ) {
			bestScore = currentScore ;
			bestPattern = currentPattern ;
			bestIndex = i ;
		}
	}

	return options.indexOf ? bestIndex : bestPattern ;
} ;



fuzzy.topMatch = ( input , patterns , options = {} ) => {
	var scoreLimit = options.scoreLimit || DEFAULT_SCORE_LIMIT ,
		deltaRate = options.deltaRate || DEFAULT_DELTA_RATE ,
		i , iMax , patternScores ;

	patternScores = patterns.map( ( pattern , index ) => ( { pattern , index , score: fuzzy.score( input , pattern ) } ) ) ;
	patternScores.sort( ( a , b ) => b.score - a.score ) ;

	//console.log( patternScores ) ;

	if ( patternScores[ 0 ].score <= scoreLimit ) { return [] ; }
	scoreLimit = Math.max( scoreLimit , patternScores[ 0 ].score * deltaRate ) ;

	for ( i = 1 , iMax = patternScores.length ; i < iMax ; i ++ ) {
		if ( patternScores[ i ].score < scoreLimit ) {
			patternScores.length = i ;
			break ;
		}
	}

	return options.indexOf ?
		patternScores.map( e => e.index ) :
		patternScores.map( e => e.pattern ) ;
} ;



const englishBlackList = new Set( [
	'a' , 'an' , 'the' , 'this' , 'that' , 'those' , 'some' ,
	'of' , 'in' , 'on' , 'at' ,
	'my' , 'your' , 'her' , 'his' , 'its' , 'our' , 'their'
] ) ;

function tokenize( str , blackList = englishBlackList ) {
	return str.split( /[ '"/|,:_-]+/g ).filter( s => s && ! blackList.has( s ) ) ;
}



// This is almost the same code than .topTokenMatch(): both must be in sync
fuzzy.bestTokenMatch = ( input , patterns , options = {} ) => {
	var scoreLimit = options.scoreLimit || DEFAULT_SCORE_LIMIT ,
		tokenDisparityPenalty = options.tokenDisparityPenalty || DEFAULT_TOKEN_DISPARITY_PENALTY ,
		i , iMax , j , jMax , z , zMax ,
		currentPattern , currentPatternTokens , currentPatternToken , currentPatternScore ,
		bestPatternScore = scoreLimit ,
		//currentPatternScores = [] ,
		currentInputToken , currentScore ,
		inputTokens = tokenize( input ) ,
		bestScore ,
		bestIndex = -1 ,
		bestPattern = null ;

	//console.log( inputTokens ) ;
	if ( ! inputTokens.length || ! patterns.length ) { return options.indexOf ? bestIndex : bestPattern ; }

	for ( i = 0 , iMax = patterns.length ; i < iMax ; i ++ ) {
		currentPattern = patterns[ i ] ;
		currentPatternTokens = tokenize( currentPattern ) ;
		//currentPatternScores.length = 0 ;
		currentPatternScore = 0 ;

		for ( j = 0 , jMax = inputTokens.length ; j < jMax ; j ++ ) {
			currentInputToken = inputTokens[ j ] ;
			bestScore = 0 ;

			for ( z = 0 , zMax = currentPatternTokens.length ; z < zMax ; z ++ ) {
				currentPatternToken = currentPatternTokens[ z ] ;
				currentScore = fuzzy.score( currentInputToken , currentPatternToken ) ;

				if ( currentScore > bestScore ) {
					bestScore = currentScore ;
					if ( currentScore === 1 ) { break ; }
				}
			}

			//currentPatternScores[ j ] = bestScore ;
			currentPatternScore += bestScore ;
		}

		//currentPatternScore = Math.hypot( ... currentPatternScores ) ;
		currentPatternScore /= inputTokens.length ;

		// Apply a small penalty if there isn't enough tokens
		if ( inputTokens.length !== currentPatternTokens.length ) {
			currentPatternScore *= tokenDisparityPenalty ** Math.abs( currentPatternTokens.length - inputTokens.length ) ;
		}

		//console.log( currentPattern + ': ' + currentPatternScore ) ;
		if ( currentPatternScore > bestPatternScore ) {
			bestPatternScore = currentPatternScore ;
			bestPattern = currentPattern ;
			bestIndex = i ;
		}
	}

	return options.indexOf ? bestIndex : bestPattern ;
} ;



// This is almost the same code than .bestTokenMatch(): both must be in sync
// deltaRate should be just above tokenDisparityPenalty
fuzzy.topTokenMatch = ( input , patterns , options = {} ) => {
	var scoreLimit = options.scoreLimit || DEFAULT_SCORE_LIMIT ,
		tokenDisparityPenalty = options.tokenDisparityPenalty || DEFAULT_TOKEN_DISPARITY_PENALTY ,
		deltaRate = options.deltaRate || DEFAULT_DELTA_RATE ,
		i , iMax , j , jMax , z , zMax ,
		currentPattern , currentPatternTokens , currentPatternToken , currentPatternScore ,
		currentInputToken , currentScore ,
		inputTokens = tokenize( input ) ,
		bestScore ,
		patternScores = [] ;

	//console.log( inputTokens ) ;
	if ( ! inputTokens.length || ! patterns.length ) { return [] ; }

	for ( i = 0 , iMax = patterns.length ; i < iMax ; i ++ ) {
		currentPattern = patterns[ i ] ;
		currentPatternTokens = tokenize( currentPattern ) ;
		//currentPatternScores.length = 0 ;
		currentPatternScore = 0 ;

		for ( j = 0 , jMax = inputTokens.length ; j < jMax ; j ++ ) {
			currentInputToken = inputTokens[ j ] ;
			bestScore = 0 ;

			for ( z = 0 , zMax = currentPatternTokens.length ; z < zMax ; z ++ ) {
				currentPatternToken = currentPatternTokens[ z ] ;
				currentScore = fuzzy.score( currentInputToken , currentPatternToken ) ;

				if ( currentScore > bestScore ) {
					bestScore = currentScore ;
					if ( currentScore === 1 ) { break ; }
				}
			}

			//currentPatternScores[ j ] = bestScore ;
			currentPatternScore += bestScore ;
		}

		//currentPatternScore = Math.hypot( ... currentPatternScores ) ;
		currentPatternScore /= inputTokens.length ;

		// Apply a small penalty if there isn't enough tokens
		if ( inputTokens.length !== currentPatternTokens.length ) {
			currentPatternScore *= tokenDisparityPenalty ** Math.abs( currentPatternTokens.length - inputTokens.length ) ;
		}

		patternScores.push( { pattern: currentPattern , index: i , score: currentPatternScore } ) ;
	}

	patternScores.sort( ( a , b ) => b.score - a.score ) ;
	//console.log( "Before truncating:" , patternScores ) ;

	if ( patternScores[ 0 ].score <= scoreLimit ) { return [] ; }
	scoreLimit = Math.max( scoreLimit , patternScores[ 0 ].score * deltaRate ) ;

	for ( i = 1 , iMax = patternScores.length ; i < iMax ; i ++ ) {
		if ( patternScores[ i ].score < scoreLimit ) {
			patternScores.length = i ;
			break ;
		}
	}

	//console.log( "After truncating:" , patternScores ) ;

	return options.indexOf ?
		patternScores.map( e => e.index ) :
		patternScores.map( e => e.pattern ) ;
} ;



// The .levenshtein() function is derivated from https://github.com/sindresorhus/leven by Sindre Sorhus (MIT License)
const _tracker = [] ;
const _leftCharCodeCache = [] ;

fuzzy.levenshtein = ( left , right ) => {
	if ( left === right ) { return 0 ; }

	// Swapping the strings if `a` is longer than `b` so we know which one is the
	// shortest & which one is the longest
	if ( left.length > right.length ) {
		let swap = left ;
		left = right ;
		right = swap ;
	}

	let leftLength = left.length ;
	let rightLength = right.length ;

	// Performing suffix trimming:
	// We can linearly drop suffix common to both strings since they
	// don't increase distance at all
	while ( leftLength > 0 && ( left.charCodeAt( leftLength - 1 ) === right.charCodeAt( rightLength - 1 ) ) ) {
		leftLength -- ;
		rightLength -- ;
	}

	// Performing prefix trimming
	// We can linearly drop prefix common to both strings since they
	// don't increase distance at all
	let start = 0 ;

	while ( start < leftLength && ( left.charCodeAt( start ) === right.charCodeAt( start ) ) ) {
		start ++ ;
	}

	leftLength -= start ;
	rightLength -= start ;

	if ( leftLength === 0 ) { return rightLength ; }

	let rightCharCode ;
	let result ;
	let temp ;
	let temp2 ;
	let i = 0 ;
	let j = 0 ;

	while ( i < leftLength ) {
		_leftCharCodeCache[ i ] = left.charCodeAt( start + i ) ;
		_tracker[ i ] = ++ i ;
	}

	while ( j < rightLength ) {
		rightCharCode = right.charCodeAt( start + j ) ;
		temp = j ++ ;
		result = j ;

		for ( i = 0 ; i < leftLength ; i ++ ) {
			temp2 = rightCharCode === _leftCharCodeCache[ i ] ? temp : temp + 1 ;
			temp = _tracker[ i ] ;
			// eslint-disable-next-line no-nested-ternary
			result = _tracker[ i ] = temp > result   ?   temp2 > result ? result + 1 : temp2   :   temp2 > temp ? temp + 1 : temp2 ;
		}
	}

	return result ;
} ;

