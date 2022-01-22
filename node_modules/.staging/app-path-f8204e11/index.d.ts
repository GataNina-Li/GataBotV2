declare const appPath: {
	/**
	Get the path to an app on macOS.

	@param appName - An app name or bundle identifier.
	@returns The path to the app specified in `appName`. Rejects when run on any other operating system than macOS.

	@example
	```
	import appPath from 'app-path';

	(async () => {
		console.log(await appPath('Safari'));
		//=> '/Applications/Safari.app'

		console.log(await appPath('com.apple.Safari'));
		//=> '/Applications/Safari.app'
	})();
	```
	*/
	(appName: string): Promise<string>;

	/**
	Synchronously get the path to an app on macOS.

	@param appName - An app name or bundle identifier.
	@returns The path to the app specified in `appName`. Throws when run on any other operating system than macOS.

	@example
	```
	import appPath from 'app-path';

	console.log(appPath.sync('Safari'));
	//=> '/Applications/Safari.app'

	console.log(appPath.sync('com.apple.Safari'));
	//=> '/Applications/Safari.app'
	```
	*/
	sync(appName: string): string;

	// TODO: remove this in the next major version
	default: typeof appPath;
};

export = appPath;
