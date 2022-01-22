/**
 * A simple mutex that can be used as a decorator. For examples, see Tests.Mutex.ts
 * @param keyGetter if you want to lock functions based on certain arguments, specify the key for the function based on the arguments
 */
export declare function Mutex(keyGetter?: (...args: any[]) => string): (_: any, __: any, descriptor: PropertyDescriptor) => void;
