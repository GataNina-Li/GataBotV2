/// <reference types="node" />
import net from 'net';
import Packet from './Packet';
/**
 * A TCP socket utility class for easily interacting with remote sockets.
 * @class
 */
declare class TCPSocket {
    /**
     * The raw TCP socket provided by Node.js methods.
     * @type {net.Socket}
     */
    socket: net.Socket;
    /**
     * A boolean that indicates whether the socket is connected or not.
     * @type {boolean}
     */
    isConnected: boolean;
    private buffer;
    /**
     * Creates a new TCP socket class from the existing connection.
     * @param {net.Socket} socket The existing TCP connection
     * @constructor
     */
    constructor(socket: net.Socket);
    /**
     * Automatically connects to the server using the host and port.
     * @param {string} host The host of the server
     * @param {number} port The port of the server
     * @param {number} timeout The timeout in milliseconds
     * @returns {Promise<TCPSocket>} A Promise that resolves to the TCP socket
     * @async
     */
    static connect(host: string, port: number, timeout: number): Promise<TCPSocket>;
    /**
     * Reads a byte from the stream.
     * @returns {Promise<number>} The byte read from the stream
     * @async
     */
    readByte(): Promise<number>;
    /**
     * Read bytes from the stream.
     * @param {number} length The amount of bytes to read
     * @returns {Promise<Buffer>} The bytes read from the stream
     * @async
     */
    readBytes(length: number): Promise<Buffer>;
    /**
     * Read a varint from the stream.
     * @returns {Promise<number>} The varint read from the stream
     * @async
     */
    readVarInt(): Promise<number>;
    /**
     * Reads a short (int16, big-endian) from the stream.
     * @returns {Promise<number>} The int16 read from the stream
     * @async
     */
    readShort(): Promise<number>;
    /**
     * Reads a short (int16, little-endian) from the stream.
     * @returns {Promise<number>} The int16 read from the stream
     * @async
     */
    readIntLE(): Promise<number>;
    /**
     * Writes bytes to the stream.
     * @param {Buffer} buffer The buffer to write to the stream.
     * @returns {Promise<void>} The Promise that resolves when it has successfully written the data
     * @async
     */
    writeBytes(buffer: Buffer): Promise<void>;
    /**
     * Writes a {@see Packet} to the stream.
     * @param {Packet} packet The Packet to write to the stream
     * @param {boolean} [prefixLength=true] Write the packet length as a prefix as a varint
     * @returns {Promise<void>} The Promise that resolves when the packet has been written
     * @async
     */
    writePacket(packet: Packet, prefixLength?: boolean): Promise<void>;
    /**
     * Closes the stream and cleans up data.
     * @returns {Promise<void>} The Promise that resolves when the connection has closed
     * @async
     */
    destroy(): Promise<void>;
}
export default TCPSocket;
