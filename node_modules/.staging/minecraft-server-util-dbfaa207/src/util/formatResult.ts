import assert from 'assert';
import parseDescription from './parseDescription';
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
function formatResult(host: string, port: number, srvRecord: SRVRecord | null, result: RawStatusResponse, roundTripLatency: number): StatusResponse {
	assert(typeof host === 'string', 'Expected host to be a string, got ' + typeof host);
	assert(host.length > 0, 'Expected host.length > 0, got ' + host.length);
	assert(typeof port === 'number', 'Expected port to be a number, got ' + typeof port);
	assert(Number.isInteger(port), 'Expected integer, got ' + port);
	assert(port > 0, 'Expected port > 0, got ' + port);
	assert(port < 65536, 'Expected port < 65536, got ' + port);
	assert(typeof result === 'object', 'Expected object, got ' + (typeof result));
	assert(typeof roundTripLatency === 'number', 'Expected roundTripLatency to be a number, got ' + typeof roundTripLatency);
	assert(Number.isInteger(roundTripLatency), 'Expected roundTripLatency to be an integer, got ' + roundTripLatency);
	assert(roundTripLatency >= 0, 'Expected roundTripLatency >= 0, got ' + roundTripLatency);

	const version = result?.version?.name ?? null;
	const protocolVersion = result?.version?.protocol ?? null;
	const onlinePlayers = result?.players?.online ?? null;
	const maxPlayers = result?.players?.max ?? null;
	const samplePlayers = result?.players?.sample ?? null;
	const description = typeof result.description !== 'undefined' ? parseDescription(result.description) : null;
	const favicon = result?.favicon ?? null;
	const modInfo = result?.modinfo ?? null;

	return {
		host,
		port,
		srvRecord,
		version,
		protocolVersion,
		onlinePlayers,
		maxPlayers,
		samplePlayers,
		description,
		favicon,
		modInfo,
		rawResponse: result,
		roundTripLatency
	};
}

export default formatResult;