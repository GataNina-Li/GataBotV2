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
const Packet_1 = __importDefault(require("./structure/Packet"));
const resolveSRV_1 = __importDefault(require("./util/resolveSRV"));
const UDPSocket_1 = __importDefault(require("./structure/UDPSocket"));
const parseDescription_1 = __importDefault(require("./util/parseDescription"));
const ipAddressRegEx = /^\d{1,3}(\.\d{1,3}){3}$/;
let sessionCounter = 0;
function applyDefaultOptions(options) {
    // Apply the provided options on the default options
    return Object.assign({
        port: 25565,
        timeout: 1000 * 5,
        enableSRV: true,
        sessionID: ++sessionCounter
    }, options);
}
/**
 * Performs a basic query on the server using the UDP protocol.
 * @param {string} host The host of the server
 * @param {QueryOptions} [options] The options to use when performing the query
 * @returns {Promise<BasicQueryResponse>} The basic query response data
 * @async
 */
function query(host, options) {
    var _a;
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
        assert_1.default(typeof opts.timeout === 'number', `Expected 'options.timeout' to be a number, got ${typeof opts.timeout}`);
        assert_1.default(opts.timeout > 0, `Expected 'options.timeout' to be greater than 0, got ${opts.timeout}`);
        assert_1.default(typeof opts.sessionID === 'number', `Expected 'options.sessionID' to be a number, got ${typeof opts.sessionID}`);
        assert_1.default(opts.sessionID > 0, `Expected 'options.sessionID' to be greater than 0, got ${opts.sessionID}`);
        assert_1.default(opts.sessionID < 0xFFFFFFFF, `Expected 'options.sessionID' to be less than ${0xFFFFFFFF}, got ${opts.sessionID}`);
        assert_1.default(Number.isInteger(opts.sessionID), `Expected 'options.sessionID' to be an integer, got ${opts.sessionID}`);
        assert_1.default(typeof opts.enableSRV === 'boolean', `Expected 'options.enableSRV' to be a boolean, got ${typeof opts.enableSRV}`);
        // Only the last 4 bits of each byte is used when sending a session ID
        opts.sessionID &= 0x0F0F0F0F;
        let challengeToken;
        let srvRecord = null;
        // Automatically resolve from host (e.g. play.hypixel.net) into a connect-able address
        if (opts.enableSRV && !ipAddressRegEx.test(host)) {
            srvRecord = yield resolveSRV_1.default(host);
        }
        const startTime = Date.now();
        // Create a new UDP connection to the specified address
        const socket = new UDPSocket_1.default((_a = srvRecord === null || srvRecord === void 0 ? void 0 : srvRecord.host) !== null && _a !== void 0 ? _a : host, opts.port);
        try {
            {
                // Create a Handshake packet and send it to the server
                // https://wiki.vg/Query#Request
                const requestPacket = new Packet_1.default();
                requestPacket.writeByte(0xFE, 0xFD, 0x09);
                requestPacket.writeIntBE(opts.sessionID);
                yield socket.writePacket(requestPacket);
            }
            {
                // Read the response packet for the Handshake from the server
                // https://wiki.vg/Query#Response
                const responsePacket = yield socket.readPacket();
                const type = responsePacket.readByte();
                const sessionID = responsePacket.readIntBE();
                challengeToken = parseInt(responsePacket.readStringNT());
                if (type !== 0x09)
                    throw new Error('Server sent an invalid payload type');
                if (sessionID !== opts.sessionID)
                    throw new Error('Session ID in response did not match client session ID');
                if (isNaN(challengeToken))
                    throw new Error('Server sent an invalid challenge token');
            }
            {
                // Create a Basic Stat Request packet and send it to the server
                // https://wiki.vg/Query#Request_2
                const requestPacket = new Packet_1.default();
                requestPacket.writeByte(0xFE, 0xFD, 0x00);
                requestPacket.writeIntBE(opts.sessionID);
                requestPacket.writeIntBE(challengeToken);
                yield socket.writePacket(requestPacket);
            }
            let motd, gameType, levelName, onlinePlayers, maxPlayers;
            {
                // Read the response packet for the Basic stat from the server
                const responsePacket = yield socket.readPacket();
                const type = responsePacket.readByte();
                const sessionID = responsePacket.readIntBE();
                motd = responsePacket.readStringNT();
                gameType = responsePacket.readStringNT();
                levelName = responsePacket.readStringNT();
                const onlinePlayersStr = responsePacket.readStringNT();
                const maxPlayersStr = responsePacket.readStringNT();
                if (type !== 0x00)
                    throw new Error('Server sent an invalid payload type');
                if (sessionID !== opts.sessionID)
                    throw new Error('Session ID in response did not match client session ID');
                onlinePlayers = parseInt(onlinePlayersStr);
                if (isNaN(onlinePlayers))
                    throw new Error('Server sent an invalid player count');
                maxPlayers = parseInt(maxPlayersStr);
                if (isNaN(maxPlayers))
                    throw new Error('Server sent an invalid max player count');
            }
            return {
                host,
                port: opts.port,
                srvRecord,
                gameType,
                levelName,
                onlinePlayers,
                maxPlayers,
                description: parseDescription_1.default(motd),
                roundTripLatency: Date.now() - startTime
            };
        }
        finally {
            // Destroy the socket, it is no longer needed
            yield socket.destroy();
        }
    });
}
exports.default = query;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSxvREFBNEI7QUFDNUIsZ0VBQXdDO0FBQ3hDLG1FQUEwRDtBQUUxRCxzRUFBOEM7QUFDOUMsK0VBQXVEO0FBR3ZELE1BQU0sY0FBYyxHQUFHLHlCQUF5QixDQUFDO0FBQ2pELElBQUksY0FBYyxHQUFHLENBQUMsQ0FBQztBQUV2QixTQUFTLG1CQUFtQixDQUFDLE9BQXNCO0lBQ2xELG9EQUFvRDtJQUNwRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDcEIsSUFBSSxFQUFFLEtBQUs7UUFDWCxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUM7UUFDakIsU0FBUyxFQUFFLElBQUk7UUFDZixTQUFTLEVBQUUsRUFBRSxjQUFjO0tBQ0QsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBRUQ7Ozs7OztHQU1HO0FBQ0gsU0FBOEIsS0FBSyxDQUFDLElBQVksRUFBRSxPQUFzQjs7O1FBQ3ZFLDZEQUE2RDtRQUM3RCxNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxQyw0REFBNEQ7UUFDNUQsZ0JBQU0sQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUUsdUNBQXVDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN2RixnQkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLHdEQUF3RCxDQUFDLENBQUM7UUFDbEYsZ0JBQU0sQ0FBQyxPQUFPLE9BQU8sS0FBSyxRQUFRLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxFQUFFLHdEQUF3RCxPQUFPLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDaEosZ0JBQU0sQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUUsMkNBQTJDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMzRixnQkFBTSxD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