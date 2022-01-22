/*
	Seventh

	Copyright (c) 2017 - 2020 Cédric Ronvel

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

/* global describe, it, expect, asyncTry */

"use strict" ;



var NativePromise = global.Promise ;
var Promise = require( '..' ) ;



/* Tests */



describe( "Basic standard-compliant Promise" , () => {

	describe( "Then and catch behavior" , () => {

		it( ".then() chain" , () => {
			var thenCount = 0 ;

			return Promise.resolveTimeout( 10 , 'one' )
				.then( value => {
					expect( value ).to.be( 'one' ) ;
					thenCount ++ ;
					return 'two' ;
				} )
				.then( value => {
					expect( value ).to.be( 'two' ) ;
					thenCount ++ ;
					return Promise.resolveTimeout( 10 , 'three' ) ;
				} )
				.then( value => {
					expect( value ).to.be( 'three' ) ;
					thenCount ++ ;
				} )
				.then( () => {
					expect( thenCount ).to.be( 3 ) ;
				} ) ;
		} ) ;

		it( ".catch() chain" , () => {
			var thenCount = 0 , catchCount = 0 ;

			return Promise.rejectTimeout( 10 , new Error( 'doh!' ) )
				.catch( error => {
					expect( error.message ).to.be( 'doh!' ) ;
					catchCount ++ ;
					throw new Error( 'dang!' ) ;
				} )
				.catch( error => {
					expect( error.message ).to.be( 'dang!' ) ;
					catchCount ++ ;
					return Promise.rejectTimeout( 10 , new Error( 'ooops!' ) ) ;
				} )
				.catch( error => {
					expect( error.message ).to.be( 'ooops!' ) ;
					catchCount ++ ;
				} )
				.then( () => {
					expect( thenCount ).to.be( 0 ) ;
					expect( catchCount ).to.be( 3 ) ;
				} ) ;
		} ) ;

		it( ".catch() propagation" , () => {
			var thenCount = 0 , catchCount = 0 ;

			return Promise.rejectTimeout( 10 , new Error( 'doh!' ) )
				.then( () => Promise.resolveTimeout( 10 , thenCount ++ ) )
				.then( () => Promise.resolveTimeout( 10 , thenCount ++ ) )
				.catch( error => {
					expect( error.message ).to.be( 'doh!' ) ;
					catchCount ++ ;
				} )
				.then( () => {
					expect( thenCount ).to.be( 0 ) ;
					expect( catchCount ).to.be( 1 ) ;
				} ) ;
		} ) ;

		it( "executor throwing synchronously should trigger .catch()" , () => {
			return new Promise( ( resolve , reject ) => {
				//reject( new Error( 'throw!' ) ) ;
				throw new Error( 'throw!' ) ;
			} )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					// Catch part:
					error => {
						expect( error.message ).to.be( 'throw!' ) ;
					}
				) ;
		} ) ;

		it( "then-handler throwing synchronously should trigger .catch()" , () => {
			return Promise.resolveTimeout( 0 )
				.then( () => { throw new Error( 'throw inside then!' ) ; } )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					// Catch part:
					error => {
						expect( error.message ).to.be( 'throw inside then!' ) ;
					}
				) ;
		} ) ;
	} ) ;

	describe( "Edge case: synchronous settlement" , () => {

		it( "synchronous resolve() should still trigger .then() asynchronously" , () => {
			var order = [] ;

			var p = new Promise( ( resolve , reject ) => {
				order.push( 'executor' ) ;
				resolve() ;
			} ) ;

			p.then( () => order.push( 'then' ) ) ;

			order.push( 'sync after' ) ;

			return p.then( () => {
				expect( order ).to.equal( [ 'executor' , 'sync after' , 'then' ] ) ;
			} ) ;
		} ) ;

		it( "synchronous reject() should still trigger .catch() asynchronously" , () => {
			var order = [] ;

			var p = new Promise( ( resolve , reject ) => {
				order.push( 'executor' ) ;
				reject() ;
			} ) ;

			p.catch( () => order.push( 'catch' ) ) ;

			order.push( 'sync after' ) ;

			return p.then(
				() => { throw new Error( 'Should throw!' ) ; } ,
				() => {
					expect( order ).to.equal( [ 'executor' , 'sync after' , 'catch' ] ) ;
				}
			) ;
		} ) ;

		it( "synchronous throwing should still trigger .catch() asynchronously" , () => {
			var order = [] ;

			var p = new Promise( ( resolve , reject ) => {
				order.push( 'executor' ) ;
				throw new Error( 'Error!' ) ;
			} ) ;

			p.catch( () => order.push( 'catch' ) ) ;

			order.push( 'sync after' ) ;

			return p.then(
				() => { throw new Error( 'Should throw!' ) ; } ,
				() => {
					expect( order ).to.equal( [ 'executor' , 'sync after' , 'catch' ] ) ;
				}
			) ;
		} ) ;
	} ) ;
	
	it( ".finally() and .tapFinally()" ) ;
} ) ;



describe( "Promise to/from another promise" , () => {
	it( "Promise#propagate()" ) ;
} ) ;



describe( "Promise to callback" , () => {

	it( "Promise#callback()" , done => {
		const okFn = callback => {
			Promise.resolveTimeout( 10 , 'value!' ).callback( callback ) ;
		} ;

		const koFn = callback => {
			Promise.rejectTimeout( 10 , new Error( 'failed!' ) ).callback( callback ) ;
		} ;

		okFn( ( error , value ) => {
			try {
				expect( error ).to.be( undefined ) ;
				expect( value ).to.be( 'value!' ) ;
			}
			catch ( error ) {
				done( error ) ;
				return ;
			}

			koFn( ( error , value ) => {
				try {
					expect( error ).to.be.ok() ;
					expect( error.message ).to.be( 'failed!' ) ;
					expect( value ).to.be( undefined ) ;
				}
				catch ( error ) {
					done( error ) ;
					return ;
				}

				done() ;
			} ) ;
		} ) ;
	} ) ;

	it( "Promise#callbackAll()" , done => {
		const okFn = callback => {
			Promise.resolveTimeout( 10 , [ 'one' , 'two' , 'three' ] ).callbackAll( callback ) ;
		} ;

		const koFn = callback => {
			Promise.rejectTimeout( 10 , new Error( 'failed!' ) ).callbackAll( callback ) ;
		} ;

		okFn( ( error , arg1 , arg2 , arg3 ) => {
			try {
				expect( error ).to.be( undefined ) ;
				expect( arg1 ).to.be( 'one' ) ;
				expect( arg2 ).to.be( 'two' ) ;
				expect( arg3 ).to.be( 'three' ) ;
			}
			catch ( error ) {
				done( error ) ;
				return ;
			}

			koFn( ( error , value ) => {
				try {
					expect( error ).to.be.ok() ;
					expect( error.message ).to.be( 'failed!' ) ;
					expect( value ).to.be( undefined ) ;
				}
				catch ( error ) {
					done( error ) ;
					return ;
				}

				done() ;
			} ) ;
		} ) ;
	} ) ;

	it( "Throwing callback should not be turned into rejection" , done => {
		asyncTry( () => {
			Promise.resolveTimeout( 10 , 'value!' ).callback( () => {
				throw new Error( 'throw!' ) ;
			} ) ;
		} ).catch( error => done() ) ;

		// Can't figure a clean way to detect non-throwing test, except by letting it timeout
	} ) ;
} ) ;



describe( "Create a callback for promise" , () => {

	it( "Promise.callback()" , async () => {
		var fn = ( error , result , callback ) => {
			setTimeout( () => callback( error , result ) , 10 ) ;
		} ;

		await expect( Promise.callback( callback => fn( null , 'value' , callback ) ) ).to.eventually.be( 'value' ) ;
		await expect( () => Promise.callback( callback => fn( new Error( 'Some error' ) , null , callback ) ) ).to.reject.with.an( Error , { message: 'Some error' } ) ;
	} ) ;

	it( "Promise.callbackAll()" , async () => {
		var fn = ( error , results , callback ) => {
			setTimeout( () => callback( error , ... results ) , 10 ) ;
		} ;

		await expect( Promise.callbackAll( callback => fn( null , [] , callback ) ) ).to.eventually.equal( [] ) ;
		await expect( Promise.callbackAll( callback => fn( null , [ 'value' ] , callback ) ) ).to.eventually.equal( [ 'value' ] ) ;
		await expect( Promise.callbackAll( callback => fn( null , [ 'value' , 'value2' , 'value3' ] , callback ) ) ).to.eventually.equal( [ 'value' , 'value2' , 'value3' ] ) ;
		await expect( () => Promise.callbackAll( callback => fn( new Error( 'Some error' ) , [] , callback ) ) ).to.reject.with.an( Error , { message: 'Some error' } ) ;
	} ) ;
} ) ;



