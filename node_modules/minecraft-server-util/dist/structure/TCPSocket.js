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
        const socket = net_1.default.createConnection({ host, port, timeout });
        socket.setTimeout(timeout);
        return new Promise((resolve, reject) => {
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
            socket.on('connect', connectHandler);
            socket.on('close', closeHandler);
            socket.on('end', endHandler);
            socket.on('error', errorHandler);
            socket.on('timeout', timeoutHandler);
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
                console.log(error);
                cleanupHandlers();
                reject(error);
            };
            const endHandler = () => {
                cleanupHandlers();
                reject(new Error('Socket ended without sending any data back'));
            };
            this.socket.on('data', dataHandler);
            this.socket.on('error', errorHandler);
            this.socket.on('end', endHandler);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVENQU29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZS9UQ1BTb2NrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsOENBQXNCO0FBQ3RCLHNEQUE4QjtBQUU5Qjs7O0dBR0c7QUFDSCxNQUFNLFNBQVM7SUFhZDs7OztPQUlHO0lBQ0gsWUFBWSxNQUFrQjtRQVo5Qjs7O1dBR0c7UUFDSSxnQkFBVyxHQUFHLEtBQUssQ0FBQztRQVMxQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFOUIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUMxQixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBWSxFQUFFLElBQVksRUFBRSxPQUFlO1FBQ3pELGdCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsZ0NBQWdDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3hFLGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFBRSx3QkFBd0IsR0FBRyxJQUFJLENBQUMsQ0FBQztRQUNoRSxnQkFBTSxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUUseUJBQXlCLEdBQUcsSUFBSSxDQUFDLENBQUM7UUFDbkQsZ0JBQU0sQ0FBQyxJQUFJLEdBQUcsS0FBSyxFQUFFLDZCQUE2QixHQUFHLElBQUksQ0FBQyxDQUFD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