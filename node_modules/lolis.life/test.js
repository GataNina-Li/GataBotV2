// Welcome to the file test.js of this package! In this file, we'll test if the package works correctly and how to use it.




// creating the Loli constant, that is the required module in the index.js file of this folder. For you will be 
	// const Loli = require('lolis.life');

const Loli = require('./index.js');

// Instantiating a new Loli class...

const loli = new Loli();




// Trying the Promise version, with #then resolving...

loli.getSFWLoli().then((l) => {

	// logging in console the output...
	console.log(l);
});




// Trying the Promise version, with asyncio resolving...

async function testAsync() {
	var l = await loli.getSFWLoli();

	// logging in console the output...
	console.log(l);
};

testAsync();




// Trying the callback version...

/* 
* In this function, we're passing a callback function as parameter.
* This callback function will get executed when the code is finished and gets two parameters, the first that will 
* be an eventual error(else, if there isn't an error, it will be null), and the second that will be
* the random loli image url.
 */
loli.getSFWLoli((error, loliJSONoutput) => { 

	// logging in console the output...
	// if there's any error
	if (error) {
		// show error
		console.error(error);
	// else, if correct JSON data
	} else {
		// show JSON data
		console.log(loliJSONoutput); 
	};	
});

// Everything works correctly! ;)