describe( "Promise batch operations" , () => {

	describe( "Promise.all()" , () => {

		it( "with resolvable-promises only, it should resolve with an array of values" , () => {
			return Promise.all( [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] )
				.then( values => {
					expect( values ).to.equal( [ 'one' , 'two' , 'three' ] ) ;
				} ) ;
		} ) ;

		it( "starting with a rejected promise, it should reject" , () => {
			return Promise.all( [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.rejectTimeout( 0 , new Error( 'rejected!' ) ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'rejected!' ) ;
					}
				) ;
		} ) ;

		it( "ending with a rejected promise, it should reject" , () => {
			return Promise.all( [
				Promise.rejectTimeout( 20 , new Error( 'rejected!' ) ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'rejected!' ) ;
					}
				) ;
		} ) ;

		it( "with a rejected promise in the middle, it should reject" , () => {
			return Promise.all( [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.rejectTimeout( 10 , new Error( 'rejected!' ) )
			] )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'rejected!' ) ;
					}
				) ;
		} ) ;
	} ) ;

	describe( "Promise.map() / Promise.every()" , () => {

		it( "using a synchronous iterator with resolvable-promises only, it should resolve to an array of values" , () => {
			var promiseArray = [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] ;

			return Promise.map( promiseArray , str => str + str )
				.then( values => {
					expect( values ).to.equal( [ 'oneone' , 'twotwo' , 'threethree' ] ) ;
				} ) ;
		} ) ;

		it( "using an asynchronous iterator with resolvable-promises only, it should resolve to an array of values" , () => {
			var promiseArray = [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] ;

			return Promise.map( promiseArray , str => Promise.resolveTimeout( 10 , str + str ) )
				.then( values => {
					expect( values ).to.equal( [ 'oneone' , 'twotwo' , 'threethree' ] ) ;
				} ) ;
		} ) ;

		it( "using a synchronous throwing iterator, it should reject" , () => {
			var promiseArray = [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] ;

			return Promise.map( promiseArray , str => { throw new Error( 'failed!' ) ; } )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;
					}
				) ;
		} ) ;

		it( "using an asynchronous rejecting iterator, it should reject" , () => {
			var promiseArray = [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] ;

			return Promise.map( promiseArray , str => Promise.rejectTimeout( 10 ,  new Error( 'failed!' ) ) )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;
					}
				) ;
		} ) ;

		it( "using an asynchronous iterator rejecting at the end, it should reject" , () => {
			var index = 0 ;
			var promiseArray = [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] ;

			return Promise.map( promiseArray , str => {
				if ( ++ index === 3 ) { return Promise.rejectTimeout( 10 ,  new Error( 'failed!' ) ) ; }
				return Promise.resolveTimeout( 10 , str + str ) ;
			} )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;
					}
				) ;
		} ) ;

		it( "no iterator call should be wasted if the Promise.map() has already failed" , done => {
			var count = 0 , order = [] , p ;

			var promiseArray = [
				( p = Promise.resolveTimeout( 20 , 'one' ) ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.rejectTimeout( 10 , new Error( 'failed!' ) )
			] ;

			const iterator = str => {
				count ++ ;
				order.push( str ) ;
				return Promise.resolveTimeout( 10 , str + str ) ;
			} ;

			Promise.map( promiseArray , iterator )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;

						// Wait 20ms after the slowest promise, to ensure the iterator can be called
						p.then( () => Promise.resolveTimeout( 20 ) )
							.then( () => {
								expect( order ).to.equal( [ 'two' ] ) ;
								expect( count ).to.be( 1 ) ;
								done() ;
							} )
							.catch( error => done( error || new Error() ) ) ;
					}
				)
				.catch( error => done( error || new Error() ) ) ;
		} ) ;
	} ) ;

	describe( "Promise.any()" , () => {

		it( "with resolvable-promises only, it should resolve to the fastest promise's value" , () => {
			return Promise.any( [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] )
				.then( values => {
					expect( values ).to.be( 'two' ) ;
				} ) ;
		} ) ;

		it( "starting with a rejected promise, it should resolve to the second one" , () => {
			return Promise.any( [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.rejectTimeout( 0 , new Error( 'rejected!' ) ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] )
				.then( values => {
					expect( values ).to.be( 'three' ) ;
				} ) ;
		} ) ;

		it( "with rejectable-promises only, it should reject with an array of rejection" , () => {
			return Promise.any( [
				Promise.rejectTimeout( 20 , new Error( 'rejection1' ) ) ,
				Promise.rejectTimeout( 0 , new Error( 'rejection2' ) ) ,
				Promise.rejectTimeout( 10 , new Error( 'rejection3' ) )
			] )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					errors => {
						expect( errors.map( e => e.message ) ).to.equal( [ 'rejection1' , 'rejection2' , 'rejection3' ] ) ;
					}
				) ;
		} ) ;
	} ) ;

	describe( "Promise.some()" , () => {

		it( "using a synchronous iterator with resolvable-promises only, it should resolve to the fastest promise's value" , () => {
			var promiseArray = [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] ;

			return Promise.some( promiseArray , str => str + str )
				.then( values => {
					expect( values ).to.be( 'twotwo' ) ;
				} ) ;
		} ) ;

		it( "using an asynchronous iterator with resolvable-promises only, it should resolve to the fastest promise's value" , () => {
			var promiseArray = [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] ;

			return Promise.some( promiseArray , str => Promise.resolveTimeout( 10 , str + str ) )
				.then( values => {
					expect( values ).to.be( 'twotwo' ) ;
				} ) ;
		} ) ;

		it( "using a synchronous throwing iterator, it should reject" , () => {
			var index = 0 ;

			var promiseArray = [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] ;

			return Promise.some( promiseArray , str => { throw new Error( 'failed!' + ( ++ index ) ) ; } )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					errors => {
						expect( errors.map( e => e.message ) ).to.equal( [ 'failed!3' , 'failed!1' , 'failed!2' ] ) ;
					}
				) ;
		} ) ;

		it( "using an asynchronous rejecting iterator, it should reject" , () => {
			var index = 0 ;

			var promiseArray = [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] ;

			return Promise.some( promiseArray , str => Promise.rejectTimeout( 10 ,  new Error( 'failed!' + ( ++ index ) ) ) )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					errors => {
						expect( errors.map( e => e.message ) ).to.equal( [ 'failed!3' , 'failed!1' , 'failed!2' ] ) ;
					}
				) ;
		} ) ;

		it( "no iterator call should be wasted if the Promise.some() has already resolved" , done => {
			var count = 0 , order = [] , p ;

			var promiseArray = [
				( p = Promise.resolveTimeout( 20 , 'one' ) ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.rejectTimeout( 10 , 'three' )
			] ;

			const iterator = str => {
				count ++ ;
				order.push( str ) ;
				return Promise.resolveTimeout( 10 , str + str ) ;
			} ;

			Promise.some( promiseArray , iterator )
				.then( value => {
					expect( value ).to.be( 'twotwo' ) ;

					// Wait 20ms after the slowest promise, to ensure the iterator can be called
					p.then( () => Promise.resolveTimeout( 20 ) )
						.then( () => {
							expect( order ).to.equal( [ 'two' ] ) ;
							expect( count ).to.be( 1 ) ;
							done() ;
						} )
						.catch( error => done( error || new Error() ) ) ;
				} )
				.catch( error => done( error || new Error() ) ) ;
		} ) ;
	} ) ;

	describe( "Promise.filter()" , () => {

		it( "Promise.filter() should filter an array of values using an iterator return value (direct value or promise)" , () => {
			var array = [
				1 , 5 , 7 , 3 , 10 ,
				Promise.resolveTimeout( 10 , 2 ) ,
				Promise.resolveTimeout( 10 , 8 ) ,
				Promise.resolveTimeout( 10 , -1 ) ,
				Promise.resolveTimeout( 10 , 8 )
			] ;

			const filter = v => {
				if ( v < 6 ) { return Promise.resolveTimeout( 10 , true ) ; }
				return Promise.resolveTimeout( 10 , false ) ;
			} ;

			return Promise.filter( array , filter )
				.then( results => {
					expect( results ).to.equal( [ 1 , 5 , 3 , 2 , -1 ] ) ;
				} ) ;
		} ) ;

		it( "Promise.filter() any error should reject the whole promise" , done => {
			var array = [
				Promise.resolveTimeout( 10 , 2 ) ,
				Promise.resolveTimeout( 10 , -1 ) ,
				Promise.resolveTimeout( 10 , 8 ) ,
				Promise.rejectTimeout( 10 , new Error( 'promise failed!' ) ) ,
				Promise.resolveTimeout( 10 , 4 )
			] ;

			var array2 = [
				Promise.resolveTimeout( 10 , 2 ) ,
				Promise.resolveTimeout( 10 , -1 ) ,
				Promise.resolveTimeout( 10 , 8 ) ,
				Promise.resolveTimeout( 10 , 4 )
			] ;

			const filter = v => {
				if ( v < 6 ) { return Promise.resolveTimeout( 10 , true ) ; }
				return Promise.resolveTimeout( 10 , false ) ;
			} ;

			const failFilter = v => {
				if ( v < 6 ) { return Promise.resolveTimeout( 10 , true ) ; }
				return Promise.rejectTimeout( 10 , new Error( 'filter failed!' ) ) ;
			} ;

			const syncFailFilter = v => {
				if ( v < 6 ) { return Promise.resolveTimeout( 10 , true ) ; }
				throw new Error( 'filter sync failed!' ) ;
				//else { return Promise.rejectTimeout( 10 , new Error( 'filter sync failed!' ) ) ; }
			} ;

			Promise.filter( array , filter )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'promise failed!' ) ;

						Promise.filter( array2 , failFilter )
							.then(
								() => { throw new Error( 'Should throw!' ) ; } ,
								error => {
									expect( error.message ).to.be( 'filter failed!' ) ;

									Promise.filter( array2 , syncFailFilter )
										.then(
											() => { throw new Error( 'Should throw!' ) ; } ,
											error => {
												expect( error.message ).to.be( 'filter sync failed!' ) ;
												done() ;
											}
										)
										.catch( error => done( error || new Error() ) ) ;
								}
							)
							.catch( error => done( error || new Error() ) ) ;
					}
				)
				.catch( error => done( error || new Error() ) ) ;
		} ) ;
	} ) ;

	describe( "Promise.forEach()" , () => {

		it( "Promise.forEach() and empty array should resolve" , () => {
			var results = [] ;

			const iterator = ( value , index ) => {
				results.push( 'before ' + index + ': ' + value ) ;

				var p = new Promise( resolve => {
					setTimeout( () => {
						results.push( 'after ' + index + ': ' + value ) ;
						resolve() ;
					} , 20 ) ;
				} ) ;

				return p ;
			} ;

			var array = [] ;

			return Promise.forEach( array , iterator )
				.then( () => {
					expect( results ).to.equal( [] ) ;
				} ) ;
		} ) ;

		it( "Promise.forEach() should run the iterator in series" , () => {
			var results = [] ;

			const iterator = ( value , index ) => {
				results.push( 'before ' + index + ': ' + value ) ;

				var p = new Promise( resolve => {
					setTimeout( () => {
						results.push( 'after ' + index + ': ' + value ) ;
						resolve() ;
					} , 20 ) ;
				} ) ;

				return p ;
			} ;

			var array = [
				1 , 5 , 7 ,
				Promise.resolveTimeout( 10 , 2 ) ,
				Promise.resolveTimeout( 10 , 8 )
			] ;

			return Promise.forEach( array , iterator )
				.then( () => {
					expect( results ).to.equal( [
						"before 0: 1" ,
						"after 0: 1" ,
						"before 1: 5" ,
						"after 1: 5" ,
						"before 2: 7" ,
						"after 2: 7" ,
						"before 3: 2" ,
						"after 3: 2" ,
						"before 4: 8" ,
						"after 4: 8"
					] ) ;
				} ) ;
		} ) ;

		it( "Promise.forEach() should stop and reject with the first element rejection" , () => {
			var results = [] ;

			const iterator = ( value , index ) => {
				results.push( 'before ' + index + ': ' + value ) ;

				var p = new Promise( resolve => {
					setTimeout( () => {
						results.push( 'after ' + index + ': ' + value ) ;
						resolve() ;
					} , 20 ) ;
				} ) ;

				return p ;
			} ;

			var array = [
				Promise.resolveTimeout( 10 , 1 ) ,
				Promise.resolveTimeout( 10 , 5 ) ,
				Promise.rejectTimeout( 10 , new Error( 'failed!' ) ) ,
				Promise.resolveTimeout( 10 , 2 ) ,
				Promise.resolveTimeout( 10 , 8 )
			] ;

			return Promise.forEach( array , iterator )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;
						expect( results ).to.equal( [
							"before 0: 1" ,
							"after 0: 1" ,
							"before 1: 5" ,
							"after 1: 5"
						] ) ;
					}
				) ;
		} ) ;

		it( "Promise.forEach() should stop and reject with the first iterator rejection" , () => {
			var results = [] ;

			const iterator = ( value , index ) => {
				results.push( 'before ' + index + ': ' + value ) ;

				var p = new Promise( ( resolve , reject ) => {
					setTimeout( () => {
						results.push( 'after ' + index + ': ' + value ) ;
						if ( index === 2 ) { reject( new Error( 'failed!' ) ) ; }
						else { resolve() ; }
					} , 20 ) ;
				} ) ;

				return p ;
			} ;

			var array = [
				Promise.resolveTimeout( 10 , 1 ) ,
				Promise.resolveTimeout( 10 , 5 ) ,
				Promise.resolveTimeout( 10 , 7 ) ,
				Promise.resolveTimeout( 10 , 2 ) ,
				Promise.resolveTimeout( 10 , 8 )
			] ;

			return Promise.forEach( array , iterator )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;
						expect( results ).to.equal( [
							"before 0: 1" ,
							"after 0: 1" ,
							"before 1: 5" ,
							"after 1: 5" ,
							"before 2: 7" ,
							"after 2: 7"
						] ) ;
					}
				) ;
		} ) ;
	} ) ;

	describe( "Promise.reduce()" , () => {

		it( "Promise.reduce() should run the iterator in series" , () => {
			var results = [] ;

			const iterator = ( accumulator , value , index ) => {
				results.push( 'before ' + index + ': ' + value + ' -- ' + accumulator ) ;

				var p = new Promise( resolve => {
					setTimeout( () => {
						accumulator += value ;
						results.push( 'after ' + index + ': ' + value + ' -- ' + accumulator ) ;
						resolve( accumulator ) ;
					} , 20 ) ;
				} ) ;

				return p ;
			} ;

			var array = [
				1 , 5 , 7 ,
				Promise.resolveTimeout( 10 , 2 ) ,
				Promise.resolveTimeout( 10 , 8 )
			] ;

			return Promise.reduce( array , iterator , 3 )
				.then( () => {
					expect( results ).to.equal( [
						"before 0: 1 -- 3" ,
						"after 0: 1 -- 4" ,
						"before 1: 5 -- 4" ,
						"after 1: 5 -- 9" ,
						"before 2: 7 -- 9" ,
						"after 2: 7 -- 16" ,
						"before 3: 2 -- 16" ,
						"after 3: 2 -- 18" ,
						"before 4: 8 -- 18" ,
						"after 4: 8 -- 26"
					] ) ;
				} ) ;
		} ) ;

		it( "Promise.reduce() should stop and reject with the first element rejection" , () => {
			var results = [] ;

			const iterator = ( accumulator , value , index ) => {
				results.push( 'before ' + index + ': ' + value + ' -- ' + accumulator ) ;

				var p = new Promise( resolve => {
					setTimeout( () => {
						accumulator += value ;
						results.push( 'after ' + index + ': ' + value + ' -- ' + accumulator ) ;
						resolve( accumulator ) ;
					} , 20 ) ;
				} ) ;

				return p ;
			} ;

			var array = [
				Promise.resolveTimeout( 10 , 1 ) ,
				Promise.resolveTimeout( 10 , 5 ) ,
				Promise.rejectTimeout( 10 , new Error( 'failed!' ) ) ,
				Promise.resolveTimeout( 10 , 2 ) ,
				Promise.resolveTimeout( 10 , 8 )
			] ;

			return Promise.reduce( array , iterator , 3 )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;
						expect( results ).to.equal( [
							"before 0: 1 -- 3" ,
							"after 0: 1 -- 4" ,
							"before 1: 5 -- 4" ,
							"after 1: 5 -- 9"
						] ) ;
					}
				) ;
		} ) ;

		it( "Promise.reduce() should stop and reject with the first iterator rejection" , () => {
			var results = [] ;

			const iterator = ( accumulator , value , index ) => {
				results.push( 'before ' + index + ': ' + value + ' -- ' + accumulator ) ;

				var p = new Promise( ( resolve , reject ) => {
					setTimeout( () => {
						accumulator += value ;
						results.push( 'after ' + index + ': ' + value + ' -- ' + accumulator ) ;
						if ( index === 2 ) { reject( new Error( 'failed!' ) ) ; }
						else { resolve( accumulator ) ; }
					} , 20 ) ;
				} ) ;

				return p ;
			} ;

			var array = [
				Promise.resolveTimeout( 10 , 1 ) ,
				Promise.resolveTimeout( 10 , 5 ) ,
				Promise.resolveTimeout( 10 , 7 ) ,
				Promise.resolveTimeout( 10 , 2 ) ,
				Promise.resolveTimeout( 10 , 8 )
			] ;

			return Promise.reduce( array , iterator , 3 )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;
						expect( results ).to.equal( [
							"before 0: 1 -- 3" ,
							"after 0: 1 -- 4" ,
							"before 1: 5 -- 4" ,
							"after 1: 5 -- 9" ,
							"before 2: 7 -- 9" ,
							"after 2: 7 -- 16"
						] ) ;
					}
				) ;
		} ) ;
	} ) ;

	describe( "Promise.mapObject()" , () => {

		it( "using a synchronous iterator with resolvable-promises only, it should resolve to an object of values" , () => {
			var promiseObject = {
				a: Promise.resolveTimeout( 20 , 'one' ) ,
				b: Promise.resolveTimeout( 0 , 'two' ) ,
				c: Promise.resolveTimeout( 10 , 'three' )
			} ;

			return Promise.mapObject( promiseObject , str => str + str )
				.then( values => {
					expect( values ).to.equal( { a: 'oneone' , b: 'twotwo' , c: 'threethree' } ) ;
				} ) ;
		} ) ;

		it( "using an asynchronous iterator with resolvable-promises only, it should resolve to an object of values" , () => {
			var promiseObject = {
				a: Promise.resolveTimeout( 20 , 'one' ) ,
				b: Promise.resolveTimeout( 0 , 'two' ) ,
				c: Promise.resolveTimeout( 10 , 'three' )
			} ;

			return Promise.mapObject( promiseObject , str => Promise.resolveTimeout( 10 , str + str ) )
				.then( values => {
					expect( values ).to.equal( { a: 'oneone' , b: 'twotwo' , c: 'threethree' } ) ;
				} ) ;
		} ) ;

		it( "using a synchronous throwing iterator, it should reject" , () => {
			var promiseObject = {
				a: Promise.resolveTimeout( 20 , 'one' ) ,
				b: Promise.resolveTimeout( 0 , 'two' ) ,
				c: Promise.resolveTimeout( 10 , 'three' )
			} ;

			return Promise.mapObject( promiseObject , str => { throw new Error( 'failed!' ) ; } )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;
					}
				) ;
		} ) ;

		it( "using an asynchronous rejecting iterator, it should reject" , () => {
			var promiseObject = {
				a: Promise.resolveTimeout( 20 , 'one' ) ,
				b: Promise.resolveTimeout( 0 , 'two' ) ,
				c: Promise.resolveTimeout( 10 , 'three' )
			} ;

			return Promise.mapObject( promiseObject , str => Promise.rejectTimeout( 10 ,  new Error( 'failed!' ) ) )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;
					}
				) ;
		} ) ;

		it( "using an asynchronous iterator rejecting at the end, it should reject" , () => {
			var index = 0 ;
			var promiseObject = {
				a: Promise.resolveTimeout( 20 , 'one' ) ,
				b: Promise.resolveTimeout( 0 , 'two' ) ,
				c: Promise.resolveTimeout( 10 , 'three' )
			} ;

			return Promise.mapObject( promiseObject , str => {
				if ( ++ index === 3 ) { return Promise.rejectTimeout( 10 ,  new Error( 'failed!' ) ) ; }
				return Promise.resolveTimeout( 10 , str + str ) ;
			} )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;
					}
				) ;
		} ) ;

		it( "no iterator call should be wasted if the Promise.mapObject() has already failed" , done => {
			var count = 0 , order = [] , p ;

			var promiseObject = {
				a: ( p = Promise.resolveTimeout( 30 , 'one' ) ) ,
				b: Promise.resolveTimeout( 0 , 'two' ) ,
				c: Promise.rejectTimeout( 20 , new Error( 'failed!' ) ) ,
				d: Promise.resolveTimeout( 10 , 'four' )
			} ;

			const iterator = ( str , k ) => {
				count ++ ;
				order.push( k + ': ' + str ) ;
				return Promise.resolveTimeout( 10 , str + str ) ;
			} ;

			Promise.mapObject( promiseObject , iterator )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;

						// Wait 20ms after the slowest promise, to ensure the iterator can be called
						p.then( () => Promise.resolveTimeout( 20 ) )
							.then( () => {
								expect( order ).to.equal( [ 'b: two' , 'd: four' ] ) ;
								expect( count ).to.be( 2 ) ;
								done() ;
							} )
							.catch( error => done( error || new Error() ) ) ;
					}
				)
				.catch( error => done( error || new Error() ) ) ;
		} ) ;
	} ) ;

	describe( "Promise.concurrent()" , () => {

		it( "using an asynchronous iterator with resolvable-promises only, it should respect concurrency limit" , () => {
			var runData = [ 'wait' , 'wait' , 'wait' , 'wait' , 'wait' , 'wait' , 'wait' ] ;

			var iterator = async ( str , index ) => {
				//console.log( "before:" , str , index , runData ) ;
				switch ( index ) {
					case 0 :
						expect( runData ).to.equal( [ 'wait' , 'run' , 'wait' , 'wait' , 'wait' , 'wait' , 'wait' ] ) ;
						break ;
					case 1 :
						expect( runData ).to.equal( [ 'wait' , 'wait' , 'wait' , 'wait' , 'wait' , 'wait' , 'wait' ] ) ;
						break ;
					case 2 :
						expect( runData ).to.equal( [ 'run' , 'end' , 'wait' , 'run' , 'wait' , 'wait' , 'wait' ] ) ;
						break ;
					case 3 :
						expect( runData ).to.equal( [ 'run' , 'end' , 'wait' , 'wait' , 'wait' , 'wait' , 'wait' ] ) ;
						break ;
					case 4 :
						expect( runData ).to.equal( [ 'end' , 'end' , 'run' , 'run' , 'wait' , 'wait' , 'wait' ] ) ;
						break ;
					case 5 :
						expect( runData ).to.equal( [ 'end' , 'end' , 'run' , 'end' , 'run' , 'wait' , 'wait' ] ) ;
						break ;
					case 6 :
						expect( runData ).to.equal( [ 'end' , 'end' , 'end' , 'end' , 'run' , 'run' , 'wait' ] ) ;
						break ;
				}

				runData[ index ] = 'run' ;

				await Promise.resolveTimeout( 60 ) ;

				//console.log( "after:" , str , index , runData ) ;
				switch ( index ) {
					case 0 :
						expect( runData ).to.equal( [ 'run' , 'end' , 'run' , 'run' , 'wait' , 'wait' , 'wait' ] ) ;
						break ;
					case 1 :
						expect( runData ).to.equal( [ 'run' , 'run' , 'wait' , 'wait' , 'wait' , 'wait' , 'wait' ] ) ;
						break ;
					case 2 :
						expect( runData ).to.equal( [ 'end' , 'end' , 'run' , 'end' , 'run' , 'run' , 'wait' ] ) ;
						break ;
					case 3 :
						expect( runData ).to.equal( [ 'end' , 'end' , 'run' , 'run' , 'run' , 'wait' , 'wait' ] ) ;
						break ;
					case 4 :
						expect( runData ).to.equal( [ 'end' , 'end' , 'end' , 'end' , 'run' , 'run' , 'run' ] ) ;
						break ;
					case 5 :
						expect( runData ).to.equal( [ 'end' , 'end' , 'end' , 'end' , 'end' , 'run' , 'run' ] ) ;
						break ;
					case 6 :
						expect( runData ).to.equal( [ 'end' , 'end' , 'end' , 'end' , 'end' , 'end' , 'run' ] ) ;
						break ;
				}

				runData[ index ] = 'end' ;
				return str + str ;
			} ;

			var promiseArray = [
				Promise.resolveTimeout( 40 , 'zero' ) ,		// start at 0, done at 100
				Promise.resolveTimeout( 0 , 'one' ) ,		// 0/60
				Promise.resolveTimeout( 80 , 'two' ) ,		// 0/140
				Promise.resolveTimeout( 40 , 'three' ) ,	// 60/160
				Promise.resolveTimeout( 20 , 'four' ) ,		// 100/180
				Promise.resolveTimeout( 40 , 'five' ) ,		// 140/240
				Promise.resolveTimeout( 40 , 'six' ) 		// 160/260
			] ;

			return Promise.concurrent( 3 , promiseArray , iterator )
				.then( values => {
					expect( values ).to.equal( [ 'zerozero' , 'oneone' , 'twotwo' , 'threethree' , 'fourfour' , 'fivefive' , 'sixsix' ] ) ;
				} ) ;
		} ) ;

		it( "using a synchronous throwing iterator, it should reject" , () => {
			var promiseArray = [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] ;

			return Promise.concurrent( 2 , promiseArray , str => { throw new Error( 'failed!' ) ; } )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;
					}
				) ;
		} ) ;

		it( "using an asynchronous rejecting iterator, it should reject" , () => {
			var promiseArray = [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' ) ,
				Promise.resolveTimeout( 0 , 'four' ) ,
				Promise.resolveTimeout( 10 , 'five' )
			] ;

			return Promise.concurrent( 2 , promiseArray , str => Promise.rejectTimeout( 10 ,  new Error( 'failed!' ) ) )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;
					}
				) ;
		} ) ;

		it( "using an asynchronous iterator rejecting at the end, it should reject" , () => {
			var index = 0 ;
			var promiseArray = [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] ;

			return Promise.concurrent( 2 , promiseArray , str => {
				if ( ++ index === 3 ) { return Promise.rejectTimeout( 10 ,  new Error( 'failed!' ) ) ; }
				return Promise.resolveTimeout( 10 , str + str ) ;
			} )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;
					}
				) ;
		} ) ;

		it( "no iterator call should be wasted if the Promise.map() has already failed" , done => {
			var count = 0 , order = [] , p ;

			var promiseArray = [
				( p = Promise.resolveTimeout( 20 , 'one' ) ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.rejectTimeout( 10 , new Error( 'failed!' ) )
			] ;

			const iterator = str => {
				count ++ ;
				order.push( str ) ;
				return Promise.resolveTimeout( 10 , str + str ) ;
			} ;

			Promise.concurrent( 2 , promiseArray , iterator )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.be( 'failed!' ) ;

						// Wait 20ms after the slowest promise, to ensure the iterator can be called
						p.then( () => Promise.resolveTimeout( 20 ) )
							.then( () => {
								expect( order ).to.equal( [ 'two' ] ) ;
								expect( count ).to.be( 1 ) ;
								done() ;
							} )
							.catch( error => done( error || new Error() ) ) ;
					}
				)
				.catch( error => done( error || new Error() ) ) ;
		} ) ;
	} ) ;

	describe( "Promise.race()" , () => {

		it( "with resolvable-promises only, it should resolve to the fastest promise's value" , () => {
			return Promise.race( [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] )
				.then( value => {
					expect( value ).to.be( 'two' ) ;
				} ) ;
		} ) ;

		it( "with rejectable-promises only, it should reject with the first rejection" , () => {
			return Promise.race( [
				Promise.rejectTimeout( 20 , new Error( 'rejection1' ) ) ,
				Promise.rejectTimeout( 0 , new Error( 'rejection2' ) ) ,
				Promise.rejectTimeout( 10 , new Error( 'rejection3' ) )
			] )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.equal( 'rejection2' ) ;
					}
				) ;
		} ) ;

		it( "with a mix of resolvable and rejectable, it should be settled by whichever promise resolve or reject first" , async () => {
			await Promise.race( [
				Promise.rejectTimeout( 20 , new Error( 'rejection1' ) ) ,
				Promise.resolveTimeout( 0 , 'two' ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] )
				.then( value => {
					expect( value ).to.be( 'two' ) ;
				} ) ;

			await Promise.race( [
				Promise.resolveTimeout( 20 , 'one' ) ,
				Promise.rejectTimeout( 0 , new Error( 'rejection2' ) ) ,
				Promise.resolveTimeout( 10 , 'three' )
			] )
				.then(
					() => { throw new Error( 'Should throw!' ) ; } ,
					error => {
						expect( error.message ).to.equal( 'rejection2' ) ;
					} ) ;
		} ) ;

		it( "with en empty array, it should hang forever" , async () => {
			var promise = Promise.race( [] ) ;
			await Promise.resolveTimeout( 500 ) ;
			expect( promise.getStatus() ).to.be( 'dormant' ) ;
		} ) ;
	} ) ;

} ) ;



