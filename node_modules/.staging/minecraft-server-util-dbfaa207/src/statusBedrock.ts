import assert from 'assert';
import crypto from 'crypto';
import { TextDecoder } from 'util';
import Packet from './structure/Packet';
import UDPSocket from './structure/UDPSocket';
import { BedrockStatusResponse } from './model/StatusResponse';
import { BedrockStatusOptions } from './model/Options';
import parseDescription from './util/parseDescription';

const magic = [0x00, 0xFF, 0xFF, 0x00, 0xFE, 0xFE, 0xFE, 0xFE, 0xFD, 0xFD, 0xFD, 0xFD, 0x12, 0x34, 0x56, 0x78];

function applyDefaultOptions(options?: BedrockStatusOptions): Required<BedrockStatusOptions> {
	// Apply the provided options on the default options
	return Object.assign({
		port: 19132,
		timeout: 1000 * 5,
		clientGUID: crypto.randomBytes(4).readUInt32BE()
	} as Required<BedrockStatusOptions>, options);
}

/**
 * Retrieves the status of the Bedrock edition server
 * @param {string} host The host of the server
 * @param {BedrockStatusOptions} [options] The options to use when retrieving the status
 * @returns {Promise<BedrockStatusResponse>} The status information of the server
 * @async
 */
export default async function statusBedrock(host: string, options?: BedrockStatusOptions): Promise<BedrockStatusResponse> {
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
	assert(typeof opts.clientGUID === 'number', `Expected 'options.clientGUID' to be a number, got ${typeof opts.clientGUID}`);

	const startTime = Date.now();

	// Create a new UDP connection to the specified address
	const socket = new UDPSocket(host, opts.port, opts.timeout);

	try {
		// https://wiki.vg/Raknet_Protocol#Unconnected_Ping
		const pingPacket = new Packet();
		pingPacket.writeByte(0x01); // Packet ID
		pingPacket.writeLongBE(BigInt(Date.now())); // Time
		pingPacket.writeByte(...magic); // Magic
		pingPacket.writeLongBE(BigInt(opts.clientGUID)); // Client GUID
		await socket.writePacket(pingPacket);

		// https://wiki.vg/Raknet_Protocol#Unconnected_Pong
		const pongPacket = await socket.readPacket();

		// Begin reading the data out of the packet
		const packetType = pongPacket.readByte(); // Packet type

		// Packet was unexpected type, ignore the rest of the data in this packet
		if (packetType !== 0x1C) throw new Error('Server sent an invalid packet type');

		// Finish reading the data out of the packet
		pongPacket.readLongBE(); // Time
		const serverGUID = pongPacket.readLongBE(); // Server GUID
		pongPacket.readBytes(16); // Magic
		const serverIDBytes = pongPacket.readBytes(pongPacket.readUShortBE()); // Server ID

		// Property decode the server ID bytes into a response string
		const response = new TextDecoder().decode(Uint8Array.from(serverIDBytes));

		// Split the response string into multiple tokens, where each is a status item
		const splitResponse = response.split(';');

		// Grab each element out of the split response string, they may be missing which we'll fix later in the code
		const [edition, motdLine1, protocolVersion, version, onlinePlayers, maxPlayers, serverID, motdLine2, gameMode, gameModeID, portIPv4, portIPv6] = splitResponse;

		return {
			host,
			port: opts.port,
			edition: edition && edition.length > 0 ? edition : null,
			serverGUID,
			motdLine1: motdLine1 && motdLine1.length > 0 ? parseDescription(motdLine1) : null,
			motdLine2: motdLine2 && motdLine1.length > 0 ? parseDescription(motdLine2) : null,
			version: version && version.length > 0 ? version : null,
			protocolVersion: isNaN(parseInt(protocolVersion)) ? null : parseInt(protocolVersion),
			maxPlayers: isNaN(parseInt(maxPlayers)) ? null : parseInt(maxPlayers),
			onlinePlayers: isNaN(parseInt(onlinePlayers)) ? null : parseInt(onlinePlayers),
			serverID: serverID && serverID.length > 0 ? serverID : null,
			gameMode: gameMode && gameMode.length > 0 ? gameMode : null,
			gameModeID: isNaN(parseInt(gameModeID)) ? null : parseInt(gameModeID),
			portIPv4: isNaN(parseInt(portIPv4)) ? null : parseInt(portIPv4),
			portIPv6: isNaN(parseInt(portIPv6)) ? null : parseInt(portIPv6),
			roundTripLatency: Date.now() - startTime
		};
	} finally {
		// Destroy the socket, it is no longer needed
		await socket.destroy();
	}
}