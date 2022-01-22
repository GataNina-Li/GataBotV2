/**
 * This timeout promise is meant to automatically reject after the specified timeout, with the ability to cancel it prematurely
 * @class
 */
class TimeoutPromise<T> {
	/**
	 * The timeout in milliseconds
	 * @type {number}
	 */
	public timeout: number;
	/**
	 * The reason for the timeout rejection
	 * @type {Error}
	 */
	public error: Error;
	/**
	 * The promise that will be executed on
	 * @type {Promise<T>}
	 */
	public promise: Promise<T>;
	private timer: NodeJS.Timeout;
	private rejectCallback: (reason: Error) => void;

	/**
	 * Creates a new timeout promise
	 * @param {number} timeout The timeout in milliseconds
	 * @param {string} reason The reason for the rejection when it times out
	 */
	constructor(timeout: number, error: Error) {
		this.timeout = timeout;
		this.error = error;
		this.rejectCallback = () => { return; };

		this.promise = new Promise((resolve, reject) => {
			this.rejectCallback = reject;
		});

		this.timer = setTimeout(() => {
			this.rejectCallback(this.error);
		}, this.timeout);
	}

	/**
	 * Cancels the promise from rejecting after the specified time
	 * @returns {void}
	 */
	cancel(): void {
		clearTimeout(this.timer);
	}
}

export default TimeoutPromise;