describe( "Decorators" , () => {

	it( "promisify node style callback function, limit to one argument after the error argument -- .promisify()" , done => {
		const okFn = ( callback ) => {
			setTimeout( () => callback( undefined , 'arg' , 'trash' ) , 10 ) ;
		} ;

		const koFn = ( callback ) => {
			setTimeout( () => callback( new Error( 'failed!' ) ) , 10 ) ;
		} ;

		const promisifiedOkFn = Promise.promisify( okFn ) ;
		const promisifiedKoFn = Promise.promisify( koFn ) ;

		promisifiedOkFn().then( value => {
			expect( value ).to.be( 'arg' ) ;

			promisifiedKoFn().then(
				() => { throw new Error( 'Should throw!' ) ; } ,
				error => {
					expect( error.message ).to.be( 'failed!' ) ;
					expect( error ).not.to.have.property( 'arg' ) ;
					expect( error ).not.to.have.property( 'args' ) ;
					done() ;
				}
			)
				.catch( error => done( error || new Error() ) ) ;
		} )
			.catch( error => done( error || new Error() ) ) ;
	} ) ;

	it( "promisify node style callback function -- .promisifyAll()" , done => {
		const okFn = ( callback ) => {
			setTimeout( () => callback( undefined , 'arg1' , 'arg2' , 'arg3' ) , 10 ) ;
		} ;

		const koFn = ( callback ) => {
			setTimeout( () => callback( new Error( 'failed!' ) ) , 10 ) ;
		} ;

		const promisifiedOkFn = Promise.promisifyAll( okFn ) ;
		const promisifiedKoFn = Promise.promisifyAll( koFn ) ;

		promisifiedOkFn().then( value => {
			expect( value ).to.equal( [ 'arg1' , 'arg2' , 'arg3' ] ) ;

			promisifiedKoFn().then(
				() => { throw new Error( 'Should throw!' ) ; } ,
				error => {
					expect( error.message ).to.be( 'failed!' ) ;
					expect( error ).not.to.have.property( 'arg' ) ;
					expect( error ).not.to.have.property( 'args' ) ;
					done() ;
				}
			)
				.catch( error => done( error || new Error() ) ) ;
		} )
			.catch( error => done( error || new Error() ) ) ;
	} ) ;

	it( "promisify node style callback function and error extra argument -- .promisify()" , done => {
		const okFn = ( callback ) => {
			setTimeout( () => callback( undefined , 'arg' , 'trash' ) , 10 ) ;
		} ;

		const koFn = ( callback ) => {
			setTimeout( () => callback( new Error( 'failed!' ) , 'arg1' , 'arg2' ) , 10 ) ;
		} ;

		const promisifiedOkFn = Promise.promisify( okFn ) ;
		const promisifiedKoFn = Promise.promisify( koFn ) ;

		promisifiedOkFn().then( value => {
			expect( value ).to.be( 'arg' ) ;

			promisifiedKoFn().then(
				() => { throw new Error( 'Should throw!' ) ; } ,
				error => {
					expect( error.message ).to.be( 'failed!' ) ;
					expect( error.arg ).to.be( 'arg1' ) ;
					expect( error ).not.to.have.property( 'args' ) ;
					done() ;
				}
			)
				.catch( error => done( error || new Error() ) ) ;
		} )
			.catch( error => done( error || new Error() ) ) ;
	} ) ;

	it( "promisify node style callback function and error extra arguments -- .promisifyAll()" , done => {
		const okFn = ( callback ) => {
			setTimeout( () => callback( undefined , 'arg1' , 'arg2' , 'arg3' ) , 10 ) ;
		} ;

		const koFn = ( callback ) => {
			setTimeout( () => callback( new Error( 'failed!' ) , 'arg1' , 'arg2' ) , 10 ) ;
		} ;

		const promisifiedOkFn = Promise.promisifyAll( okFn ) ;
		const promisifiedKoFn = Promise.promisifyAll( koFn ) ;

		promisifiedOkFn().then( value => {
			expect( value ).to.equal( [ 'arg1' , 'arg2' , 'arg3' ] ) ;

			promisifiedKoFn().then(
				() => { throw new Error( 'Should throw!' ) ; } ,
				error => {
					expect( error.message ).to.be( 'failed!' ) ;
					expect( error ).not.to.have.property( 'arg' ) ;
					expect( error.args ).to.equal( [ 'arg1' , 'arg2' ] ) ;
					done() ;
				}
			)
				.catch( error => done( error || new Error() ) ) ;
		} )
			.catch( error => done( error || new Error() ) ) ;
	} ) ;

	it( "return value interceptor -- .returnValueInterceptor()" , () => {
		var index = 0 ;
		var returnArray = [ 'one' , 'two' , 'three' ] ;
		var results = [] ;

		const fn = () => {
			return returnArray[ index ++ ] ;
		} ;

		const interceptorFn = value => {
			results.push( value ) ;
		} ;

		const interceptableFn = Promise.returnValueInterceptor( interceptorFn , fn ) ;

		interceptableFn() ;
		interceptableFn() ;
		interceptableFn() ;

		expect( results ).to.equal( returnArray ) ;
	} ) ;

	it( "run once -- .once()" , done => {
		var results = [] ;

		const asyncFn = ( value ) => {
			results.push( value ) ;
			var p = Promise.resolveTimeout( 20 , value ) ;
			return p ;
		} ;

		const onceFn = Promise.once( asyncFn ) ;

		onceFn( 'one' ) ;
		onceFn( 'two' ) ;
		onceFn( 'three' ) ;
		onceFn( 'four' ) ;

		setTimeout( () => {
			onceFn( 'five' ).then( () => {
				//console.log( results ) ;
				expect( results ).to.equal( [ 'one' ] ) ;
				done() ;
			} )
				.catch( error => done( error ) ) ;
		} , 40 ) ;
	} ) ;

	it( "serialize, successive executions never overlap -- .serialize()" , done => {
		var results = [] ;

		const asyncFn = ( value ) => {
			results.push( 'before: ' + value ) ;

			var p = new Promise( resolve => {
				setTimeout( () => {
					results.push( 'after: ' + value ) ;
					resolve() ;
				} , 20 ) ;
			} ) ;

			return p ;
		} ;

		const serializedFn = Promise.serialize( asyncFn ) ;

		serializedFn( 'one' ) ;
		serializedFn( 'two' ) ;
		serializedFn( 'three' ) ;
		serializedFn( 'four' ) ;

		setTimeout( () => {
			serializedFn( 'five' ).then( () => {
				//console.log( results ) ;
				expect( results ).to.equal( [
					"before: one" ,
					"after: one" ,
					"before: two" ,
					"after: two" ,
					"before: three" ,
					"after: three" ,
					"before: four" ,
					"after: four" ,
					"before: five" ,
					"after: five"
				] ) ;
				done() ;
			} )
				.catch( error => done( error ) ) ;
		} , 40 ) ;
	} ) ;

	it( "debounce -- .debounce()" , done => {
		var results = [] ;

		const asyncFn = ( value ) => {
			results.push( value ) ;
			var p = Promise.resolveTimeout( 20 , value ) ;
			return p ;
		} ;

		const debouncedFn = Promise.debounce( asyncFn ) ;

		debouncedFn( 'one' ) ;
		debouncedFn( 'two' ) ;
		debouncedFn( 'three' ) ;
		debouncedFn( 'four' ) ;

		setTimeout( () => {
			debouncedFn( 'five' ).then( () => {
				//console.log( results ) ;
				expect( results ).to.equal( [ 'one' , 'five' ] ) ;
				done() ;
			} )
				.catch( error => done( error ) ) ;
		} , 40 ) ;
	} ) ;

	it( "debounce with an extra cooldown delay -- .debounceDelay()" , done => {
		var results = [] ;

		const asyncFn = ( value ) => {
			results.push( value ) ;
			var p = Promise.resolveTimeout( 20 , value ) ;
			return p ;
		} ;

		const debouncedFn = Promise.debounceDelay( 60 , asyncFn ) ;

		debouncedFn( 'one' ) ;
		debouncedFn( 'two' ) ;
		debouncedFn( 'three' ) ;
		debouncedFn( 'four' ) ;
		
		// Not enough! there is an extra delay! 60 + 20 = 80ms
		setTimeout( () => debouncedFn( 'five' ) , 40 ) ;

		setTimeout( () => {
			debouncedFn( 'six' ).then( () => {
				//console.log( results ) ;
				expect( results ).to.equal( [ 'one' , 'six' ] ) ;
				done() ;
			} )
				.catch( error => done( error ) ) ;
		} , 100 ) ;
	} ) ;

	it( "debounce update -- .debounceUpdate()" , done => {
		var results = [] ;

		const asyncFn = ( value ) => {
			results.push( value ) ;
			var p = Promise.resolveTimeout( 20 , value ) ;
			return p ;
		} ;

		const debouncedFn = Promise.debounceUpdate( asyncFn ) ;

		debouncedFn( 'one' ) ;
		debouncedFn( 'two' ) ;
		debouncedFn( 'three' ) ;
		debouncedFn( 'four' ) ;

		setTimeout( () => {
			debouncedFn( 'five' ).then( () => {
				//console.log( results ) ;
				expect( results ).to.equal( [ 'one' , 'four' , 'five' ] ) ;
				done() ;
			} )
				.catch( error => done( error ) ) ;
		} , 40 ) ;
	} ) ;


	// decorator variant
	it( "timeout -- .timeout()" , () => {
		var index = 0 ;
		var times = [ 0 , 10 , 40 , 10 ] ;
		var results = [] ;

		const asyncFn = ( value ) => {
			var p = Promise.resolveTimeout( times[ index ++ ] , value ) ;
			return p ;
		} ;

		const timedOutFn = Promise.timeout( 20 , asyncFn ) ;

		return Promise.all( [
			timedOutFn().then( () => results[ 0 ] = true , () => results[ 0 ] = false ) ,
			timedOutFn().then( () => results[ 1 ] = true , () => results[ 1 ] = false ) ,
			timedOutFn().then( () => results[ 2 ] = true , () => results[ 2 ] = false ) ,
			timedOutFn().then( () => results[ 3 ] = true , () => results[ 3 ] = false )
		] ).then( () => {
			expect( results ).to.equal( [ true , true , false , true ] ) ;
		} ) ;
	} ) ;

	it( "variable (per call) timeout -- .variableTimeout()" , () => {
		var index = 0 ;
		var times = [ 0 , 10 , 40 , 20 ] ;
		var results = [] ;

		const asyncFn = ( value ) => {
			var p = Promise.resolveTimeout( times[ index ++ ] , value ) ;
			return p ;
		} ;

		const timedOutFn = Promise.variableTimeout( asyncFn ) ;

		return Promise.all( [
			timedOutFn( 10 ).then( () => results[ 0 ] = true , () => results[ 0 ] = false ) ,
			timedOutFn( 0 ).then( () => results[ 1 ] = true , () => results[ 1 ] = false ) ,
			timedOutFn( 20 ).then( () => results[ 2 ] = true , () => results[ 2 ] = false ) ,
			timedOutFn( 30 ).then( () => results[ 3 ] = true , () => results[ 3 ] = false )
		] ).then( () => {
			expect( results ).to.equal( [ true , false , false , true ] ) ;
		} ) ;
	} ) ;

	it( "Test decorators thisBinding behavior" ) ;

	describe( "Debounce sync test suite -- .debounceSync()" , () => {
		var results , debouncedGetFn , debouncedFullSyncFn ;

		const getFn = ( resource , value ) => {
			value = 'get:' + value ;
			results.push( value ) ;
			var p = Promise.resolveTimeout( 20 , value ) ;
			p.then( () => results.push( 'end:' + value ) ) ;
			return p ;
		} ;

		const fullSyncFn = ( resource , value ) => {
			value = 'fullSync:' + value ;
			results.push( value ) ;
			//console.log( value ) ;
			var p = Promise.resolveTimeout( 20 , value ) ;
			p.then( () => {
				//console.log( 'end:' + value ) ;
				results.push( 'end:' + value )
			} ) ;
			return p ;
		} ;

		it( "get only" , async () => {
			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn } , { fn: fullSyncFn } ) ;
			results = [] ;
			debouncedGetFn( 'resource#1' , 'one' ) ;
			debouncedGetFn( 'resource#1' , 'two' ) ;
			debouncedGetFn( 'resource#1' , 'three' ) ;
			await debouncedGetFn( 'resource#1' , 'four' ) ;
			await debouncedGetFn( 'resource#1' , 'five' ) ;
			expect( results ).to.equal( [ 'get:one' , 'end:get:one' , 'get:five' , 'end:get:five' ] ) ;
		} ) ;

		it( "fullSync only" , async () => {
			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn } , { fn: fullSyncFn } ) ;
			results = [] ;
			debouncedFullSyncFn( 'resource#1' , 'one' ) ;
			debouncedFullSyncFn( 'resource#1' , 'two' ) ;
			debouncedFullSyncFn( 'resource#1' , 'three' ) ;
			await debouncedFullSyncFn( 'resource#1' , 'four' ) ;
			await debouncedFullSyncFn( 'resource#1' , 'five' ) ;
			expect( results ).to.equal( [ 'fullSync:one' , 'end:fullSync:one' , 'fullSync:four' , 'end:fullSync:four' , 'fullSync:five' , 'end:fullSync:five' ] ) ;
		} ) ;

		it( "get before fullSync" , async () => {
			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn } , { fn: fullSyncFn } ) ;
			results = [] ;
			debouncedGetFn( 'resource#1' , 'one' ) ;
			await debouncedFullSyncFn( 'resource#1' , 'two' ) ;
			expect( results ).to.equal( [ 'get:one' , 'end:get:one' , 'fullSync:two' , 'end:fullSync:two' ] ) ;
		} ) ;

		it( "get before 2 fullSync" , async () => {
			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn } , { fn: fullSyncFn } ) ;
			results = [] ;
			debouncedGetFn( 'resource#1' , 'one' ) ;
			debouncedFullSyncFn( 'resource#1' , 'two' ) ;
			await debouncedFullSyncFn( 'resource#1' , 'three' ) ;
			expect( results ).to.equal( [ 'get:one' , 'end:get:one' , 'fullSync:three' , 'end:fullSync:three' ] ) ;
		} ) ;

		it( "get after fullSync" , async () => {
			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn } , { fn: fullSyncFn } ) ;
			results = [] ;
			debouncedFullSyncFn( 'resource#1' , 'one' ) ;
			await debouncedGetFn( 'resource#1' , 'two' ) ;
			expect( results ).to.equal( [ 'fullSync:one' , 'end:fullSync:one' ] ) ;
		} ) ;

		it( "2 get after fullSync" , async () => {
			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn } , { fn: fullSyncFn } ) ;
			results = [] ;
			debouncedFullSyncFn( 'resource#1' , 'one' ) ;
			debouncedGetFn( 'resource#1' , 'two' ) ;
			await debouncedGetFn( 'resource#1' , 'three' ) ;
			expect( results ).to.equal( [ 'fullSync:one' , 'end:fullSync:one' ] ) ;
		} ) ;

		it( "2 get after fullSync, then 1 get" , async () => {
			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn } , { fn: fullSyncFn } ) ;
			results = [] ;
			debouncedFullSyncFn( 'resource#1' , 'one' ) ;
			debouncedGetFn( 'resource#1' , 'two' ) ;
			await debouncedGetFn( 'resource#1' , 'three' ) ;
			await debouncedGetFn( 'resource#1' , 'four' ) ;
			expect( results ).to.equal( [ 'fullSync:one' , 'end:fullSync:one' , 'get:four' , 'end:get:four' ] ) ;
		} ) ;

		it( "test delays for get" , async () => {
			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn , delay: 50 } , { fn: fullSyncFn } ) ;
			results = [] ;
			await debouncedGetFn( 'resource#1' , 'one' ) ;
			// Cause it return immediately for the next 3
			await debouncedGetFn( 'resource#1' , 'two' ) ;
			await debouncedGetFn( 'resource#1' , 'three' ) ;
			await debouncedGetFn( 'resource#1' , 'four' ) ;
			expect( results ).to.equal( [ 'get:one' , 'end:get:one' ] ) ;

			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn , delay: 50 } , { fn: fullSyncFn } ) ;
			results = [] ;
			await debouncedGetFn( 'resource#1' , 'one' ) ;
			await Promise.resolveTimeout( 30 ) ;
			await debouncedGetFn( 'resource#1' , 'two' ) ;
			await Promise.resolveTimeout( 30 ) ;
			await debouncedGetFn( 'resource#1' , 'three' ) ;
			await Promise.resolveTimeout( 30 ) ;
			await debouncedGetFn( 'resource#1' , 'four' ) ;
			await Promise.resolveTimeout( 30 ) ;
			await debouncedGetFn( 'resource#1' , 'five' ) ;
			expect( results ).to.equal( [ 'get:one' , 'end:get:one' , 'get:three' , 'end:get:three' , 'get:five' , 'end:get:five' ] ) ;
		} ) ;

		it( "test delays for get when Promise.NO_DELAY is used before the function args" , async () => {
			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn , delay: 50 } , { fn: fullSyncFn } ) ;
			results = [] ;
			await debouncedGetFn( 'resource#1' , 'one' ) ;
			await Promise.resolveTimeout( 30 ) ;
			await debouncedGetFn( 'resource#1' , Promise.NO_DELAY , 'two' ) ;
			await Promise.resolveTimeout( 30 ) ;
			await debouncedGetFn( 'resource#1' , Promise.NO_DELAY , 'three' ) ;
			await Promise.resolveTimeout( 30 ) ;
			await debouncedGetFn( 'resource#1' , 'four' ) ;
			await Promise.resolveTimeout( 30 ) ;
			await debouncedGetFn( 'resource#1' , 'five' ) ;
			expect( results ).to.equal( [ 'get:one' , 'end:get:one' , 'get:two' , 'end:get:two' , 'get:three' , 'end:get:three' , 'get:five' , 'end:get:five' ] ) ;
		} ) ;

		it( "test delays for get when Promise.BATCH_NO_DELAY is used before the function args" , async () => {
			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn , delay: 50 } , { fn: fullSyncFn } ) ;
			results = [] ;
			await debouncedGetFn( 'resource#1' , 'one' ) ;
			await Promise.resolveTimeout( 30 ) ;
			await debouncedGetFn( 'resource#1' , Promise.BATCH_NO_DELAY , 'batch' , 'two' ) ;
			await Promise.resolveTimeout( 30 ) ;
			await debouncedGetFn( 'resource#1' , Promise.BATCH_NO_DELAY , 'batch' , 'three' ) ;
			await Promise.resolveTimeout( 30 ) ;
			await debouncedGetFn( 'resource#1' , Promise.BATCH_NO_DELAY , 'batch' , 'four' ) ;
			await Promise.resolveTimeout( 30 ) ;
			await debouncedGetFn( 'resource#1' , Promise.BATCH_NO_DELAY , 'batch2' ,'five' ) ;
			expect( results ).to.equal( [ 'get:one' , 'end:get:one' , 'get:two' , 'end:get:two' , 'get:four' , 'end:get:four' , 'get:five' , 'end:get:five' ] ) ;
		} ) ;

		it( "test delays for fullSync" , async () => {
			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn } , { fn: fullSyncFn , delay: 50 } ) ;
			results = [] ;
			await debouncedFullSyncFn( 'resource#1' , 'one' ) ;
			debouncedFullSyncFn( 'resource#1' , 'two' ) ;
			debouncedFullSyncFn( 'resource#1' , 'three' ) ;
			await debouncedFullSyncFn( 'resource#1' , 'four' ) ;
			expect( results ).to.equal( [ 'fullSync:one' , 'end:fullSync:one' , 'fullSync:four' , 'end:fullSync:four' ] ) ;

			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn } , { fn: fullSyncFn , delay: 50 } ) ;
			results = [] ;
			await debouncedFullSyncFn( 'resource#1' , 'one' ) ;
			await Promise.resolveTimeout( 60 ) ;
			debouncedFullSyncFn( 'resource#1' , 'two' ) ;
			debouncedFullSyncFn( 'resource#1' , 'three' ) ;
			await debouncedFullSyncFn( 'resource#1' , 'four' ) ;
			expect( results ).to.equal( [ 'fullSync:one' , 'end:fullSync:one' , 'fullSync:two' , 'end:fullSync:two' , 'fullSync:four' , 'end:fullSync:four' ] ) ;

			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn } , { fn: fullSyncFn , delay: 50 } ) ;
			results = [] ;
			debouncedFullSyncFn( 'resource#1' , 'one' ) ;
			debouncedFullSyncFn( 'resource#1' , 'two' ) ;
			// 60 < 20 + 50
			await Promise.resolveTimeout( 60 ) ;
			await debouncedFullSyncFn( 'resource#1' , 'three' ) ;
			//await debouncedFullSyncFn( 'resource#1' , 'four' ) ;
			expect( results ).to.equal( [ 'fullSync:one' , 'end:fullSync:one' , 'fullSync:three' , 'end:fullSync:three' ] ) ;

			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn } , { fn: fullSyncFn , delay: 50 } ) ;
			results = [] ;
			debouncedFullSyncFn( 'resource#1' , 'one' ) ;
			debouncedFullSyncFn( 'resource#1' , 'two' ) ;
			// 80 > 20 + 50
			await Promise.resolveTimeout( 80 ) ;
			await debouncedFullSyncFn( 'resource#1' , 'three' ) ;
			//await debouncedFullSyncFn( 'resource#1' , 'four' ) ;
			expect( results ).to.equal( [ 'fullSync:one' , 'end:fullSync:one' , 'fullSync:two' , 'end:fullSync:two' , 'fullSync:three' , 'end:fullSync:three' ] ) ;
		} ) ;

		it( "test delays for fullSync when Promise.NO_DELAY is used before to the function args" , async () => {
			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn } , { fn: fullSyncFn , delay: 50 } ) ;
			results = [] ;
			await debouncedFullSyncFn( 'resource#1' , 'one' ) ;
			await debouncedFullSyncFn( 'resource#1' , Promise.NO_DELAY , 'two' ) ;
			debouncedFullSyncFn( 'resource#1' , Promise.NO_DELAY , 'three' ) ;
			await debouncedFullSyncFn( 'resource#1' , 'four' ) ;
			expect( results ).to.equal( [ 'fullSync:one' , 'end:fullSync:one' , 'fullSync:two' , 'end:fullSync:two' , 'fullSync:three' , 'end:fullSync:three' , 'fullSync:four' , 'end:fullSync:four' ] ) ;
		} ) ;

		it( "test delays for fullSync when Promise.BATCH_NO_DELAY is used before to the function args" , async () => {
			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn } , { fn: fullSyncFn , delay: 50 } ) ;
			results = [] ;
			await debouncedFullSyncFn( 'resource#1' , 'one' ) ;
			await debouncedFullSyncFn( 'resource#1' , Promise.BATCH_NO_DELAY , 'batch' , 'two' ) ;
			debouncedFullSyncFn( 'resource#1' , Promise.BATCH_NO_DELAY , 'batch' , 'three' ) ;
			await debouncedFullSyncFn( 'resource#1' , 'four' ) ;
			expect( results ).to.equal( [ 'fullSync:one' , 'end:fullSync:one' , 'fullSync:two' , 'end:fullSync:two' , 'fullSync:four' , 'end:fullSync:four' ] ) ;
		} ) ;

		it( "different resources should not be debounced" , async () => {
			[ debouncedGetFn , debouncedFullSyncFn ] = Promise.debounceSync( { fn: getFn } , { fn: fullSyncFn } ) ;
			results = [] ;
			debouncedGetFn( 'resource#1' , 'one' ) ;
			debouncedGetFn( 'resource#2' , 'two' ) ;
			debouncedGetFn( 'resource#3' , 'three' ) ;
			await debouncedGetFn( 'resource#1' , 'four' ) ;
			await debouncedGetFn( 'resource#1' , 'five' ) ;
			
			//expect( results ).to.equal( [ 'get:one' , 'get:two' , 'get:three' , 'end:get:one' , 'end:get:two' , 'end:get:three' , 'get:five' , 'end:get:five' ] ) ;
			expect( results ).to.equal( [ 'get:one' , 'get:two' , 'get:three' , 'end:get:one' , 'get:five' , 'end:get:two' , 'end:get:three' , 'end:get:five' ] ) ;
		} ) ;
	} ) ;
} ) ;



