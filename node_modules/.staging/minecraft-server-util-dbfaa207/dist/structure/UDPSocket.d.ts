import Packet from './Packet';
/**
 * A UDP socket class for reading and writing data to a remote socket.
 * @class
 */
declare class UDPSocket {
    private host;
    private port;
    private timeout;
    private socket;
    private buffer;
    /**
     * Creates a new UDP socket class from the host and port.
     * @param {string} host The host of the server
     * @param {number} port The port of the server
     * @param {number} timeout The timeout in milliseconds
     * @constructor
     */
    constructor(host: string, port: number, timeout: number);
    /**
     * Reads a packet from the UDP socket.
     * @returns {Promise<Packet>} The packet read from the socket
     * @async
     */
    readPacket(): Promise<Packet>;
    /**
     * Writes a packet to the UDP connection.
     * @param {Packet} packet The packet to write to the connection
     * @returns {Promise<void>} A Promise that resolves when it has written the packet
     * @async
     */
    writePacket(packet: Packet): Promise<void>;
    /**
     * Closes the connection and cleans up data.
     * @returns {Promise<void>} A Promise that resolves when the client has closed
     * @async
     */
    destroy(): Promise<void>;
}
export default UDPSocket;
