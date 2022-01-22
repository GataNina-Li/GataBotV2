/**
 * This timeout promise is meant to automatically reject after the specified timeout, with the ability to cancel it prematurely
 * @class
 */
declare class TimeoutPromise<T> {
    /**
     * The timeout in milliseconds
     * @type {number}
     */
    timeout: number;
    /**
     * The reason for the timeout rejection
     * @type {Error}
     */
    error: Error;
    /**
     * The promise that will be executed on
     * @type {Promise<T>}
     */
    promise: Promise<T>;
    private timer;
    private rejectCallback;
    /**
     * Creates a new timeout promise
     * @param {number} timeout The timeout in milliseconds
     * @param {string} reason The reason for the rejection when it times out
     */
    constructor(timeout: number, error: Error);
    /**
     * Cancels the promise from rejecting after the specified time
     * @returns {void}
     */
    cancel(): void;
}
export default TimeoutPromise;
