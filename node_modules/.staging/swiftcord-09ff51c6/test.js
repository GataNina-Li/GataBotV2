const getColors = require('get-image-colors')
var onecolor = require('onecolor')
const fetch = require('node-fetch');


(async() => {

	var rgb = await getColors('https://i.scdn.co/image/ab67616d0000b273367ed642fdfc6102a39ec910')
	console.log(rgb[0].alpha(0.5).css())


})()