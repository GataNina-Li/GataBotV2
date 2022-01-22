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
const events_1 = require("events");
const resolveSRV_1 = __importDefault(require("../util/resolveSRV"));
const TCPSocket_1 = __importDefault(require("./TCPSocket"));
const Packet_1 = __importDefault(require("./Packet"));
const util_1 = require("util");
const ipAddressRegEx = /^\d{1,3}(\.\d{1,3}){3}$/;
function applyDefaultOptions(options) {
    // Apply the provided options on the default options
    return Object.assign({
        port: 25575,
        password: '',
        timeout: 1000 * 15,
        enableSRV: true
    }, options);
}
/**
 * A utility class for executing commands remotely on a Minecraft server.
 * @class
 * @extends {EventEmitter}
 * @implements {RCONEvents}
 */
class RCON extends events_1.EventEmitter {
    /**
     * Creates a new RCON class with the host and options
     * @param {string} host The host of the server
     * @param {RCONOptions} [options] The options for the RCON client
     * @constructor
     */
    constructor(host, options) {
        super();
        this.socket = null;
        const opts = applyDefaultOptions(options);
        assert_1.default(typeof host === 'string', `Expected 'host' to be a string, got ${typeof host}`);
        assert_1.default(host.length > 0, `Expected host.length > 0, got ${host.length}`);
        assert_1.default(typeof opts.port === 'number', `Expected 'options.port' to be a number, got ${typeof opts.port}`);
        assert_1.default(opts.port > 0, `Expected 'options.port' to be greater than 0, got ${opts.port}`);
        assert_1.default(opts.port < 65536, `Expected 'options.port' to be less than 65536, got ${opts.port}`);
        assert_1.default(Number.isInteger(opts.port), `Expected 'options.port' to be an integer, got ${opts.port}`);
        assert_1.default(typeof opts.enableSRV === 'boolean', `Expected 'options.enableSRV' to be a boolean, got ${typeof opts.enableSRV}`);
        assert_1.default(typeof opts.timeout === 'number', `Expected 'options.timeout' to be a number, got ${typeof opts.timeout}`);
        assert_1.default(opts.timeout > 0, `Expected 'options.timeout' to be greater than 0, got ${opts.timeout}`);
        assert_1.default(Number.isInteger(opts.timeout), `Expected 'options.timeout' to be an integer, got ${opts.timeout}`);
        assert_1.default(typeof opts.password === 'string', `Expected 'options.password' to be a string, got ${typeof opts.password}`);
        assert_1.default(opts.password.length > 0, `Expected options.password.length > 0, got ${opts.password.length}`);
        this.host = host;
        this.isLoggedIn = false;
        this.options = opts;
        this.requestID = 0;
        this.decoder = new util_1.TextDecoder('utf-8');
    }
    /**
     * Connects to the server using TCP and sends the correct login packets.
     * @returns {Promise<void>} A Promise that resolves when it has successfully logged in
     * @async
     */
    connect() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let srvRecord = null;
            // Automatically resolve a connectable address from a known address using SRV DNS records
            if (this.options.enableSRV && !ipAddressRegEx.test(this.host)) {
                srvRecord = yield resolveSRV_1.default(this.host);
            }
            // Create a TCP connection to the server and wait for it to connect
            this.socket = yield TCPSocket_1.default.connect((_a = srvRecord === null || srvRecord === void 0 ? void 0 : srvRecord.host) !== null && _a !== void 0 ? _a : this.host, (_b = srvRecord === null || srvRecord === void 0 ? void 0 : srvRecord.port) !== null && _b !== void 0 ? _b : this.options.port, this.options.timeout);
            {
                // Create a login packet and send it to the server
                // https://wiki.vg/RCON#3:_Login
                const loginPacket = new Packet_1.default();
                loginPacket.writeIntLE(10 + this.options.password.length);
                loginPacket.writeIntLE(++this.requestID);
                loginPacket.writeIntLE(3);
                loginPacket.writeString(this.options.password, false);
                loginPacket.writeByte(0x00, 0x00);
                yield this.socket.writePacket(loginPacket, false);
            }
            {
                // Wait for the next packet back, determine if the login was successful
                const length = yield this.socket.readIntLE();
                const requestID = yield this.socket.readIntLE();
                yield this.socket.readIntLE();
                if (requestID === -1)
                    throw new Error('Failed to connect to RCON, invalid password');
                yield this.socket.readBytes(length - 8);
            }
            this.isLoggedIn = true;
            process.nextTick(() => __awaiter(this, void 0, void 0, function* () {
                while (this.socket !== null) {
                    yield this._readPacket();
                }
            }));
        });
    }
    /**
     * Waits for the next incoming packet from the stream and parses it.
     * @returns {Promise<void>}
     * @async
     * @private
     */
    _readPacket() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.socket === null)
                return;
            const length = yield this.socket.readIntLE();
            const requestID = yield this.socket.readIntLE();
            const packetType = yield this.socket.readIntLE();
            switch (packetType) {
                case 0: {
                    let output = '';
                    if (length > 10) {
                        output = this.decoder.decode(yield this.socket.readBytes(length - 10));
                    }
                    this.emit('output', output);
                    this.emit(`output_${requestID}`, output);
                    yield this.socket.readBytes(2);
                    break;
                }
                default: {
                    yield this.socket.readBytes(length - 8);
                    this.emit('warning', 'Received an unknown packet type: ' + packetType);
                    break;
                }
            }
        });
    }
    /**
     * Executes commands on the server after it has successfully logged in
     * @param {string} command The command to execute
     * @returns {Promise<void>} The Promise that resolves whenever the command has executed
     * @async
     */
    run(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.socket === null || this.socket.socket.connecting)
                throw new Error('Socket has not connected yet, please run RCON#connect()');
            if (!this.isLoggedIn)
                throw new Error('Client is not logged in or login was unsuccessful, please run RCON#connect()');
            const commandPacket = new Packet_1.default();
            commandPacket.writeIntLE(10 + command.length);
            commandPacket.writeIntLE(++this.requestID);
            commandPacket.writeIntLE(2);
            commandPacket.writeString(command, false);
            commandPacket.writeByte(0x00, 0x00);
            return this.socket.writePacket(commandPacket, false);
        });
    }
    /**
     * Executes commands on the server after it has successfully logged in and waits for the result of command execution
     * @param command The command to execute
     * @param timeout Maximum waiting time. Default: 5000
     * @returns
     */
    exec(command, timeout = 5000) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.socket === null || this.socket.socket.connecting)
                throw new Error('Socket has not connected yet, please run RCON#connect()');
            if (!this.isLoggedIn)
                throw new Error('Client is not logged in or login was unsuccessful, please run RCON#connect()');
            const requestID = ++this.requestID;
            const commandPacket = new Packet_1.default();
            commandPacket.writeIntLE(10 + command.length);
            commandPacket.writeIntLE(requestID);
            commandPacket.writeIntLE(2);
            commandPacket.writeString(command, false);
            commandPacket.writeByte(0x00, 0x00);
            yield this.socket.writePacket(commandPacket, false);
            return new Promise((resolve, reject) => {
                const EVT_KEY = `output_${requestID}`;
                let complete = false;
                const timer = setTimeout(() => {
                    if (!complete) {
                        complete = true;
                        this.off(EVT_KEY, onResponse);
                        reject(new Error('RCON exec timeout'));
                    }
                }, timeout);
                const onResponse = (output) => {
                    if (!complete) {
                        clearTimeout(timer);
                        complete = true;
                        return resolve(output);
                    }
                };
                this.once(EVT_KEY, onResponse);
            });
        });
    }
    /**
     * Closes the connection to the server
     * @returns {Promise<void>} A Promise that resolves when the connection has closed
     * @async
     */
    close() {
        if (this.socket === null)
            throw new Error('Socket is already closed');
        return this.socket.destroy();
    }
}
exports.default = RCON;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUkNPTi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9zdHJ1Y3R1cmUvUkNPTi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUE0QjtBQUM1QixtQ0FBc0M7QUFDdEMsb0VBQTJEO0FBQzNELDREQUFvQztBQUNwQyxzREFBOEI7QUFFOUIsK0JBQW1DO0FBRW5DLE1BQU0sY0FBYyxHQUFHLHlCQUF5QixDQUFDO0FBT2pELFNBQVMsbUJBQW1CLENBQUMsT0FBcUI7SUFDakQsb0RBQW9EO0lBQ3BELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNwQixJQUFJLEVBQUUsS0FBSztRQUNYLFFBQVEsRUFBRSxFQUFFO1FBQ1osT0FBTyxFQUFFLElBQUksR0FBRyxFQUFFO1FBQ2xCLFNBQVMsRUFBRSxJQUFJO0tBQ1UsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxNQUFNLElBQUssU0FBUSxxQkFBWTtJQVE5Qjs7Ozs7T0FLRztJQUNILFlBQVksSUFBWSxFQUFFLE9BQXFCO1FBQzlDLEtBQUssRUFBRSxDQUFDO1FBWEQsV0FBTSxHQUFxQixJQUFJLENBQUM7UUFhdkMsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFMUMsZ0JBQU0sQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUUsdUNBQXVDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN2RixnQkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLGlDQUFpQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN4RSxnQkFBTSxDQUFDLE9BQU8sSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUUsK0NBQStDLE9BQU8sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDekcsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFH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