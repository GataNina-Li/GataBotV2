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
const formatResultFE_1 = __importDefault(require("./util/formatResultFE"));
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
 * Retrieves the status of the server using the Beta 1.8 - 1.3.2 format.
 * @param {string} host The host of the server
 * @param {StatusOptions} [options] The options to use when retrieving the status
 * @returns {Promise<StatusResponse>} The status information of the server
 * @async
 */
function statusFE(host, options) {
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
            // https://wiki.vg/Server_List_Ping#Beta_1.8_to_1.3
            const packet = new Packet_1.default();
            packet.writeByte(0xFE);
            socket.writePacket(packet, false);
            let motd = '';
            let playerCount = 0;
            let maxPlayers = 0;
            const packetType = yield socket.readByte();
            // Packet was unexpected type, ignore the rest of the data in this packet
            if (packetType !== 0xFF)
                throw new Error('Packet returned from server was unexpected type');
            // Read the length of the data string
            const length = yield socket.readShort();
            // Read all of the data string and convert to a UTF-8 string
            const data = decoder.decode(yield socket.readBytes(length * 2));
            const [motdStr, playerCountStr, maxPlayersStr] = data.split('§');
            motd = motdStr;
            playerCount = parseInt(playerCountStr);
            maxPlayers = parseInt(maxPlayersStr);
            if (isNaN(playerCount))
                throw new Error('Server returned an invalid player count: ' + playerCountStr);
            if (isNaN(maxPlayers))
                throw new Error('Server returned an invalid max player count: ' + maxPlayersStr);
            // Convert the data from raw Minecraft status payload format into a more human readable format and resolve the promise
            return formatResultFE_1.default(host, opts.port, srvRecord, motd, playerCount, maxPlayers, Date.now() - startTime);
        }
        finally {
            // Destroy the socket, it is no longer needed
            yield socket.destroy();
        }
    });
}
exports.default = statusFE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzRkUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvc3RhdHVzRkUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsK0JBQW1DO0FBQ25DLGdFQUF3QztBQUN4QyxzRUFBOEM7QUFDOUMsMkVBQW1EO0FBQ25ELG1FQUEwRDtBQUkxRCxNQUFNLGNBQWMsR0FBRyx5QkFBeUIsQ0FBQztBQUNqRCxNQUFNLE9BQU8sR0FBRyxJQUFJLGtCQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7QUFFNUMsU0FBUyxtQkFBbUIsQ0FBQyxPQUF1QjtJQUNuRCxvREFBb0Q7SUFDcEQsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBQ3BCLElBQUksRUFBRSxLQUFLO1FBQ1gsZUFBZSxFQUFFLEVBQUU7UUFDbkIsT0FBTyxFQUFFLElBQUksR0FBRyxDQUFDO1FBQ2pCLFNBQVMsRUFBRSxJQUFJO0tBQ1ksRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN4QyxDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBOEIsUUFBUSxDQUFDLElBQVksRUFBRSxPQUF1Qjs7O1FBQzNFLDZEQUE2RDtRQUM3RCxNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxQyw0REFBNEQ7UUFDNUQsZ0JBQU0sQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUUsdUNBQXVDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN2RixnQkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLHdEQUF3RCxDQUFDLENBQUM7UUFDbEYsZ0JBQU0sQ0FBQyxPQUFPLE9BQU8sS0FBSyxRQUFRLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxFQUFFLHdEQUF3RCxPQUFPLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDaEosZ0JBQU0sQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUUsMkNBQTJDLE9B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