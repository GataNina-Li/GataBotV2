"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const domain_1 = __importDefault(require("domain"));
const assert_1 = __importDefault(require("assert"));
const net_1 = __importDefault(require("net"));
const Packet_1 = __importDefault(require("./Packet"));
/**
 * A TCP socket utility class for easily interacting with remote sockets.
 * @class
 */
class TCPSocket {
    /**
     * Creates a new TCP socket class from the existing connection.
     * @param {net.Socket} socket The existing TCP connection
     * @constructor
     */
    constructor(socket) {
        /**
         * A boolean that indicates whether the socket is connected or not.
         * @type {boolean}
         */
        this.isConnected = false;
        this.socket = socket;
        this.buffer = Buffer.alloc(0);
        socket.on('data', (data) => {
            this.buffer = Buffer.concat([this.buffer, data]);
        });
    }
    /**
     * Automatically connects to the server using the host and port.
     * @param {string} host The host of the server
     * @param {number} port The port of the server
     * @param {number} timeout The timeout in milliseconds
     * @returns {Promise<TCPSocket>} A Promise that resolves to the TCP socket
     * @async
     */
    static connect(host, port, timeout) {
        assert_1.default(host.length > 0, 'Expected host.length > 0, got ' + host.length);
        assert_1.default(Number.isInteger(port), 'Expected integer, got ' + port);
        assert_1.default(port > 0, 'Expected port > 0, got ' + port);
        assert_1.default(port < 65536, 'Expected port < 65536, got ' + port);
        assert_1.default(timeout > 0, 'Expected timeout > 0, got ' + timeout);
        return new Promise((resolve, reject) => {
            const d = domain_1.default.create();
            d.on('error', (error) => {
                reject(error);
            });
            d.run(() => {
                const cleanupHandlers = () => {
                    socket.removeListener('connect', connectHandler);
                    socket.removeListener('close', closeHandler);
                    socket.removeListener('end', endHandler);
                    socket.removeListener('error', errorHandler);
                    socket.removeListener('timeout', timeoutHandler);
                };
                const connectHandler = () => {
                    cleanupHandlers();
                    resolve(new TCPSocket(socket));
                };
                const closeHandler = () => {
                    cleanupHandlers();
                    reject();
                };
                const endHandler = () => {
                    cleanupHandlers();
                    reject();
                };
                const errorHandler = (error) => {
                    cleanupHandlers();
                    reject(error);
                };
                const timeoutHandler = () => {
                    cleanupHandlers();
                    reject();
                };
                const socket = net_1.default.createConnection({ host, port, timeout });
                socket.on('connect', connectHandler);
                socket.on('close', closeHandler);
                socket.on('end', endHandler);
                socket.on('error', errorHandler);
                socket.on('timeout', timeoutHandler);
                socket.setTimeout(timeout);
            });
        });
    }
    /**
     * Reads a byte from the stream.
     * @returns {Promise<number>} The byte read from the stream
     * @async
     */
    readByte() {
        if (this.buffer.byteLength > 0) {
            const value = this.buffer[0];
            this.buffer = this.buffer.slice(1);
            return Promise.resolve(value);
        }
        return new Promise((resolve, reject) => {
            let read = false;
            const cleanupHandlers = () => {
                this.socket.removeListener('data', dataHandler);
                this.socket.removeListener('error', errorHandler);
                this.socket.removeListener('end', endHandler);
            };
            const dataHandler = () => {
                if (read)
                    return;
                if (this.buffer.byteLength > 0) {
                    read = true;
                    cleanupHandlers();
                    const value = this.buffer[0];
                    this.buffer = this.buffer.slice(1);
                    return resolve(value);
                }
            };
            const errorHandler = (error) => {
                cleanupHandlers();
                reject(error);
            };
            const endHandler = () => {
                cleanupHandlers();
                reject(new Error('Socket ended without sending any data back'));
            };
            const timeoutHandler = () => {
                cleanupHandlers();
                reject(new Error('Socket timed out while waiting for data'));
            };
            this.socket.on('data', dataHandler);
            this.socket.on('error', errorHandler);
            this.socket.on('end', endHandler);
            this.socket.on('close', endHandler);
            this.socket.on('timeout', timeoutHandler);
        });
    }
    /**
     * Read bytes from the stream.
     * @param {number} length The amount of bytes to read
     * @returns {Promise<Buffer>} The bytes read from the stream
     * @async
     */
    readBytes(length) {
        if (this.buffer.byteLength >= length) {
            const value = this.buffer.slice(0, length);
            this.buffer = this.buffer.slice(length);
            return Promise.resolve(value);
        }
        return new Promise((resolve) => {
            let read = false;
            const dataHandler = () => {
                if (read)
                    return;
                process.nextTick(() => {
                    if (this.buffer.byteLength >= length) {
                        read = true;
                        this.socket.removeListener('data', dataHandler);
                        const value = this.buffer.slice(0, length);
                        this.buffer = this.buffer.slice(length);
                        return resolve(value);
                    }
                });
            };
            this.socket.on('data', dataHandler);
        });
    }
    /**
     * Read a varint from the stream.
     * @returns {Promise<number>} The varint read from the stream
     * @async
     */
    readVarInt() {
        return __awaiter(this, void 0, void 0, function* () {
            let numRead = 0;
            let result = 0;
            let read, value;
            do {
                if (numRead > 4)
                    throw new Error('VarInt exceeds data bounds');
                read = yield this.readByte();
                value = (read & 0b01111111);
                result |= (value << (7 * numRead));
                numRead++;
                if (numRead > 5)
                    throw new Error('VarInt is too big');
            } while ((read & 0b10000000) != 0);
            return result;
        });
    }
    /**
     * Reads a short (int16, big-endian) from the stream.
     * @returns {Promise<number>} The int16 read from the stream
     * @async
     */
    readShort() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.readBytes(2);
            return (data[0] << 8) | data[1];
        });
    }
    /**
     * Reads a short (int16, little-endian) from the stream.
     * @returns {Promise<number>} The int16 read from the stream
     * @async
     */
    readIntLE() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.readBytes(4);
            return data[0] | (data[1] << 8) | (data[2] << 16) | (data[3] << 24);
        });
    }
    /**
     * Writes bytes to the stream.
     * @param {Buffer} buffer The buffer to write to the stream.
     * @returns {Promise<void>} The Promise that resolves when it has successfully written the data
     * @async
     */
    writeBytes(buffer) {
        return new Promise((resolve, reject) => {
            this.socket.write(buffer, (error) => {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    }
    /**
     * Writes a {@see Packet} to the stream.
     * @param {Packet} packet The Packet to write to the stream
     * @param {boolean} [prefixLength=true] Write the packet length as a prefix as a varint
     * @returns {Promise<void>} The Promise that resolves when the packet has been written
     * @async
     */
    writePacket(packet, prefixLength = true) {
        if (prefixLength) {
            const finalPacket = new Packet_1.default();
            finalPacket.writeVarInt(packet.buffer.byteLength);
            finalPacket.writeBuffer(packet.buffer);
            return this.writeBytes(Buffer.from(finalPacket.buffer));
        }
        return this.writeBytes(Buffer.from(packet.buffer));
    }
    /**
     * Closes the stream and cleans up data.
     * @returns {Promise<void>} The Promise that resolves when the connection has closed
     * @async
     */
    destroy() {
        return new Promise((resolve) => {
            this.socket.removeAllListeners();
            this.socket.end(() => {
                this.socket.destroy();
                resolve();
            });
        });
    }
}
exports.default = TCPSocket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVENQU29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZS9UQ1BTb2NrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsb0RBQTRCO0FBQzVCLDhDQUFzQjtBQUN0QixzREFBOEI7QUFFOUI7OztHQUdHO0FBQ0gsTUFBTSxTQUFTO0lBYWQ7Ozs7T0FJRztJQUNILFlBQVksTUFBa0I7UUFaOUI7OztXQUdHO1FBQ0ksZ0JBQVcsR0FBRyxLQUFLLENBQUM7UUFTMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTlCLE1BQU0sQ0FBQyxFQUFFLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUU7WUFDMUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2xELENBQUMsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxNQUFNLENBQUMsT0FBTyxDQUFDLElBQVksRUFBRSxJQUFZLEVBQUUsT0FBZTtRQUN6RCxnQkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLGdDQUFnQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4RSxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDaEUsZ0JBQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLHlCQUF5QixHQUFHLElBQUksQ0FBQyxDQUFDO1FBQ25ELGdCQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssRUFBRSw2QkFBNkIsR0FBRyxJ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