import assert from 'assert';
import parseDescription from './parseDescription';
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
function formatResultFE01FA(host: string, port: number, srvRecord: SRVRecord | null, protocolVersion: number, version: string, motd: string, onlinePlayers: number, maxPlayers: number, roundTripLatency: number): StatusResponse {
	assert(typeof host === 'string', 'Expected host to be a string, got ' + typeof host);
	assert(host.length > 0, 'Expected host.length > 0, got ' + host.length);
	assert(typeof port === 'number', 'Expected port to be a number, got ' + typeof port);
	assert(Number.isInteger(port), 'Expected port to be an integer, got ' + port);
	assert(port > 0, 'Expected port > 0, got ' + port);
	assert(port < 65536, 'Expected port < 65536, got ' + port);
	assert(typeof protocolVersion === 'number', 'Expected protocolVersion to be a number, got ' + typeof protocolVersion);
	assert(Number.isInteger(protocolVersion), 'Expected protocolVersion to be an integer, got ' + protocolVersion);
	assert(protocolVersion >= 0, 'Expected protocolVersion >= 0, got ' + protocolVersion);
	assert(typeof version === 'string', 'Expected version to be a string, got ' + typeof version);
	assert(version.length > 0, 'Expected version.length > 0, got ' + version.length);
	assert(typeof onlinePlayers === 'number', 'Expected onlinePlayers to be a number, got ' + typeof onlinePlayers);
	assert(Number.isInteger(onlinePlayers), 'Expected onlinePlayers to be an integer, got ' + onlinePlayers);
	assert(typeof maxPlayers === 'number', 'Expected maxPlayers to be a number, got ' + typeof maxPlayers);
	assert(Number.isInteger(maxPlayers), 'Expected maxPlayers to be an integer, got ' + maxPlayers);

	const description = parseDescription(motd);

	return {
		host,
		port,
		srvRecord,
		version,
		protocolVersion,
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

export default formatResultFE01FA;