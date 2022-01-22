"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Mutex = void 0;
/**
 * A simple mutex that can be used as a decorator. For examples, see Tests.Mutex.ts
 * @param keyGetter if you want to lock functions based on certain arguments, specify the key for the function based on the arguments
 */
function Mutex(keyGetter) {
    let tasks = {};
    return function (_, __, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const key = (keyGetter && keyGetter.call(this, ...args)) || 'undefined';
            tasks[key] = (async () => {
                try {
                    tasks[key] && await tasks[key];
                }
                catch (_a) {
                }
                const result = await originalMethod.call(this, ...args);
                return result;
            })();
            return tasks[key];
        };
    };
}
exports.Mutex = Mutex;
