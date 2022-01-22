"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dgram_1 = __importDefault(require("dgram"));
const Packet_1 = __importDefault(require("./Packet"));
const TimeoutPromise_1 = __importDefault(require("./TimeoutPromise"));
/**
 * A UDP socket class for reading and writing data to a remote socket.
 * @class
 */
class UDPSocket {
    /**
     * Creates a new UDP socket class from the host and port.
     * @param {string} host The host of the server
     * @param {number} port The port of the server
     * @param {number} timeout The timeout in milliseconds
     * @constructor
     */
    constructor(host, port, timeout) {
        this.host = host;
        this.port = port;
        this.timeout = timeout;
        this.socket = dgram_1.default.createSocket('udp4');
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
    readPacket() {
        var _a;
        if (this.buffer.length > 0) {
            const packet = new Packet_1.default();
            if (this.buffer.length > 0) {
                const value = this.buffer.shift();
                packet.buffer = (_a = value === null || value === void 0 ? void 0 : value.message) !== null && _a !== void 0 ? _a : Buffer.alloc(0);
            }
            return Promise.resolve(packet);
        }
        const timeoutPromise = new TimeoutPromise_1.default(this.timeout, new Error('Timed out while waiting for server response'));
        const actualPromise = new Promise((resolve, reject) => {
            let read = false;
            const cleanupHandlers = () => {
                this.socket.removeListener('message', messageHandler);
                this.socket.removeListener('error', errorHandler);
                this.socket.removeListener('close', closeHandler);
            };
            const messageHandler = () => {
                var _a;
                if (read)
                    return;
                if (this.buffer.length > 0) {
                    read = true;
                    cleanupHandlers();
                    const packet = new Packet_1.default();
                    if (this.buffer.length > 0) {
                        const value = this.buffer.shift();
                        packet.buffer = (_a = value === null || value === void 0 ? void 0 : value.message) !== null && _a !== void 0 ? _a : Buffer.alloc(0);
                    }
                    resolve(packet);
                }
            };
            const errorHandler = (error) => {
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
        return Promise.race([
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
    writePacket(packet) {
        return new Promise((resolve, reject) => {
            this.socket.send(Buffer.from(packet.buffer), this.port, this.host, (error) => {
                if (error)
                    return reject(error);
                resolve();
            });
        });
    }
    /**
     * Closes the connection and cleans up data.
     * @returns {Promise<void>} A Promise that resolves when the client has closed
     * @async
     */
    destroy() {
        return new Promise((resolve) => {
            this.socket.removeAllListeners();
            this.socket.close(() => {
                resolve();
            });
        });
    }
}
exports.default = UDPSocket;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVURQU29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZS9VRFBTb2NrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxrREFBMEI7QUFDMUIsc0RBQThCO0FBQzlCLHNFQUE4QztBQUU5Qzs7O0dBR0c7QUFDSCxNQUFNLFNBQVM7SUFVZDs7Ozs7O09BTUc7SUFDSCxZQUFZLElBQVksRUFBRSxJQUFZLEVBQUUsT0FBZTtRQUN0RCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsTUFBTSxHQUFHLGVBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFO1lBQzNDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILFVBQVU7O1FBQ1QsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDM0IsTUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxFQUFFLENBQUM7WUFFNUIsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQzNCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBRWxDLE1BQU0sQ0FBQyxNQUFNLFNBQUcsS0FBSyxhQUFMLEtBQUssdUJBQUwsS0FB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