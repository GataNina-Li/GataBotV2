import { BasicQueryResponse } from './model/QueryResponse';
import { QueryOptions } from './model/Options';
/**
 * Performs a basic query on the server using the UDP protocol.
 * @param {string} host The host of the server
 * @param {QueryOptions} [options] The options to use when performing the query
 * @returns {Promise<BasicQueryResponse>} The basic query response data
 * @async
 */
export default function query(host: string, options?: QueryOptions): Promise<BasicQueryResponse>;
