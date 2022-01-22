import { SRVRecord } from './resolveSRV';
import { StatusResponse } from '../model/StatusResponse';
import { RawStatusResponse } from '../model/RawStatusResponse';
/**
 * Formats the raw response from a status request into a more useable format
 * @param {string} host The host of the server
 * @param {number} port The port of the server
 * @param {SRVRecord | null} srvRecord The SRV lookup data
 * @param {RawStatusResponse} result The raw JSON data returned from the server
 * @returns {StatusResponse} The formatted result
 */
declare function formatResult(host: string, port: number, srvRecord: SRVRecord | null, result: RawStatusResponse, roundTripLatency: number): StatusResponse;
export default formatResult;
