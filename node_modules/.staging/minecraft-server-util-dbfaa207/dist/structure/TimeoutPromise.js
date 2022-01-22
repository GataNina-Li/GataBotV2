"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * This timeout promise is meant to automatically reject after the specified timeout, with the ability to cancel it prematurely
 * @class
 */
class TimeoutPromise {
    /**
     * Creates a new timeout promise
     * @param {number} timeout The timeout in milliseconds
     * @param {string} reason The reason for the rejection when it times out
     */
    constructor(timeout, error) {
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
    cancel() {
        clearTimeout(this.timer);
    }
}
exports.default = TimeoutPromise;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGltZW91dFByb21pc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlL1RpbWVvdXRQcm9taXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7OztHQUdHO0FBQ0gsTUFBTSxjQUFjO0lBbUJuQjs7OztPQUlHO0lBQ0gsWUFBWSxPQUFlLEVBQUUsS0FBWTtRQUN4QyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsY0FBYyxHQUFHLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFFeEMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUM5QyxJQUFJLENBQUMsY0FBYyxHQUFHLE1BQU0sQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxLQUFLLEdBQUcsVUFBVSxDQUFDLEdBQUcsRUFBRTtZQUM1QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqQyxDQUFDLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxNQUFNO1FBQ0wsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0NBQ0Q7QUFFRCxrQkFBZSxjQUFjLENBQUMifQ==