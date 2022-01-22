declare const iterm2Version: {
	/**
	Get the [iTerm2](https://www.iterm2.com) version.

	@returns iTerm2 version. If you're running this on a different terminal or operating system, it will return `undefined`.

	@example
	```
	import iterm2Version = require('iterm2-version');

	iterm2Version();
	//=> '3.0.15'
	```
	*/
	(): string | undefined;

	// TODO: Remove this for the next major release, refactor the whole definition to:
	// declare function iterm2Version(): string | undefined;
	// export = iterm2Version;
	default: typeof iterm2Version;
};

export = iterm2Version;
