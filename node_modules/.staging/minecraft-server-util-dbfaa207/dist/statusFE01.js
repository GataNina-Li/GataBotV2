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
const util_1 = require("util");
const Packet_1 = __importDefault(require("./structure/Packet"));
const TCPSocket_1 = __importDefault(require("./structure/TCPSocket"));
const formatResultFE01FA_1 = __importDefault(require("./util/formatResultFE01FA"));
const resolveSRV_1 = __importDefault(require("./util/resolveSRV"));
const ipAddressRegEx = /^\d{1,3}(\.\d{1,3}){3}$/;
const decoder = new util_1.TextDecoder('utf-16be');
function applyDefaultOptions(options) {
    // Apply the provided options on the default options
    return Object.assign({
        port: 25565,
        protocolVersion: 47,
        timeout: 1000 * 5,
        enableSRV: true
    }, options);
}
/**
 * Retrieves the status of the server using the 1.4.2 - 1.5.2 format.
 * @param {string} host The host of the server
 * @param {StatusOptions} [options] The options to use when retrieving the status
 * @returns {Promise<StatusResponse>} The status information of the server
 * @async
 */
function statusFE01(host, options) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        // Applies the provided options on top of the default options
        const opts = applyDefaultOptions(options);
        // Assert that the arguments are the correct type and format
        assert_1.default(typeof host === 'string', `Expected 'host' to be a string, got ${typeof host}`);
        assert_1.default(host.length > 0, 'Expected \'host\' to have content, got an empty string');
        assert_1.default(typeof options === 'object' || typeof options === 'undefined', `Expected 'options' to be an object or undefined, got ${typeof options}`);
        assert_1.default(typeof opts === 'object', `Expected 'options' to be an object, got ${typeof opts}`);
        assert_1.default(typeof opts.port === 'number', `Expected 'options.port' to be a number, got ${typeof opts.port}`);
        assert_1.default(opts.port > 0, `Expected 'options.port' to be greater than 0, got ${opts.port}`);
        assert_1.default(opts.port < 65536, `Expected 'options.port' to be less than 65536, got ${opts.port}`);
        assert_1.default(Number.isInteger(opts.port), `Expected 'options.port' to be an integer, got ${opts.port}`);
        assert_1.default(typeof opts.protocolVersion === 'number', `Expected 'options.protocolVersion' to be a number, got ${typeof opts.protocolVersion}`);
        assert_1.default(opts.protocolVersion >= 0, `Expected 'options.protocolVersion' to be greater than or equal to 0, got ${opts.protocolVersion}`);
        assert_1.default(Number.isInteger(opts.protocolVersion), `Expected 'options.protocolVersion' to be an integer, got ${opts.protocolVersion}`);
        assert_1.default(typeof opts.timeout === 'number', `Expected 'options.timeout' to be a number, got ${typeof opts.timeout}`);
        assert_1.default(opts.timeout > 0, `Expected 'options.timeout' to be greater than 0, got ${opts.timeout}`);
        assert_1.default(typeof opts.enableSRV === 'boolean', `Expected 'options.enableSRV' to be a boolean, got ${typeof opts.enableSRV}`);
        let srvRecord = null;
        // Automatically resolve from host (e.g. play.hypixel.net) into a connect-able address
        if (opts.enableSRV && !ipAddressRegEx.test(host)) {
            srvRecord = yield resolveSRV_1.default(host);
        }
        const startTime = Date.now();
        // Create a new TCP connection to the specified address
        const socket = yield TCPSocket_1.default.connect((_a = srvRecord === null || srvRecord === void 0 ? void 0 : srvRecord.host) !== null && _a !== void 0 ? _a : host, (_b = srvRecord === null || srvRecord === void 0 ? void 0 : srvRecord.port) !== null && _b !== void 0 ? _b : opts.port, opts.timeout);
        try {
            // Create the necessary packets and send them to the server
            {
                // https://wiki.vg/Server_List_Ping#1.4_to_1.5
                const packet = new Packet_1.default();
                packet.writeByte(0xFE, 0x01);
                socket.writePacket(packet, false);
            }
            let protocolVersion = 0;
            let serverVersion = '';
            let motd = '';
            let playerCount = 0;
            let maxPlayers = 0;
            {
                const packetType = yield socket.readByte();
                // Packet was unexpected type, ignore the rest of the data in this packet
                if (packetType !== 0xFF)
                    throw new Error('Packet returned from server was unexpected type');
                // Read the length of the data string
                const length = yield socket.readShort();
                // Read all of the data string and convert to a UTF-8 string
                const data = decoder.decode((yield socket.readBytes(length * 2)).slice(6));
                const [protocolVersionStr, serverVersionStr, motdStr, playerCountStr, maxPlayersStr] = data.split('\0');
                protocolVersion = parseInt(protocolVersionStr);
                serverVersion = serverVersionStr;
                motd = motdStr;
                playerCount = parseInt(playerCountStr);
                maxPlayers = parseInt(maxPlayersStr);
                if (isNaN(protocolVersion))
                    throw new Error('Server returned an invalid protocol version: ' + protocolVersionStr);
                if (isNaN(playerCount))
                    throw new Error('Server returned an invalid player count: ' + playerCountStr);
                if (isNaN(maxPlayers))
                    throw new Error('Server returned an invalid max player count: ' + maxPlayersStr);
            }
            // Convert the data from raw Minecraft status payload format into a more human readable format and resolve the promise
            return formatResultFE01FA_1.default(host, opts.port, srvRecord, protocolVersion, serverVersion, motd, playerCount, maxPlayers, Date.now() - startTime);
        }
        finally {
            // Destroy the socket, it is no longer needed
            yield socket.destroy();
        }
    });
}
exports.default = statusFE01;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzRkUwMS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdGF0dXNGRTAxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLCtCQUFtQztBQUNuQyxnRUFBd0M7QUFDeEMsc0VBQThDO0FBQzlDLG1GQUEyRDtBQUMzRCxtRUFBMEQ7QUFJMUQsTUFBTSxjQUFjLEdBQUcseUJBQXlCLENBQUM7QUFDakQsTUFBTSxPQUFPLEdBQUcsSUFBSSxrQkFBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBRTVDLFNBQVMsbUJBQW1CLENBQUMsT0FBdUI7SUFDbkQsb0RBQW9EO0lBQ3BELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUNwQixJQUFJLEVBQUUsS0FBSztRQUNYLGVBQWUsRUFBRSxFQUFFO1FBQ25CLE9BQU8sRUFBRSxJQUFJLEdBQUcsQ0FBQztRQUNqQixTQUFTLEVBQUUsSUFBSTtLQUNZLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDeEMsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQThCLFVBQVUsQ0FBQyxJQUFZLEVBQUUsT0FBdUI7OztRQUM3RSw2REFBNkQ7UUFDN0QsTUFBTSxJQUFJLEdBQUcsbUJBQW1CLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFMUMsNERBQTREO1FBQzVELGdCQUFNLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFLHVDQUF1QyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7UUFDdkYsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSx3REFBd0QsQ0FBQyxDQUFDO1FBQ2xGLGdCQUFNLENBQUMsT0FBTyxPQUFPLEtBQUssUUFBUSxJQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsRUFBRSx3REFBd0QsT0FBTyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQ2hKLGdCQUFNLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFLDJDQUEy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