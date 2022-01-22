import assert from 'assert';
import Packet from './structure/Packet';
import TCPSocket from './structure/TCPSocket';
import formatResult from './util/formatResult';
import resolveSRV, { SRVRecord } from './util/resolveSRV';
import { StatusResponse } from './model/StatusResponse';
import { RawStatusResponse } from './model/RawStatusResponse';
import { StatusOptions } from './model/Options';

const ipAddressRegEx = /^\d{1,3}(\.\d{1,3}){3}$/;

function applyDefaultOptions(options?: StatusOptions): Required<StatusOptions> {
	// Apply the provided options on the default options
	return Object.assign({
		port: 25565,
		protocolVersion: 47,
		timeout: 1000 * 5,
		enableSRV: true
	} as Required<StatusOptions>, options);
}

/**
 * Retrieves the status of the server using the 1.7+ format.
 * @param {string} host The host of the server
 * @param {StatusOptions} [options] The options to use when retrieving the status
 * @returns {Promise<StatusResponse>} The status information of the server
 * @async
 */
export default async function status(host: string, options?: StatusOptions): Promise<StatusResponse> {
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
	assert(typeof opts.protocolVersion === 'number', `Expected 'options.protocolVersion' to be a number, got ${typeof opts.protocolVersion}`);
	assert(opts.protocolVersion >= 0, `Expected 'options.protocolVersion' to be greater than or equal to 0, got ${opts.protocolVersion}`);
	assert(Number.isInteger(opts.protocolVersion), `Expected 'options.protocolVersion' to be an integer, got ${opts.protocolVersion}`);
	assert(typeof opts.timeout === 'number', `Expected 'options.timeout' to be a number, got ${typeof opts.timeout}`);
	assert(opts.timeout > 0, `Expected 'options.timeout' to be greater than 0, got ${opts.timeout}`);
	assert(typeof opts.enableSRV === 'boolean', `Expected 'options.enableSRV' to be a boolean, got ${typeof opts.enableSRV}`);

	let srvRecord: SRVRecord | null = null;

	// Automatically resolve from host (e.g. play.hypixel.net) into a connect-able address
	if (opts.enableSRV && !ipAddressRegEx.test(host)) {
		srvRecord = await resolveSRV(host);
	}

	const startTime = Date.now();

	// Create a new TCP connection to the specified address
	const socket = await TCPSocket.connect(srvRecord?.host ?? host, srvRecord?.port ?? opts.port, opts.timeout);

	try {
		// Create the necessary packets and send them to the server
		{
			// https://wiki.vg/Server_List_Ping#Handshake
			const handshakePacket = new Packet();
			handshakePacket.writeVarInt(0x00);
			handshakePacket.writeVarInt(opts.protocolVersion);
			handshakePacket.writeString(host, true);
			handshakePacket.writeUShortBE(opts.port);
			handshakePacket.writeVarInt(1);
			await socket.writePacket(handshakePacket, true);

			// https://wiki.vg/Server_List_Ping#Request
			const requestPacket = new Packet();
			requestPacket.writeVarInt(0x00);
			await socket.writePacket(requestPacket, true);
		}

		// https://wiki.vg/Server_List_Ping#Response
		const responsePacket = await Packet.from(socket);
		const packetType = responsePacket.readVarInt();

		// Packet was unexpected type, ignore the rest of the data in this packet
		if (packetType !== 0) throw new Error('Server sent an invalid packet type');

		// Convert the raw JSON string provided by the server into a JavaScript object
		let result: RawStatusResponse;

		try {
			result = JSON.parse(responsePacket.readString());
		} catch (e) {
			throw new Error('Response from server is not valid JSON');
		}

		// Convert the data from raw Minecraft status payload format into a more human readable format and resolve the promise
		return formatResult(host, opts.port, srvRecord, result, Date.now() - startTime);
	} finally {
		// Destroy the socket, it is no longer needed
		await socket.destroy();
	}
}