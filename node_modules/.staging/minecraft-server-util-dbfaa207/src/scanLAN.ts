import assert from 'assert';
import dgram from 'dgram';
import { TextDecoder } from 'util';
import Description from './structure/Description';
import { ScanLANOptions } from './model/Options';
import { ScanLANResponse, ScanLANServer } from './model/ScanLANResponse';

const pattern = /\[MOTD\](.+)?(?=\[\/MOTD\])\[\/MOTD\]\[AD\](\d+)\[\/AD\]/;
const decoder = new TextDecoder('utf-8');

function applyDefaultOptions(options?: ScanLANOptions): Required<ScanLANOptions> {
	// Apply the provided options on the default options
	return Object.assign({
		scanTime: 1000 * 5
	} as Required<ScanLANOptions>, options);
}

/**
 * Scans the local area network for any Minecraft worlds.
 * @param {ScanLANOptions} [options] The options to use when scanning LAN
 * @returns {Promise<ScanLANResponse>} The response of the scan
 * @async
 */
export default async function scanLAN(options?: ScanLANOptions): Promise<ScanLANResponse> {
	// Applies the provided options on top of the default options
	const opts = applyDefaultOptions(options);

	// Assert that the arguments are the correct type and format
	assert(typeof options === 'object' || typeof options === 'undefined', `Expected 'options' to be an object or undefined, got ${typeof options}`);
	assert(typeof opts === 'object', `Expected 'options' to be an object, got ${typeof opts}`);
	assert(typeof opts.scanTime === 'number', `Expected 'options.scanTime' to be a number, got ${typeof opts.scanTime}`);
	assert(opts.scanTime >= 1500, `Expected 'options.scanTime' to be greater than or equal to 1500, got ${opts.scanTime}`);

	// Create a list of servers that the socket will append to
	const servers: ScanLANServer[] = [];

	// Create a new UDP socket and listen for messages
	const socket = dgram.createSocket('udp4');

	// Wait for messages being broadcased
	socket.on('message', (message, info) => {
		const text = decoder.decode(message);

		// Ensure that the text sent to the scan port matches the "Open to LAN" format
		if (!pattern.test(text)) return;

		const match = text.match(pattern);
		if (!match) return;

		// Parse the port out of the matched text
		const port = parseInt(match[2]);
		if (isNaN(port)) return;

		if (servers.length > 0) {
			// Check if the server already exists in the list of servers for long scan times
			const server = servers.find((server) => server.host === info.address && server.port === port);
			if (server) return;

			servers.push({
				host: info.address,
				port,
				description: new Description(match[1] ?? '')
			});
		} else {
			// Add the server to the servers list
			servers.push({
				host: info.address,
				port,
				description: new Description(match[1] ?? '')
			});
		}
	});

	// Bind to the 4445 port which is used for receiving and broadcasting "Open to LAN" worlds
	socket.bind(4445, () => {
		socket.addMembership('224.0.2.60');
	});

	// Return the timeout promise that will resolve when the scan time is up
	return new Promise((resolve) => setTimeout(() => {
		resolve({ servers });

		socket.close();
	}, opts.scanTime));
}