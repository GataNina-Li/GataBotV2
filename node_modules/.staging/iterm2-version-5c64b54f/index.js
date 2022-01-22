'use strict';
const path = require('path');
const fs = require('fs');
const appPath = require('app-path');
const plist = require('plist');

let version;

const iterm2Version = () => {
	if (!version) {
		if (process.env.TERM_PROGRAM === 'iTerm.app' && process.env.TERM_PROGRAM_VERSION) {
			version = process.env.TERM_PROGRAM_VERSION;
		} else {
			const filePath = path.join(appPath.sync('iTerm'), 'Contents/Info.plist');
			version = plist.parse(fs.readFileSync(filePath, 'utf8')).CFBundleVersion;
		}
	}

	return version;
};

module.exports = iterm2Version;
// TODO: Remove this for the next major release
module.exports.default = iterm2Version;
