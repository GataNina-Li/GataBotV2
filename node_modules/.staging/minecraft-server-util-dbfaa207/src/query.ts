import assert from 'assert';
import Packet from './structure/Packet';
import resolveSRV, { SRVRecord } from './util/resolveSRV';
import { BasicQueryResponse } from './model/QueryResponse';
import UDPSocket from './structure/UDPSocket';
import parseDescription from './util/parseDescription';
import { QueryOptions } from './model/Options';

const ipAddressRegEx = /^\d{1,3}(\.\d{1,3}){3}$/;
let sessionCounter = 0;

function applyDefaultOptions(options?: QueryOptions): Required<QueryOptions> {
	// Apply the provided options on the default options
	return Object.assign({
		port: 25565,
		timeout: 1000 * 5,
		enableSRV: true,
		sessionID: ++sessionCounter
	} as Required<QueryOptions>, options);
}

/**
 * Performs a basic query on the server using the UDP protocol.
 * @param {string} host The host of the server
 * @param {QueryOptions} [options] The options to use when performing the query
 * @returns {Promise<BasicQueryResponse>} The basic query response data
 * @async
 */
export default async function query(host: string, options?: QueryOptions): Promise<BasicQueryResponse> {
	// Applies the provided options on top of the default options
	const opts = applyDefaultOptions(options);

	// Assert that the arguments are the correct type and format
	assert(typeof host === 'string', `Expected 'host' to be a string, got ${typeof host}`);
	assert(host.length > 0, 'Expected \'host\' to have content, got an empty string');
	assert(typeof options === 'object' || typeof options === 'undefined', `Expected 'options' to be an object or undefined, got ${typeof options}`);
	assert(typeof opts === 'object', `Expected 'options' to be an object, got ${typeof opts}`);
	assert(typeof opts.port === 'number', `Expected 'options.port' to be a number, got ${typeof opts.port}`);
	assert(opts.port > 0, `Expected 'options.port' to be greater than 0, got ${opts.port}`);
	assert(opts.port < 65536, `Expected 'options.port' to be less than 65536, got ${opts.port}`);
	assert(Number.isInteger(opts.port), `Expected 'options.port' to be an integer, got ${opts.port}`);
	assert(typeof opts.timeout === 'number', `Expected 'options.timeout' to be a number, got ${typeof opts.timeout}`);
	assert(opts.timeout > 0, `Expected 'options.timeout' to be greater than 0, got ${opts.timeout}`);
	assert(typeof opts.sessionID === 'number', `Expected 'options.sessionID' to be a number, got ${typeof opts.sessionID}`);
	assert(opts.sessionID > 0, `Expected 'options.sessionID' to be greater than 0, got ${opts.sessionID}`);
	assert(opts.sessionID < 0xFFFFFFFF, `Expected 'options.sessionID' to be less than ${0xFFFFFFFF}, got ${opts.sessionID}`);
	assert(Number.isInteger(opts.sessionID), `Expected 'options.sessionID' to be an integer, got ${opts.sessionID}`);
	assert(typeof opts.enableSRV === 'boolean', `Expected 'options.enableSRV' to be a boolean, got ${typeof opts.enableSRV}`);

	// Only the last 4 bits of each byte is used when sending a session ID
	opts.sessionID &= 0x0F0F0F0F;

	let challengeToken: number;
	let srvRecord: SRVRecord | null = null;

	// Automatically resolve from host (e.g. play.hypixel.net) into a connect-able address
	if (opts.enableSRV && !ipAddressRegEx.test(host)) {
		srvRecord = await resolveSRV(host);
	}

	const startTime = Date.now();

	// Create a new UDP connection to the specified address
	const socket = new UDPSocket(srvRecord?.host ?? host, opts.port, opts.timeout);

	try {
		{
			// Create a Handshake packet and send it to the server
			// https://wiki.vg/Query#Request
			const requestPacket = new Packet();
			requestPacket.writeByte(0xFE, 0xFD, 0x09);
			requestPacket.writeIntBE(opts.sessionID);
			await socket.writePacket(requestPacket);
		}

		{
			// Read the response packet for the Handshake from the server
			// https://wiki.vg/Query#Response
			const responsePacket = await socket.readPacket();
			const type = responsePacket.readByte();
			const sessionID = responsePacket.readIntBE();
			challengeToken = parseInt(responsePacket.readStringNT());

			if (type !== 0x09) throw new Error('Server sent an invalid payload type');
			if (sessionID !== opts.sessionID) throw new Error('Session ID in response did not match client session ID');
			if (isNaN(challengeToken)) throw new Error('Server sent an invalid challenge token');
		}

		{
			// Create a Basic Stat Request packet and send it to the server
			// https://wiki.vg/Query#Request_2
			const requestPacket = new Packet();
			requestPacket.writeByte(0xFE, 0xFD, 0x00);
			requestPacket.writeIntBE(opts.sessionID);
			requestPacket.writeIntBE(challengeToken);
			await socket.writePacket(requestPacket);
		}

		let motd, gameType, levelName, onlinePlayers, maxPlayers;

		{
			// Read the response packet for the Basic stat from the server
			const responsePacket = await socket.readPacket();
			const type = responsePacket.readByte();
			const sessionID = responsePacket.readIntBE();
			motd = responsePacket.readStringNT();
			gameType = responsePacket.readStringNT();
			levelName = responsePacket.readStringNT();
			const onlinePlayersStr = responsePacket.readStringNT();
			const maxPlayersStr = responsePacket.readStringNT();

			if (type !== 0x00) throw new Error('Server sent an invalid payload type');

			if (sessionID !== opts.sessionID) throw new Error('Session ID in response did not match client session ID');

			onlinePlayers = parseInt(onlinePlayersStr);
			if (isNaN(onlinePlayers)) throw new Error('Server sent an invalid player count');

			maxPlayers = parseInt(maxPlayersStr);
			if (isNaN(maxPlayers)) throw new Error('Server sent an invalid max player count');
		}

		return {
			host,
			port: opts.port,
			srvRecord,
			gameType,
			levelName,
			onlinePlayers,
			maxPlayers,
			description: parseDescription(motd),
			roundTripLatency: Date.now() - startTime
		};
	} finally {
		// Destroy the socket, it is no longer needed
		await socket.destroy();
	}
}