const https = require('https');

module.exports = class Loli {

	getSFWLoli(callback) {
		if (typeof callback == "function") {
			https.get({
	 			hostname: 'lolis-life-api.herokuapp.com',
	  			path: '/getLoli',
	  			agent: false
			}, (resp) => {
			  var data = "";

			  resp.on('data', (chunk) => {
			    data += chunk;
			  });

			  resp.on('end', () => {
			    callback(null, JSON.parse(data));
			  });

			}).on("error", (err) => {
				callback(err, null)
			});
		} else {
		    return new Promise( function (resolve, reject) {
			    https.get({
		 			hostname: 'lolis-life-api.herokuapp.com',
		  			path: '/getLoli',
		  			agent: false
				}, (resp) => {
				  var data = "";

				  resp.on('data', (chunk) => {
				    data += chunk;
				  });

				  resp.on('end', () => {
				    resolve(JSON.parse(data));
				  });

				}).on("error", (err) => {
					reject(new Error(err));
				});
			});
		};
	};

	getNSFWLoli(callback) {
		if (typeof callback == "function") {
			https.get({
	 			hostname: 'lolis-life-api.herokuapp.com',
	  			path: '/getNSFWLoli',
	  			agent: false
			}, (resp) => {
			  var data = "";

			  resp.on('data', (chunk) => {
			    data += chunk;
			  });

			  resp.on('end', () => {
			    callback(null, JSON.parse(data));
			  });

			}).on("error", (err) => {
				callback(err, null)
			});
		} else {
		    return new Promise( function (resolve, reject) {
			    https.get({
		 			hostname: 'lolis-life-api.herokuapp.com',
		  			path: '/getNSFWLoli',
		  			agent: false
				}, (resp) => {
				  var data = "";

				  resp.on('data', (chunk) => {
				    data += chunk;
				  });

				  resp.on('end', () => {
				    resolve(JSON.parse(data));
				  });

				}).on("error", (err) => {
					reject(new Error(err));
				});
			});
		};
	};

	getSFWShota(callback) {
		if (typeof callback == "function") {
			https.get({
	 			hostname: 'lolis-life-api.herokuapp.com',
	  			path: '/getShota',
	  			agent: false
			}, (resp) => {
			  var data = "";

			  resp.on('data', (chunk) => {
			    data += chunk;
			  });

			  resp.on('end', () => {
			    callback(null, JSON.parse(data));
			  });

			}).on("error", (err) => {
				callback(err, null)
			});
		} else {
		    return new Promise( function (resolve, reject) {
			    https.get({
		 			hostname: 'lolis-life-api.herokuapp.com',
		  			path: '/getShota',
		  			agent: false
				}, (resp) => {
				  var data = "";

				  resp.on('data', (chunk) => {
				    data += chunk;
				  });

				  resp.on('end', () => {
				    resolve(JSON.parse(data));
				  });

				}).on("error", (err) => {
					reject(new Error(err));
				});
			});
		};
	};

	getAllSFWLolis(callback) {
		if (typeof callback == "function") {
			https.get({
	 			hostname: 'lolis-life-api.herokuapp.com',
	  			path: '/getAllLolis',
	  			agent: false
			}, (resp) => {
			  var data = "";

			  resp.on('data', (chunk) => {
			    data += chunk;
			  });

			  resp.on('end', () => {
			    callback(null, JSON.parse(data));
			  });

			}).on("error", (err) => {
				callback(err, null)
			});
		} else {
		    return new Promise( function (resolve, reject) {
			    https.get({
		 			hostname: 'lolis-life-api.herokuapp.com',
		  			path: '/getAllLolis',
		  			agent: false
				}, (resp) => {
				  var data = "";

				  resp.on('data', (chunk) => {
				    data += chunk;
				  });

				  resp.on('end', () => {
				    resolve(JSON.parse(data));
				  });

				}).on("error", (err) => {
					reject(new Error(err));
				});
			});
		};
	};

	getAllNSFWLolis(callback) {
		if (typeof callback == "function") {
			https.get({
	 			hostname: 'lolis-life-api.herokuapp.com',
	  			path: '/getAllNSFWLolis',
	  			agent: false
			}, (resp) => {
			  var data = "";

			  resp.on('data', (chunk) => {
			    data += chunk;
			  });

			  resp.on('end', () => {
			    callback(null, JSON.parse(data));
			  });

			}).on("error", (err) => {
				callback(err, null)
			});
		} else {
		    return new Promise( function (resolve, reject) {
			    https.get({
		 			hostname: 'lolis-life-api.herokuapp.com',
		  			path: '/getAllNSFWLolis',
		  			agent: false
				}, (resp) => {
				  var data = "";

				  resp.on('data', (chunk) => {
				    data += chunk;
				  });

				  resp.on('end', () => {
				    resolve(JSON.parse(data));
				  });

				}).on("error", (err) => {
					reject(new Error(err));
				});
			});
		};
	};

	getAllSFWShotas(callback) {
		if (typeof callback == "function") {
			https.get({
	 			hostname: 'lolis-life-api.herokuapp.com',
	  			path: '/getAllShotas',
	  			agent: false
			}, (resp) => {
			  var data = "";

			  resp.on('data', (chunk) => {
			    data += chunk;
			  });

			  resp.on('end', () => {
			    callback(null, JSON.parse(data));
			  });

			}).on("error", (err) => {
				callback(err, null)
			});
		} else {
		    return new Promise( function (resolve, reject) {
			    https.get({
		 			hostname: 'lolis-life-api.herokuapp.com',
		  			path: '/getAllShotas',
		  			agent: false
				}, (resp) => {
				  var data = "";

				  resp.on('data', (chunk) => {
				    data += chunk;
				  });

				  resp.on('end', () => {
				    resolve(JSON.parse(data));
				  });

				}).on("error", (err) => {
					reject(new Error(err));
				});
			});
		};
	};

	feelSentence(sentence, callback) {
		if (typeof callback == "function") {
			https.get('https://lolis-life-api.herokuapp.com/feelSentence?sentence='+encodeURIComponent(sentence), (resp) => {
			  var data = "";

			  resp.on('data', (chunk) => {
			    data += chunk;
			  });

			  resp.on('end', () => {
			    callback(null, JSON.parse(data));
			  });

			}).on("error", (err) => {
				callback(err, null)
			});
		} else {
		    return new Promise( function (resolve, reject) {
		    	https.get('https://lolis-life-api.herokuapp.com/feelSentence?sentence='+encodeURIComponent(sentence), (resp) => {
				  var data = "";

				  resp.on('data', (chunk) => {
				    data += chunk;
				  });

				  resp.on('end', () => {
				    resolve(JSON.parse(data));
				  });

				}).on("error", (err) => {
					reject(new Error(err));
				});
			});
		};
	};

};