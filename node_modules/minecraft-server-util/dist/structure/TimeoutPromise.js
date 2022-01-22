"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This timeout promise is meant to automatically resolve/reject after the specified timeout, with the ability to cancel it prematurely
 * @class
 */
class TimeoutPromise {
    /**
     * Creates a new timeout promise
     * @param {number} timeout The timeout in milliseconds
     * @param {Error} reason The reason for the rejection when it times out
     */
    constructor(timeout, callback) {
        let resolve = () => undefined;
        let reject = () => undefined;
        this.promise = new Promise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        this.timer = setTimeout(() => {
            callback(resolve, reject);
        }, timeout);
    }
    /**
     * Cancels the promise from rejecting after the specified time
     * @returns {void}
     */
    cancel() {
        clearTimeout(this.timer);
    }
}
exports.default = TimeoutPromise;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGltZW91dFByb21pc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlL1RpbWVvdXRQcm9taXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUE7OztHQUdHO0FBQ0gsTUFBTSxjQUFjO0lBUW5COzs7O09BSUc7SUFDSCxZQUFZLE9BQWUsRUFBRSxRQUE0QjtRQUN4RCxJQUFJLE9BQU8sR0FBOEIsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDO1FBQ3pELElBQUksTUFBTSxHQUEwQixHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUM7UUFFcEQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUMxQyxPQUFPLEdBQUcsR0FBRyxDQUFDO1lBQ2QsTUFBTSxHQUFHLEdBQUcsQ0FBQztRQUNkLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLEtBQUssR0FBRyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQzVCLFFBQVEsQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDM0IsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2IsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU07UUFDTCxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7Q0FDRDtBQUVELGtCQUFlLGNBQWMsQ0FBQyJ9