describe( "Wrappers" , () => {

	// wrapper variant
	it( "timeout -- .timeLimit()" , () => {
		var index = 0 ;
		var times = [ 0 , 10 , 40 , 10 ] ;
		var results = [] ;

		const asyncFn = ( value ) => {
			return Promise.resolveTimeout( times[ index ++ ] , value ) ;
		} ;

		return Promise.all( [
			Promise.timeLimit( 20 , () => asyncFn() ).then( () => results[ 0 ] = true , () => results[ 0 ] = false ) ,
			Promise.timeLimit( 20 , () => asyncFn() ).then( () => results[ 1 ] = true , () => results[ 1 ] = false ) ,
			Promise.timeLimit( 20 , () => asyncFn() ).then( () => results[ 2 ] = true , () => results[ 2 ] = false ) ,
			Promise.timeLimit( 20 , () => asyncFn() ).then( () => results[ 3 ] = true , () => results[ 3 ] = false )
		] ).then( () => {
			expect( results ).to.equal( [ true , true , false , true ] ) ;
		} ) ;
	} ) ;

	it( "timeout -- .timeLimit() promise variant" , async () => {
		var index = 0 ;
		var times = [ 0 , 10 , 40 , 10 ] ;
		var results = [] ;

		return Promise.all( [
			Promise.timeLimit( 20 , Promise.resolveTimeout( times[ index ++ ] ) ).then( () => results[ 0 ] = true , () => results[ 0 ] = false ) ,
			Promise.timeLimit( 20 , Promise.resolveTimeout( times[ index ++ ] ) ).then( () => results[ 1 ] = true , () => results[ 1 ] = false ) ,
			Promise.timeLimit( 20 , Promise.resolveTimeout( times[ index ++ ] ) ).then( () => results[ 2 ] = true , () => results[ 2 ] = false ) ,
			Promise.timeLimit( 20 , Promise.resolveTimeout( times[ index ++ ] ) ).then( () => results[ 3 ] = true , () => results[ 3 ] = false )
		] ).then( () => {
			expect( results ).to.equal( [ true , true , false , true ] ) ;
		} ) ;
	} ) ;

	// wrapper variant
	it( "retry after failure -- .retry()" , done => {
		var count = 0 ;

		const asyncFn = () => {
			count ++ ;
			if ( count < 4 ) { return Promise.rejectTimeout( 20 , new Error( 'error!' ) ) ; }
			return Promise.resolveTimeout( 20 , 'yay!' ) ;
		} ;

		// The first one should succeed
		Promise.retry( { retries: 5 , delay: 10 , raiseFactor: 1.5 } , asyncFn ).then( value => {
			expect( value ).to.be( 'yay!' ) ;
			expect( count ).to.be( 4 ) ;

			count = 0 ;

			// The second one should throw
			Promise.retry( { retries: 2 , delay: 10 , raiseFactor: 1.5 } , asyncFn ).then( () => {
				done( new Error( 'It should throw!' ) ) ;
			} )
				.catch( () => done() ) ;

		} )
			.catch( error => done( error || new Error() ) ) ;
	} ) ;

	it( "retry with timeout -- .retry()" , done => {
		var count = 0 ;

		const asyncFn = () => {
			count ++ ;
			if ( count < 4 ) { return Promise.rejectTimeout( 20 , new Error( 'error!wsd' ) ) ; }
			return Promise.resolveTimeout( 20 , 'yay!' ) ;
		} ;

		// The first one should succeed
		Promise.retry( {
			retries: 5 , delay: 10 , raiseFactor: 1.5 , timeout: 40
		} , asyncFn ).then( value => {
			expect( value ).to.be( 'yay!' ) ;
			expect( count ).to.be( 4 ) ;

			count = 0 ;

			// The second one should throw
			Promise.retry( {
				retries: 5 , delay: 10 , raiseFactor: 1.5 , timeout: 5
			} , asyncFn ).then( () => {
				done( new Error( 'It should throw!' ) ) ;
			} )
				.catch( () => done() ) ;

		} )
			.catch( error => done( error || new Error() ) ) ;
	} ) ;

	it( "retry with catch -- .retry()" , done => {
		var count = 0 ;

		const asyncFn = () => {
			count ++ ;
			if ( count < 4 ) { return Promise.rejectTimeout( 20 , new Error( 'error!' ) ) ; }
			return Promise.resolveTimeout( 20 , 'yay!' ) ;
		} ;

		// The first one should succeed
		Promise.retry( { retries: 5 , catch: error => { if ( error.message !== 'error!' ) { throw error ; } } } , asyncFn ).then( value => {
			expect( value ).to.be( 'yay!' ) ;
			expect( count ).to.be( 4 ) ;

			count = 0 ;

			// The second one should throw
			Promise.retry( { retries: 5 , catch: error => { if ( error.message === 'error!' ) { throw error ; } } } , asyncFn ).then( () => {
				done( new Error( 'It should throw!' ) ) ;
			} )
				.catch( () => done() ) ;

		} )
			.catch( error => done( error || new Error() ) ) ;
	} ) ;

	it( ".onceEvent()" , async () => {
		var results ;
		var bus = Object.create( require( 'events' ).prototype ) ;

		setTimeout( () => bus.emit( 'data' ) , 10 ) ;
		results = await Promise.onceEvent( bus , 'data' ) ;
		expect( results ).to.be( undefined ) ;

		setTimeout( () => bus.emit( 'data' , 1 , 2 , 3 ) , 10 ) ;
		results = await Promise.onceEvent( bus , 'data' ) ;
		expect( results ).to.be( 1 ) ;
	} ) ;

	it( ".onceEventAll()" , async () => {
		var results ;
		var bus = Object.create( require( 'events' ).prototype ) ;

		setTimeout( () => bus.emit( 'data' , 1 , 2 , 3 ) , 10 ) ;
		results = await Promise.onceEventAll( bus , 'data' ) ;
		expect( results ).to.equal( [ 1 , 2 , 3 ] ) ;
	} ) ;

	it( ".onceEventOrError()" , async () => {
		var results ;
		var bus = Object.create( require( 'events' ).prototype ) ;

		setTimeout( () => bus.emit( 'data' , 1 , 2 , 3 ) , 10 ) ;
		results = await Promise.onceEventOrError( bus , 'data' ) ;
		expect( results ).to.be( 1 ) ;

		setTimeout( () => bus.emit( 'error' , new Error( 'Doh!' ) ) , 10 ) ;
		await expect( () => Promise.onceEventOrError( bus , 'data' ) ).to.reject.with.an( Error , { message: 'Doh!' } ) ;
	} ) ;

	it( ".onceEventAllOrError()" , async () => {
		var results ;
		var bus = Object.create( require( 'events' ).prototype ) ;

		setTimeout( () => bus.emit( 'data' , 1 , 2 , 3 ) , 10 ) ;
		results = await Promise.onceEventAllOrError( bus , 'data' ) ;
		expect( results ).to.equal( [ 1 , 2 , 3 ] ) ;

		setTimeout( () => bus.emit( 'error' , new Error( 'Doh!' ) ) , 10 ) ;
		await expect( () => Promise.onceEventAllOrError( bus , 'data' ) ).to.reject.with.an( Error , { message: 'Doh!' } ) ;
	} ) ;

	it( ".onceEventOrError() with event exclusion" , async () => {
		var results ;
		var bus = Object.create( require( 'events' ).prototype ) ;

		setTimeout( () => bus.emit( 'data' , 1 , 2 , 3 ) , 10 ) ;
		results = await Promise.onceEventOrError( bus , 'data' , 'close' ) ;
		expect( results ).to.be( 1 ) ;

		setTimeout( () => bus.emit( 'error' , new Error( 'Doh!' ) ) , 10 ) ;
		await expect( () => Promise.onceEventOrError( bus , 'data' , 'close' ) ).to.reject.with.an( Error , { message: 'Doh!' } ) ;

		setTimeout( () => bus.emit( 'close' , 10 ) ) ;
		await expect( () => Promise.onceEventOrError( bus , 'data' , 'close' ) ).to.reject.with.an( Error , { message: 'Received an excluded event: close' , event: 'close' } ) ;

		setTimeout( () => bus.emit( 'data' , 1 , 2 , 3 ) , 10 ) ;
		results = await Promise.onceEventOrError( bus , 'data' , [ 'close' , 'end' ] ) ;
		expect( results ).to.be( 1 ) ;

		setTimeout( () => bus.emit( 'error' , new Error( 'Doh!' ) ) , 10 ) ;
		await expect( () => Promise.onceEventOrError( bus , 'data' , [ 'close' , 'end' ] ) ).to.reject.with.an( Error , { message: 'Doh!' } ) ;

		setTimeout( () => bus.emit( 'close' , 10 ) ) ;
		await expect( () => Promise.onceEventOrError( bus , 'data' , [ 'close' , 'end' ] ) ).to.reject.with.an( Error , { message: 'Received an excluded event: close' , event: 'close' } ) ;

		setTimeout( () => bus.emit( 'end' , 10 ) ) ;
		await expect( () => Promise.onceEventOrError( bus , 'data' , [ 'close' , 'end' ] ) ).to.reject.with.an( Error , { message: 'Received an excluded event: end' , event: 'end' } ) ;
	} ) ;

	it( ".onceEventAllOrError() with event exclusion" , async () => {
		var results ;
		var bus = Object.create( require( 'events' ).prototype ) ;

		setTimeout( () => bus.emit( 'data' , 1 , 2 , 3 ) , 10 ) ;
		results = await Promise.onceEventAllOrError( bus , 'data' , 'close' ) ;
		expect( results ).to.equal( [ 1 , 2 , 3 ] ) ;

		setTimeout( () => bus.emit( 'error' , new Error( 'Doh!' ) ) , 10 ) ;
		await expect( () => Promise.onceEventAllOrError( bus , 'data' , 'close' ) ).to.reject.with.an( Error , { message: 'Doh!' } ) ;

		setTimeout( () => bus.emit( 'close' , 10 ) ) ;
		await expect( () => Promise.onceEventAllOrError( bus , 'data' , 'close' ) ).to.reject.with.an( Error , { message: 'Received an excluded event: close' , event: 'close' } ) ;

		setTimeout( () => bus.emit( 'data' , 1 , 2 , 3 ) , 10 ) ;
		results = await Promise.onceEventAllOrError( bus , 'data' , [ 'close' , 'end' ] ) ;
		expect( results ).to.equal( [ 1 , 2 , 3 ] ) ;

		setTimeout( () => bus.emit( 'error' , new Error( 'Doh!' ) ) , 10 ) ;
		await expect( () => Promise.onceEventAllOrError( bus , 'data' , [ 'close' , 'end' ] ) ).to.reject.with.an( Error , { message: 'Doh!' } ) ;

		setTimeout( () => bus.emit( 'close' , 10 ) ) ;
		await expect( () => Promise.onceEventAllOrError( bus , 'data' , [ 'close' , 'end' ] ) ).to.reject.with.an( Error , { message: 'Received an excluded event: close' , event: 'close' } ) ;

		setTimeout( () => bus.emit( 'end' , 10 ) ) ;
		await expect( () => Promise.onceEventAllOrError( bus , 'data' , [ 'close' , 'end' ] ) ).to.reject.with.an( Error , { message: 'Received an excluded event: end' , event: 'end' } ) ;
	} ) ;
} ) ;



