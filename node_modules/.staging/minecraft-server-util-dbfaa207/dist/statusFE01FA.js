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
 * Retrieves the status of the server using the 1.6.1 - 1.6.4 format.
 * @param {string} host The host of the server
 * @param {StatusOptions} [options] The options to use when retrieving the status
 * @returns {Promise<StatusResponse>} The status information of the server
 * @async
 */
function statusFE01FA(host, options) {
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
                // https://wiki.vg/Server_List_Ping#Client_to_server
                const packet = new Packet_1.default();
                packet.writeByte(0xFE, 0x01, 0xFA, 0x00, 0x0B, 0x00, 0x4D, 0x00, 0x43, 0x00, 0x7C, 0x00, 0x50, 0x00, 0x69, 0x00, 0x6E, 0x00, 0x67, 0x00, 0x48, 0x00, 0x6F, 0x00, 0x73, 0x00, 0x74);
                packet.writeShortBE(7 + host.length);
                packet.writeByte(opts.protocolVersion);
                packet.writeShortBE(host.length);
                packet.writeString(host, false);
                packet.writeIntBE(opts.port);
                yield socket.writePacket(packet, false);
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
                    throw new Error('Packet returned from server was unexpected type: 0x' + packetType.toString(16).toUpperCase());
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
exports.default = statusFE01FA;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzRkUwMUZBLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3N0YXR1c0ZFMDFGQS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBLG9EQUE0QjtBQUM1QiwrQkFBbUM7QUFDbkMsZ0VBQXdDO0FBQ3hDLHNFQUE4QztBQUM5QyxtRkFBMkQ7QUFDM0QsbUVBQTBEO0FBSTFELE1BQU0sY0FBYyxHQUFHLHlCQUF5QixDQUFDO0FBQ2pELE1BQU0sT0FBTyxHQUFHLElBQUksa0JBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUU1QyxTQUFTLG1CQUFtQixDQUFDLE9BQXVCO0lBQ25ELG9EQUFvRDtJQUNwRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDcEIsSUFBSSxFQUFFLEtBQUs7UUFDWCxlQUFlLEVBQUUsRUFBRTtRQUNuQixPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUM7UUFDakIsU0FBUyxFQUFFLElBQUk7S0FDWSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hDLENBQUM7QUFFRDs7Ozs7O0dBTUc7QUFDSCxTQUE4QixZQUFZLENBQUMsSUFBWSxFQUFFLE9BQXVCOzs7UUFDL0UsNkRBQTZEO1FBQzdELE1BQU0sSUFBSSxHQUFHLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBRTFDLDREQUE0RDtRQUM1RCxnQkFBTSxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRSx1Q0FBdUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZGLGdCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsd0RBQXdELENBQUMsQ0FBQztRQUNsRixnQkFBTSxDQUFDLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLEVBQUUsd0RBQXdELE9BQU8sT0FBTyxFQUFFLENBQUMsQ0FBQztRQUNoSixnQkFBTSxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRSwy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