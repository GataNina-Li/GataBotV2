import { SRVRecord } from './resolveSRV';
import { StatusResponse } from '../model/StatusResponse';
/**
 * Formats the raw response from a status request into a more useable format
 * @param {string} host The host of the server
 * @param {number} port The port of the server
 * @param {SRVRecord | null} srvRecord The SRV lookup data
 * @param {string} motd The MOTD of the server
 * @param {number} onlinePlayers The amount of online players
 * @param {number} maxPlayers The maximum amount of players
 * @returns {StatusResponse} The formatted result
 */
declare function formatResultFE(host: string, port: number, srvRecord: SRVRecord | null, motd: string, onlinePlayers: number, maxPlayers: number, roundTripLatency: number): StatusResponse;
export default formatResultFE;