describe( "Thenable support" , () => {

	it( "Promise.isThenable()" , () => {
		expect( Promise.isThenable( new Promise() ) ).to.be.ok() ;
		expect( Promise.isThenable( new Promise( resolve => resolve() ) ) ).to.be.ok() ;
		expect( Promise.isThenable( { then: resolve => resolve() } ) ).to.be.ok() ;
		expect( Promise.isThenable( { then: 'bob' } ) ).not.to.be.ok() ;
		expect( Promise.isThenable( {} ) ).not.to.be.ok() ;
	} ) ;

	it( "Promise.fromThenable() from native promises" , done => {
		expect( Promise.fromThenable( new Promise( resolve => resolve() ) ) ).to.be.a( Promise ) ;

		Promise.fromThenable( new Promise( resolve => setTimeout( () => resolve( 'yay' ) , 10 ) ) )
			.then( value => {
				expect( value ).to.be( 'yay' ) ;
				Promise.fromThenable(
					new Promise( ( resolve , reject ) => setTimeout( () => reject( new Error( 'doh!' ) ) , 10 ) )
				)
					.then(
						() => { throw new Error( 'Should throw!' ) ; } ,
						error => {
							expect( error.message ).to.be( 'doh!' ) ;
							done() ;
						}
					)
					.catch( error => done( error || new Error() ) ) ;
			} )
			.catch( error => done( error || new Error() ) ) ;
	} ) ;


	// Dummy thenable class
	function Thenable( isSuccess , value ) {
		this.onResolve = null ;
		this.onReject = null ;

		setTimeout( () => {
			if ( isSuccess && typeof this.onResolve === 'function' ) { this.onResolve( value ) ; }
			else if ( ! isSuccess && typeof this.onReject === 'function' ) { this.onReject( value ) ; }
		} , 20 ) ;
	}

	// Only support one handler, but it's good enough for this test
	Thenable.prototype.then = function then( onResolve , onReject ) {
		this.onResolve = onResolve ;
		this.onReject = onReject ;
	} ;


	it( "Promise.fromThenable() from unknown thenable object" , done => {
		expect( Promise.fromThenable( new Thenable( true ) ) ).to.be.a( Promise ) ;

		Promise.fromThenable( new Thenable( true , 'yay' ) )
			.then( value => {
				expect( value ).to.be( 'yay' ) ;
				Promise.fromThenable( new Thenable( false , new Error( 'doh!' ) ) )
					.then(
						() => { throw new Error( 'Should throw!' ) ; } ,
						error => {
							expect( error.message ).to.be( 'doh!' ) ;
							done() ;
						}
					)
					.catch( error => done( error || new Error() ) ) ;
			} )
			.catch( error => done( error || new Error() ) ) ;
	} ) ;

	it( "Thenable support as .then() return value" , () => {
		return Promise.resolveTimeout( 10 , 'one' )
			.then( value => {
				expect( value ).to.be( 'one' ) ;
				return new Thenable( true , value + '-two' ) ;
			} )
			.then( value => {
				expect( value ).to.be( 'one-two' ) ;
			} ) ;
	} ) ;
} ) ;



