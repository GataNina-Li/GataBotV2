import dgram from 'dgram';
import Packet from './Packet';
import TimeoutPromise from './TimeoutPromise';

/**
 * A UDP socket class for reading and writing data to a remote socket.
 * @class
 */
class UDPSocket {
	private host: string;
	private port: number;
	private timeout: number;
	private socket: dgram.Socket;
	private buffer: {
		info: dgram.RemoteInfo,
		message: Buffer
	}[];

	/**
	 * Creates a new UDP socket class from the host and port.
	 * @param {string} host The host of the server
	 * @param {number} port The port of the server
	 * @param {number} timeout The timeout in milliseconds
	 * @constructor
	 */
	constructor(host: string, port: number, timeout: number) {
		this.host = host;
		this.port = port;
		this.timeout = timeout;
		this.socket = dgram.createSocket('udp4');
		this.buffer = [];

		this.socket.on('message', (message, info) => {
			this.buffer.push({ info, message });
		});
	}

	/**
	 * Reads a packet from the UDP socket.
	 * @returns {Promise<Packet>} The packet read from the socket
	 * @async
	 */
	readPacket(): Promise<Packet> {
		if (this.buffer.length > 0) {
			const packet = new Packet();

			if (this.buffer.length > 0) {
				const value = this.buffer.shift();

				packet.buffer = value?.message ?? Buffer.alloc(0);
			}

			return Promise.resolve(packet);
		}

		const timeoutPromise = new TimeoutPromise<Packet>(this.timeout, new Error('Timed out while waiting for server response'));

		const actualPromise = new Promise<Packet>((resolve, reject) => {
			let read = false;

			const cleanupHandlers = () => {
				this.socket.removeListener('message', messageHandler);
				this.socket.removeListener('error', errorHandler);
				this.socket.removeListener('close', closeHandler);
			};

			const messageHandler = () => {
				if (read) return;

				if (this.buffer.length > 0) {
					read = true;

					cleanupHandlers();

					const packet = new Packet();

					if (this.buffer.length > 0) {
						const value = this.buffer.shift();

						packet.buffer = value?.message ?? Buffer.alloc(0);
					}

					resolve(packet);
				}
			};

			const errorHandler = (error: Error) => {
				cleanupHandlers();

				reject(error);
			};

			const closeHandler = () => {
				cleanupHandlers();

				reject(new Error('Socket ended without sending any data back'));
			};

			this.socket.on('message', messageHandler);
			this.socket.on('error', errorHandler);
			this.socket.on('close', closeHandler);
		});

		return Promise.race<Packet>([
			timeoutPromise.promise,
			actualPromise
		]);
	}

	/**
	 * Writes a packet to the UDP connection.
	 * @param {Packet} packet The packet to write to the connection
	 * @returns {Promise<void>} A Promise that resolves when it has written the packet
	 * @async
	 */
	writePacket(packet: Packet): Promise<void> {
		return new Promise((resolve, reject) => {
			this.socket.send(Buffer.from(packet.buffer), this.port, this.host, (error) => {
				if (error) return reject(error);

				resolve();
			});
		});
	}

	/**
	 * Closes the connection and cleans up data.
	 * @returns {Promise<void>} A Promise that resolves when the client has closed
	 * @async
	 */
	destroy(): Promise<void> {
		return new Promise((resolve) => {
			this.socket.removeAllListeners();
			this.socket.close(() => {
				resolve();
			});
		});
	}
}

export default UDPSocket;