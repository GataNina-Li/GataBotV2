/**
* Check variable value
* @param {*} variable
 */
declare function _required(variable: string | undefined | number): void;
/**
* replacle all html syntax
* @param {string} data
* @param {string}
*/
declare const clean: (data: string) => string;
export { _required, clean };
