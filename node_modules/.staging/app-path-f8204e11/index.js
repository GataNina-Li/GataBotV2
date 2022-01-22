'use strict';
const execa = require('execa');

const tweakError = error => {
	if (error.code === 2) {
		error.message = 'Couldn\'t find the app';
	}

	return error;
};

const appPath = async appName => {
	if (process.platform !== 'darwin') {
		throw new Error('macOS only');
	}

	if (typeof appName !== 'string') {
		throw new TypeError('Please supply an app name or bundle identifier');
	}

	try {
		return await execa.stdout('./main', [appName], {cwd: __dirname});
	} catch (error) {
		throw tweakError(error);
	}
};

module.exports = appPath;
// TODO: remove this in the next major version
module.exports.default = appPath;

module.exports.sync = app => {
	if (process.platform !== 'darwin') {
		throw new Error('macOS only');
	}

	if (typeof app !== 'string') {
		throw new TypeError('Please supply an app name or bundle identifier');
	}

	try {
		return execa.sync('./main', [app], {cwd: __dirname}).stdout;
	} catch (error) {
		throw tweakError(error);
	}
};