describe( "Promise.try()" , () => {

	it( "Promise.try() should be a try-catched version of Promise.resolve( fn() )" , () => {
		return Promise.try( () => { throw new Error( 'throw!' ) ; } )
			.then(
				() => { throw new Error( 'Should throw!' ) ; } ,
				// Catch part:
				error => {
					expect( error.message ).to.be( 'throw!' ) ;
				}
			) ;
	} ) ;

	it( "Promise.try() should resolve to a regular value" , () => {
		return Promise.try( () => 'great!' ).then( value => {
			expect( value ).to.be( 'great!' ) ;
		} ) ;
	} ) ;

	it( "Promise.try() should return the promise returned by its function" , () => {
		var p1 = Promise.resolveTimeout( 10 , 'great!' ) ;
		var p2 = Promise.try( () => p1 ) ;

		expect( p1 ).to.be( p2 ) ;

		return p2.then( value => {
			expect( value ).to.be( 'great!' ) ;
		} ) ;
	} ) ;
} ) ;



describe( "Dormant promises" , () => {

	it( "Promise.dormant() should execute only once a then handler is attached" , done => {
		var order = [] ;

		var promise = Promise.dormant( ( resolve , reject ) => {
			order.push( 'exec' ) ;
			resolve( 'value' ) ;
		} ) ;

		order.push( 'sync after 1' ) ;

		Promise.resolveTimeout( 10 )
			.then( () => {
				expect( order ).to.equal( [ 'sync after 1' ] ) ;

				promise.then( result => {
					order.push( 'then' ) ;
					expect( result ).to.be( 'value' ) ;
					expect( order ).to.equal( [ 'sync after 1' , 'exec' , 'sync after 2' , 'then' ] ) ;
					done() ;
				} )
					.catch( error => done( error || new Error() ) ) ;

				order.push( 'sync after 2' ) ;
				expect( order ).to.equal( [ 'sync after 1' , 'exec' , 'sync after 2' ] ) ;
			} )
			.catch( error => done( error || new Error() ) ) ;
	} ) ;

	it( "even rejection handlers should wake it up" , () => {
		var order = [] ;

		var promise = Promise.dormant( ( resolve , reject ) => {
			order.push( 'exec' ) ;
			resolve( 'value' ) ;
		} ) ;

		order.push( 'sync after 1' ) ;

		return Promise.resolveTimeout( 10 )
			.then( () => {
				expect( order ).to.equal( [ 'sync after 1' ] ) ;
				var p2 = promise.catch( () => null ) ;
				order.push( 'sync after 2' ) ;
				expect( order ).to.equal( [ 'sync after 1' , 'exec' , 'sync after 2' ] ) ;
				p2.then( () => null ) ;
				order.push( 'sync after 3' ) ;
				expect( order ).to.equal( [ 'sync after 1' , 'exec' , 'sync after 2' , 'sync after 3' ] ) ;
			} ) ;
	} ) ;
} ) ;



