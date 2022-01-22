"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Creates a new promise that rejects after the specified time with the message
 * @param {number} timeout The amount of time before the promise rejects
 * @param {string} reason The reason if the promise rejects
 * @param {Promise<T>} cancel A promise that can be resolved to cancel the timeout promise before it rejects
 */
function getTimeoutPromise(timeout, reason, cancel) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(reason), timeout);
        cancel.then(() => {
            clearTimeout(timer);
            resolve();
        });
    });
}
// A big thanks to the following Gist for a code sample to work off of:
// - https://gist.github.com/ericelliott/7da732294d4c23c549aeff887e02fa82
// This workaround was created from the following issue:
// - https://github.com/PassTheMayo/minecraft-server-util/issues/27
exports.default = getTimeoutPromise;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0VGltZW91dFByb21pc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbC9nZXRUaW1lb3V0UHJvbWlzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7OztHQUtHO0FBQ0gsU0FBUyxpQkFBaUIsQ0FBSSxPQUFlLEVBQUUsTUFBYyxFQUFFLE1BQXFCO0lBQ25GLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7UUFDdEMsTUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUV4RCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNoQixZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7WUFFcEIsT0FBTyxFQUFFLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELHVFQUF1RTtBQUN2RSx5RUFBeUU7QUFDekUsd0RBQXdEO0FBQ3hELG1FQUFtRTtBQUVuRSxrQkFBZSxpQkFBaUIsQ0FBQyJ9