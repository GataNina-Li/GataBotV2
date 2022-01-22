import { StatusResponse } from './model/StatusResponse';
import { StatusOptions } from './model/Options';
/**
 * Retrieves the status of the server using the 1.6.1 - 1.6.4 format.
 * @param {string} host The host of the server
 * @param {StatusOptions} [options] The options to use when retrieving the status
 * @returns {Promise<StatusResponse>} The status information of the server
 * @async
 */
export default function statusFE01FA(host: string, options?: StatusOptions): Promise<StatusResponse>;
