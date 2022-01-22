import { SRVRecord } from './resolveSRV';
import { StatusResponse } from '../model/StatusResponse';
/**
 * Formats the raw response from a status request into a more useable format
 * @param {string} host The host of the server
 * @param {number} port The port of the server
 * @param {SRVRecord | null} srvRecord The SRV lookup data
 * @param {number} protocolVersion The protocol version returned from the server
 * @param {string} version The version string of the server
 * @param {string} motd The MOTD of the server
 * @param {number} onlinePlayers The amount of players in the server
 * @param {number} maxPlayers The maximum amount of players in the server
 * @returns {StatusResponse} The formatted result
 */
declare function formatResultFE01FA(host: string, port: number, srvRecord: SRVRecord | null, protocolVersion: number, version: string, motd: string, onlinePlayers: number, maxPlayers: number, roundTripLatency: number): StatusResponse;
export default formatResultFE01FA;
