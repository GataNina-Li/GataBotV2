[![NPM](https://nodei.co/npm/lolis.life.png)](https://nodei.co/npm/lolis.life/)
[![npm version](https://badge.fury.io/js/lolis.life.svg)](https://badge.fury.io/js/lolis.life) [![Build Status](https://travis-ci.org/DanielVip3/lolis-dot-life.svg?branch=master)](https://travis-ci.org/DanielVip3/lolis-dot-life) [![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity) [![Open Source Love svg1](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/DanielVip3/lolis-dot-life/blob/master/LICENSE) [![GitHub contributors](https://img.shields.io/github/contributors/DanielVip3/lolis-dot-life.svg)](https://GitHub.com/DanielVip3/lolis-dot-life/graphs/contributors/) [![GitHub issues](https://img.shields.io/github/issues/DanielVip3/lolis-dot-life.svg)](https://GitHub.com/DanielVip3/lolis-dot-life/issues/) [![GitHub pull-requests](https://img.shields.io/github/issues-pr/DanielVip3/lolis-dot-life.svg)](https://GitHub.com/DanielVip3/lolis-dot-life/pull/) [![HitCount](http://hits.dwyl.com/DanielVip3/lolis-dot-neko.svg)](http://hits.dwyl.com/DanielVip3/lolis-dot-neko)
[![GitHub stars](https://img.shields.io/github/stars/DanielVip3/lolis-dot-life.svg?style=social)](https://github.com/DanielVip3/lolis-dot-life/stargazers) [![GitHub watchers](https://img.shields.io/github/watchers/DanielVip3/lolis-dot-life.svg?style=social)](https://github.com/DanielVip3/lolis-dot-life/watchers)
[![saythanks](https://img.shields.io/badge/say-thanks-ff69b4.svg)](https://github.com/Nekos-life)

# Lolis.life

This is the official API wrapper for Lolis.life, the best API for random loli images and other general things.

# Introduction
This API wrapper and the official API are inspired by the popular [Nekos.life](https://github.com/Nekos-life), and both projects are under a MIT License.
All credits to them for the ideas ;)!

**P.S. This API is made by loli-lovers for loli-lovers, use it as you want and, most important, love lolis! :O**

# Installation
```
npm i lolis.life
```

This wrapper is granted without any external dependencies!

# A bit of Documentation

Actually, lot of endpoints are work in progress.


**SFW & others endpoints**
|Method|Description|Parameters|Returns|
|-------|--------|--------|--------|
|getSFWLoli|Fetches the API and gets a random loli image URL.|-|A JSON object that contains a single key "url", and a single value, the relative URL of the image.|
|getAllSFWLolis|Fetches the API and gets all the loli images' URLs.|-|A JSON object that contains a single key "lolis", that is an array with every loli images' URLs.|
|getSFWShota|Fetches the API and gets a random shota image URL.|-|A JSON object that contains a single key "url", and a single value, the relative URL of the image.|
|getAllSFWShotas|Fetches the API and gets all the shota images' URLs.|-|A JSON object that contains a single key "shotas", that is an array with every shotas' URLs.|
|getRhymes|Gets every word that rhymes with the passed word in parameters.|A string with any english word.|A JSON object that contains a single key "words" and a single value, an array that contains all the words that rhymes with the word in parameters.|
|feelSentence|Says how much a sentence inspires positive or negative feelings, by reading the words in it.|A string with any english sentence.|A JSON object that contains the positive or negative score of the sentence, and the positive and negative words that are in it.|

**NSFW endpoints**
|Method|Description|Parameters|Returns|
|-------|--------|--------|--------|
|getNSFWLoli|Fetches the API and gets a random nsfw loli image URL.|-|A JSON object that contains a single key "url", and a single value, the relative URL of the image.|
|getAllNSFWLolis|Fetches the API and gets all the nsfw loli images' URLs.|-|A JSON object that contains a single key "nsfwlolis", that is an array with every nsfw loli images' URLs.|

In the future, there will also be NSFW shota endpoints, "complete a sentence with random word"(W.I.P. name lol) endpoint and the current database will expand with a lot of more lolis and shota images.

The lolis endpoint, actually, contains (for now) 352 loli images; the shotas endpoint, instead, contains 92 shota images.
The nsfw lolis endpoint anctually contains 95 nsfw loli images.

The structure of the returned data, for the main lolis and shotas endpoints, is like this:
```
{"url": "https://i.imgur.com/jO2Ecs2.jpg"}
```

For 'all'-type lolis and shotas endpoints, the structure is like this:
```
{"lolis": ["https://i.imgur.com/jO2Ecs2.jpg", ...]}
```

For the rhymes endpoint, the structure is like this:
```
{"words": ["bid", "kid", ...]}
```

And for the sentiments endpoint, the structure is like this:
```
{"score": -1, "positive-words": ["love"], "negative-words": ["hate", "stupid"]}
```


Also, you can retrieve the data in three ways, as it will be explained in the Examples, under this paragraph:
you can use async/await(asyncio), Promises and callbacks.

### Examples

###### Async/await Example
```javascript
// creating the Loli constant, that is the module itself.
const Loli = require('lolis.life');

// Instantiating a new Loli class...
const loli = new Loli();

// Trying the Promise version with async/await(asyncio) resolving...
async function testAsync() {
	// logging in console the output...
	console.log(await loli.getSFWLoli());
};

testAsync();
```

###### Promises Example
```javascript
// creating the Loli constant, that is the module itself.
const Loli = require('lolis.life');

// Instantiating a new Loli class...
const loli = new Loli();

// Trying the Promise version with common #then resolving...
loli.getSFWLoli().then((loliJSONoutput) => {
	// logging in console the output...
	console.log(loliJSONoutput); 
});
```

###### Callback Example
```javascript
// creating the Loli constant, that is the module itself.
const Loli = require('lolis.life');

// Instantiating a new Loli class...
const loli = new Loli();

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
```
*If you follow carefully the Callback Example, you can also learn the callback schema, as it's just formed by two parameters, error and JSON data. **If the one exists, the other is null, and viceversa.***

###### #feelSentence Example
```javascript
const Loli = require('lolis.life');
const loli = new Loli();
loli.feelSentence("I love lolis and I hate traps.").then(r => console.log()); // {"score": -1, "positive-words": ['love'], "negative-words": ['traps', 'hate']}
```

# Showcase
A website that showcases this API can be found at https://www.danielvip3.altervista.org/.

# Credits
This API, and consequently the API Wrapper, owes everything to his father API [Nekos.life](https://github.com/Nekos-life) and it's heavily inspired by it.
I can't say how many times I would thank their developers for the inspiration! Many, many thanks :)!
Anyway, if someone is interested, the developer of this API and of the wrapper is Daniele De Martino, a.k.a. DanielVip3, an Italian web developer.

# How to help and report bugs and issues
Yes, you can help by reporting bugs and issues in the issue tracker of this repo.
Feel also free to fork it as you want(MIT license approves ;)!) and to make pull requests.
Also, if you have problems, you can contact me at this email: danieledemartino.72004@gmail.com.

# Complaints
If you are an artist and you don't want one of your arts/images on this website, you can contact me at danieledemartino.72004@gmail.com and send me the link of the image that you want to remove. I promise that I'll remove it in 48 hours. Many thanks for your support!