describe( "Then/catch alternatives" , () => {

	it( ".catch() without arguments" , () => {
		return Promise.rejectTimeout( 10 , new Error( 'Error!' ) ).catch() ;
	} ) ;

	it( ".tap()" ) ;
	it( ".tapCatch()" ) ;
	it( ".fatal()" ) ;

	it( ".done() should throw any exception" , () => {
		var thenCount = 0 ;

		return Promise.resolveTimeout( 10 , 'one' )
			.then( value => {
				expect( value ).to.be( 'one' ) ;
				thenCount ++ ;
				return 'two' ;
			} )
			.then( value => {
				expect( value ).to.be( 'two' ) ;
				thenCount ++ ;
				return Promise.resolveTimeout( 10 , 'three' ) ;
			} )
			.then( value => {
				expect( value ).to.be( 'three' ) ;
				thenCount ++ ;
			} )
			.then( () => {
				expect( thenCount ).to.be( 3 ) ;
			} ) ;
	} ) ;
} ) ;



describe( "Queue" , () => {

	it( "Job's data" , async () => {
		var fn , queue , log = [] ;
		
		fn = async ( data ) => {
			log.push( "before " + data.id + ' : ' + data.k ) ;
			await Promise.resolveTimeout( 10 ) ;
			log.push( "after " + data.id + ' : ' + data.k ) ;
		} ;

		queue = new Promise.Queue( fn , 1 ) ;
		queue.run() ;

		queue.add( "bob" , { id: "bob", k: 7 } ) ;
		queue.add( "bill" , { id: "bill", k: 4 } ) ;
		queue.add( "joe" , { id: "joe", k: 1 } ) ;

		await queue.idle ;

		expect( log ).to.equal( [ "before bob : 7" , "after bob : 7" , "before bill : 4" , "after bill : 4" , "before joe : 1" , "after joe : 1" ] ) ;
	} ) ;

	it( "When data is provided for a job, its id is used as its data" , async () => {
		var fn , queue , log = [] ;
		
		fn = async ( data ) => {
			log.push( "before " + data ) ;
			await Promise.resolveTimeout( 10 ) ;
			log.push( "after " + data ) ;
		} ;

		queue = new Promise.Queue( fn , 1 ) ;
		queue.run() ;

		queue.add( "bob" ) ;
		queue.add( "bill" , "jack" ) ;
		queue.add( "joe" , null ) ;
		queue.add( "jim" , false ) ;

		await queue.idle ;

		expect( log ).to.equal( [ "before bob" , "after bob" , "before jack" , "after jack" , "before null" , "after null" , "before false" , "after false" ] ) ;
	} ) ;

	it( "Add a batch of jobs" , async () => {
		var fn , queue , log = [] ;
		
		fn = async ( data ) => {
			log.push( "before " + data ) ;
			await Promise.resolveTimeout( 10 ) ;
			log.push( "after " + data ) ;
		} ;

		queue = new Promise.Queue( fn , 1 ) ;
		queue.run() ;

		queue.addBatch( [ "bob" , "jack" , "joe" , "jim" ] ) ;
		await queue.idle ;

		expect( log ).to.equal( [ "before bob" , "after bob" , "before jack" , "after jack" , "before joe" , "after joe" , "before jim" , "after jim" ] ) ;
	} ) ;

	it( "Without dependencies" , async () => {
		var queue , log = [] ;
		var fn = async ( data ) => {
			log.push( "before " + data.id ) ;
			await Promise.resolveTimeout( 50 ) ;
			log.push( "after " + data.id ) ;
		} ;

		queue = new Promise.Queue( fn , 2 ) ;
		queue.run() ;

		queue.add( "bob" , { id: "bob", k: 2 } ) ;
		queue.add( "bill" , { id: "bill", k: 2 } ) ;
		queue.add( "joe" , { id: "joe", k: 2 } ) ;
		queue.add( "jack" , { id: "jack", k: 2 } ) ;

		await queue.idle ;

		expect( log ).to.equal( [ "before bob" , "before bill" , "after bob" , "before joe" , "after bill" , "before jack" , "after joe" , "after jack" ] ) ;

		log = [] ;
		queue = new Promise.Queue( fn , 1 ) ;
		queue.run() ;

		queue.add( "bob" , { id: "bob", k: 2 } ) ;
		queue.add( "bill" , { id: "bill", k: 2 } ) ;
		queue.add( "joe" , { id: "joe", k: 2 } ) ;
		queue.add( "jack" , { id: "jack", k: 2 } ) ;

		await queue.idle ;

		expect( log ).to.equal( [ "before bob" , "after bob" , "before bill" , "after bill" , "before joe" , "after joe" , "before jack" , "after jack" ] ) ;
	} ) ;

	it( "With dependencies" , async () => {
		var queue , log = [] ;
		var fn = async ( data ) => {
			log.push( "before " + data.id ) ;
			await Promise.resolveTimeout( 50 ) ;
			log.push( "after " + data.id ) ;
		} ;

		queue = new Promise.Queue( fn , 2 ) ;
		queue.run() ;

		queue.add( "bob" , { id: "bob", k: 2 } , [ "joe" ] ) ;
		queue.add( "bill" , { id: "bill", k: 2 } , [ "jack" ] ) ;
		queue.add( "joe" , { id: "joe", k: 2 } , [ "bill" ] ) ;
		queue.add( "jack" , { id: "jack", k: 2 } ) ;

		await queue.idle ;
		//console.log( queue.getJobTimes() ) ; console.log( queue.getStats() ) ;

		expect( log ).to.equal( [ "before jack" , "after jack" , "before bill" , "after bill" , "before joe" , "after joe" , "before bob" , "after bob" ] ) ;

		log = [] ;
		queue = new Promise.Queue( fn , 2 ) ;
		queue.run() ;

		queue.add( "bob" , { id: "bob", k: 2 } , [ "joe" , "jack" ] ) ;
		queue.add( "bill" , { id: "bill", k: 2 } ) ;
		queue.add( "joe" , { id: "joe", k: 2 } ) ;
		queue.add( "jack" , { id: "jack", k: 2 } ) ;

		await queue.idle ;
		//console.log( queue.getJobTimes() ) ; console.log( queue.getStats() ) ;

		expect( log ).to.equal( [ "before bill" , "before joe" , "after bill" , "before jack" , "after joe" , "after jack" , "before bob" , "after bob" ] ) ;
	} ) ;
} ) ;



