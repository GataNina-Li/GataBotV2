import { StatusResponse } from './model/StatusResponse';
import { StatusOptions } from './model/Options';
/**
 * Retrieves the status of the server using the 1.4.2 - 1.5.2 format.
 * @param {string} host The host of the server
 * @param {StatusOptions} [options] The options to use when retrieving the status
 * @returns {Promise<StatusResponse>} The status information of the server
 * @async
 */
export default function statusFE01(host: string, options?: StatusOptions): Promise<StatusResponse>;
