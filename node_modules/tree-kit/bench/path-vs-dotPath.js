
"use strict" ;

/* global benchmark, competitor */



var path = require( '../lib/path.js' ) ;
var dotPath = require( '../lib/dotPath.js' ) ;



benchmark( 'get a value through a path' , () => {
	var data = {
		propertyA: "value1" ,
		propertyB: "value2" ,
		object: {
			propertyC: "value3" ,
			propertyD: "value4" ,
			long: { nested: { path: { to: { a: { value: {} } } } } }
		} ,
		array: [ 'element1' , 'element2' , 'element3' , [ 'element4' , 'element5' , 'element6' , [ 'element7' , 'element8' , 'element9' ] ] ]
	} ;
	
	competitor( 'path.get()' , () => {
		var output ;
		
		output = path.get( data , 'propertyA' ) ;
		output = path.get( data , 'object' ) ;
		output = path.get( data , 'object.propertyC' ) ;
		output = path.get( data , 'object.long.nested.path.to.a.value' ) ;
		output = path.get( data , 'array' ) ;
		output = path.get( data , 'array.0' ) ;
		output = path.get( data , 'array.1' ) ;
		output = path.get( data , 'array.3' ) ;
		output = path.get( data , 'array.3.1' ) ;
		output = path.get( data , 'array.3.3.1' ) ;
	} ) ;
	
	competitor( 'path.get() with path-array' , () => {
		var output ;
		
		output = path.get( data , ['propertyA'] ) ;
		output = path.get( data , ['object'] ) ;
		output = path.get( data , ['object','propertyC'] ) ;
		output = path.get( data , ['object','long','nested','path','to','a','value'] ) ;
		output = path.get( data , ['array'] ) ;
		output = path.get( data , ['array',0] ) ;
		output = path.get( data , ['array',1] ) ;
		output = path.get( data , ['array',3] ) ;
		output = path.get( data , ['array',3,1] ) ;
		output = path.get( data , ['array',3,3,1] ) ;
	} ) ;
	
	competitor( 'dotPath.get()' , () => {
		var output ;
		
		output = dotPath.get( data , 'propertyA' ) ;
		output = dotPath.get( data , 'object' ) ;
		output = dotPath.get( data , 'object.propertyC' ) ;
		output = dotPath.get( data , 'object.long.nested.dotPath.to.a.value' ) ;
		output = dotPath.get( data , 'array' ) ;
		output = dotPath.get( data , 'array.0' ) ;
		output = dotPath.get( data , 'array.1' ) ;
		output = dotPath.get( data , 'array.3' ) ;
		output = dotPath.get( data , 'array.3.1' ) ;
		output = dotPath.get( data , 'array.3.3.1' ) ;
	} ) ;

	competitor( 'dotPath.get() with path-array' , () => {
		var output ;
		
		output = dotPath.get( data , ['propertyA'] ) ;
		output = dotPath.get( data , ['object'] ) ;
		output = dotPath.get( data , ['object','propertyC'] ) ;
		output = dotPath.get( data , ['object','long','nested','path','to','a','value'] ) ;
		output = dotPath.get( data , ['array'] ) ;
		output = dotPath.get( data , ['array',0] ) ;
		output = dotPath.get( data , ['array',1] ) ;
		output = dotPath.get( data , ['array',3] ) ;
		output = dotPath.get( data , ['array',3,1] ) ;
		output = dotPath.get( data , ['array',3,3,1] ) ;
	} ) ;
} ) ;



benchmark( 'get a value through a long path' , () => {
	var data = {
		propertyA: "value1" ,
		propertyB: "value2" ,
		object: {
			propertyC: "value3" ,
			propertyD: "value4" ,
			long: { nested: { path: { to: { a: { value: {} } } } } }
		} ,
		array: [ 'element1' , 'element2' , 'element3' , [ 'element4' , 'element5' , 'element6' , [ 'element7' , 'element8' , 'element9' , [[['element10']]] ] ] ]
	} ;
	
	competitor( 'path.get()' , () => {
		var output ;
		output = path.get( data , 'object.long.nested.path.to.a.value' ) ;
		output = path.get( data , 'array.3.3.3.0.0.0' ) ;
	} ) ;
	
	competitor( 'path.get() with path-array' , () => {
		var output ;
		output = path.get( data , ['object','long','nested','path','to','a','value'] ) ;
		output = path.get( data , ['array',3,3,3,0,0,0] ) ;
	} ) ;
	
	competitor( 'dotPath.get()' , () => {
		var output ;
		output = dotPath.get( data , 'object.long.nested.dotPath.to.a.value' ) ;
		output = dotPath.get( data , 'array.3.3.3.0.0.0' ) ;
	} ) ;

	competitor( 'dotPath.get() with path-array' , () => {
		var output ;
		output = dotPath.get( data , ['object','long','nested','dotPath','to','a','value'] ) ;
		output = dotPath.get( data , ['array',3,3,3,0,0,0] ) ;
	} ) ;
} ) ;