describe( "Misc" , () => {
	it( ".asyncExit() TODO" ) ;

	it( ".resolveSafeTimeout()" , async () => {
		// Hard to test it correctly
		expect( await Promise.resolveSafeTimeout( 50 , 'value' ) ).to.be( 'value' ) ;
	} ) ;

	it( "Promise.dummy, Promise.resolved" , async () => {
		expect( Promise.resolved ).to.be( Promise.dummy ) ;
		expect( await Promise.resolved ).to.be( undefined ) ;
	} ) ;
} ) ;



describe( "Async-try-catch module compatibility" , () => {
	it( "async-try-catch module compatibility tests" ) ;
} ) ;



describe( "Historical bugs" , () => {

	it( ".then() sync chain" , () => {
		var thenCount = 0 ;

		return Promise.resolve( 'one' )
			.then( value => {
				expect( value ).to.be( 'one' ) ;
				thenCount ++ ;
				return 'two' ;
			} )
			.then( value => {
				expect( value ).to.be( 'two' ) ;
				thenCount ++ ;
				return 'three' ;
			} )
			.then( value => {
				expect( value ).to.be( 'three' ) ;
				thenCount ++ ;
			} )
			.then( () => {
				expect( thenCount ).to.be( 3 ) ;
			} ) ;
	} ) ;

	it( ".then() sync chain throwing" , () => {
		var thenCount = 0 ;

		return Promise.resolve( 'one' )
			.then( value => {
				expect( value ).to.be( 'one' ) ;
				thenCount ++ ;
				return 'two' ;
			} )
			.then( value => {
				expect( value ).to.be( 'two' ) ;
				thenCount ++ ;
				throw new Error( 'throw!' ) ;
			} )
			.then( value => {
				thenCount ++ ;
			} )
			.then(
				() => { throw new Error( 'Should throw!' ) ; } ,
				error => {
					expect( thenCount ).to.be( 2 ) ;
					expect( error.message ).to.be( 'throw!' ) ;
				}
			) ;
	} ) ;

	it( "await and .then method mutation bug" , async () => {
		var pFn = () => {
			var lastP = Promise.resolve() ;
			var p = new Promise() ;
			lastP.then( () => {
				p.resolve( 'val' ) ;
			} ) ;
			return p ;
		} ;

		var val = await pFn() ;
		expect( val ).to.be( 'val' ) ;
	} ) ;

	it( ".concurrent() with only 1 item and concurrency set to 1" , () => {
		var index = 0 ;
		var promiseArray = [
			Promise.resolveTimeout( 20 , 'one' )
		] ;

		return Promise.concurrent( 1 , promiseArray , str => {
			return Promise.resolveTimeout( 10 , str + str ) ;
		} )
			.then(
				( values ) => {
					expect( values ).to.equal( [ 'oneone' ] ) ;
				}
			) ;
	} ) ;
} ) ;



// Should come last, because parasiting the native promise is irreversible
describe( "Native promise parasiting" , () => {

	Promise.parasite() ;

	it( "Promise.parasite() should parasite global native promises, bringing them few 'seventh' features" , done => {
		var promiseOk = new Promise.Native( ( resolve , reject ) => setTimeout( () => resolve( 'yay!' ) , 10 ) ) ;
		var promiseKo = new Promise.Native( ( resolve , reject ) => setTimeout( () => reject( new Error( 'doh!' ) ) , 10 ) ) ;

		promiseOk.callback( ( error , value ) => {
			expect( error ).not.to.be.ok() ;
			expect( value ).to.be( 'yay!' ) ;

			promiseKo.callback( ( error , value ) => {
				expect( error ).to.be.ok() ;
				expect( error.message ).to.be( 'doh!' ) ;
				done() ;
			} )
				.catch( error => done( error || new Error() ) ) ;
		} )
			.catch( error => done( error || new Error() ) ) ;
	} ) ;

	it( "Async/await function should return a promise correctly parasited" , done => {
		var promiseOk = new Promise.Native( ( resolve , reject ) => setTimeout( () => resolve( 'yay!' ) , 10 ) ) ;

		var asyncFn = async () => {
			return await promiseOk ;
		} ;

		asyncFn().callback( ( error , value ) => {
			expect( error ).not.to.be.ok() ;
			expect( value ).to.be( 'yay!' ) ;
			done() ;
		} )
			.catch( error => done( error || new Error() ) ) ;
	} ) ;
} ) ;

