import assert from 'assert';
import parseDescription from './parseDescription';
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
function formatResultFE(host: string, port: number, srvRecord: SRVRecord | null, motd: string, onlinePlayers: number, maxPlayers: number, roundTripLatency: number): StatusResponse {
	assert(typeof host === 'string', 'Expected host to be a string, got ' + typeof host);
	assert(host.length > 0, 'Expected host.length > 0, got ' + host.length);
	assert(typeof port === 'number', 'Expected port to be a number, got ' + typeof port);
	assert(Number.isInteger(port), 'Expected port to be an integer, got ' + port);
	assert(port > 0, 'Expected port > 0, got ' + port);
	assert(port < 65536, 'Expected port < 65536, got ' + port);
	assert(typeof onlinePlayers === 'number', 'Expected onlinePlayers to be a number, got ' + typeof onlinePlayers);
	assert(Number.isInteger(onlinePlayers), 'Expected onlinePlayers to be an integer, got ' + onlinePlayers);
	assert(typeof maxPlayers === 'number', 'Expected maxPlayers to be a number, got ' + typeof maxPlayers);
	assert(Number.isInteger(maxPlayers), 'Expected maxPlayers to be an integer, got ' + maxPlayers);
	assert(typeof roundTripLatency === 'number', 'Expected roundTripLatency to be a number, got ' + typeof roundTripLatency);
	assert(Number.isInteger(roundTripLatency), 'Expected roundTripLatency to be an integer, got ' + roundTripLatency);
	assert(roundTripLatency >= 0, 'Expected roundTripLatency >= 0, got ' + port);

	const description = parseDescription(motd);

	return {
		host,
		port,
		srvRecord,
		version: null,
		protocolVersion: null,
		onlinePlayers,
		maxPlayers,
		samplePlayers: null,
		description,
		favicon: null,
		modInfo: null,
		rawResponse: null,
		roundTripLatency
	};
}

export default formatResultFE;