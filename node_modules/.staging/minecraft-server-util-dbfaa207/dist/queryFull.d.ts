import { FullQueryResponse } from './model/QueryResponse';
import { QueryOptions } from './model/Options';
/**
 * Performs a full query on the server using the UDP protocol.
 * @param {string} host The host of the server
 * @param {QueryOptions} [options] The options to use when performing the query
 * @returns {Promise<FullQueryResponse>} The full query response data
 * @async
 */
export default function queryFull(host: string, options?: QueryOptions): Promise<FullQueryResponse>;
