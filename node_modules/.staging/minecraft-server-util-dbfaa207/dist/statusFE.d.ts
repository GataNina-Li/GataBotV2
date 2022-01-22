import { StatusResponse } from './model/StatusResponse';
import { StatusOptions } from './model/Options';
/**
 * Retrieves the status of the server using the Beta 1.8 - 1.3.2 format.
 * @param {string} host The host of the server
 * @param {StatusOptions} [options] The options to use when retrieving the status
 * @returns {Promise<StatusResponse>} The status information of the server
 * @async
 */
export default function statusFE(host: string, options?: StatusOptions): Promise<StatusResponse>;
