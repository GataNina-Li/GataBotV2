/**
 * Creates a new promise that rejects after the specified time with the message
 * @param {number} timeout The amount of time before the promise rejects
 * @param {string} reason The reason if the promise rejects
 * @param {Promise<T>} cancel A promise that can be resolved to cancel the timeout promise before it rejects
 */
declare function getTimeoutPromise<T>(timeout: number, reason: string, cancel: Promise<void>): Promise<T>;
export default getTimeoutPromise;
