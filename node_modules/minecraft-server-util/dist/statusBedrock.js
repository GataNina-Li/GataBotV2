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
const crypto_1 = __importDefault(require("crypto"));
const util_1 = require("util");
const Packet_1 = __importDefault(require("./structure/Packet"));
const UDPSocket_1 = __importDefault(require("./structure/UDPSocket"));
const parseDescription_1 = __importDefault(require("./util/parseDescription"));
const magic = [0x00, 0xFF, 0xFF, 0x00, 0xFE, 0xFE, 0xFE, 0xFE, 0xFD, 0xFD, 0xFD, 0xFD, 0x12, 0x34, 0x56, 0x78];
function applyDefaultOptions(options) {
    // Apply the provided options on the default options
    return Object.assign({
        port: 19132,
        timeout: 1000 * 5,
        clientGUID: crypto_1.default.randomBytes(4).readUInt32BE()
    }, options);
}
/**
 * Retrieves the status of the Bedrock edition server
 * @param {string} host The host of the server
 * @param {BedrockStatusOptions} [options] The options to use when retrieving the status
 * @returns {Promise<BedrockStatusResponse>} The status information of the server
 * @async
 */
function statusBedrock(host, options) {
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
        assert_1.default(typeof opts.clientGUID === 'number', `Expected 'options.clientGUID' to be a number, got ${typeof opts.clientGUID}`);
        const startTime = Date.now();
        // Create a new UDP connection to the specified address
        const socket = new UDPSocket_1.default(host, opts.port);
        try {
            // https://wiki.vg/Raknet_Protocol#Unconnected_Ping
            const pingPacket = new Packet_1.default();
            pingPacket.writeByte(0x01); // Packet ID
            pingPacket.writeLongBE(BigInt(Date.now())); // Time
            pingPacket.writeByte(...magic); // Magic
            pingPacket.writeLongBE(BigInt(opts.clientGUID)); // Client GUID
            yield socket.writePacket(pingPacket);
            // https://wiki.vg/Raknet_Protocol#Unconnected_Pong
            const pongPacket = yield socket.readPacket();
            // Begin reading the data out of the packet
            const packetType = pongPacket.readByte(); // Packet type
            // Packet was unexpected type, ignore the rest of the data in this packet
            if (packetType !== 0x1C)
                throw new Error('Server sent an invalid packet type');
            // Finish reading the data out of the packet
            pongPacket.readLongBE(); // Time
            const serverGUID = pongPacket.readLongBE(); // Server GUID
            pongPacket.readBytes(16); // Magic
            const serverIDBytes = pongPacket.readBytes(pongPacket.readUShortBE()); // Server ID
            // Property decode the server ID bytes into a response string
            const response = new util_1.TextDecoder().decode(Uint8Array.from(serverIDBytes));
            // Split the response string into multiple tokens, where each is a status item
            const splitResponse = response.split(';');
            // Grab each element out of the split response string, they may be missing which we'll fix later in the code
            const [edition, motdLine1, protocolVersion, version, onlinePlayers, maxPlayers, serverID, motdLine2, gameMode, gameModeID, portIPv4, portIPv6] = splitResponse;
            return {
                host,
                port: opts.port,
                edition: edition && edition.length > 0 ? edition : null,
                serverGUID,
                motdLine1: motdLine1 && motdLine1.length > 0 ? parseDescription_1.default(motdLine1) : null,
                motdLine2: motdLine2 && motdLine1.length > 0 ? parseDescription_1.default(motdLine2) : null,
                version: version && version.length > 0 ? version : null,
                protocolVersion: isNaN(parseInt(protocolVersion)) ? null : parseInt(protocolVersion),
                maxPlayers: isNaN(parseInt(maxPlayers)) ? null : parseInt(maxPlayers),
                onlinePlayers: isNaN(parseInt(onlinePlayers)) ? null : parseInt(onlinePlayers),
                serverID: serverID && serverID.length > 0 ? serverID : null,
                gameMode: gameMode && gameMode.length > 0 ? gameMode : null,
                gameModeID: isNaN(parseInt(gameModeID)) ? null : parseInt(gameModeID),
                portIPv4: isNaN(parseInt(portIPv4)) ? null : parseInt(portIPv4),
                portIPv6: isNaN(parseInt(portIPv6)) ? null : parseInt(portIPv6),
                roundTripLatency: Date.now() - startTime
            };
        }
        finally {
            // Destroy the socket, it is no longer needed
            yield socket.destroy();
        }
    });
}
exports.default = statusBedrock;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdHVzQmVkcm9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zdGF0dXNCZWRyb2NrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLG9EQUE0QjtBQUM1QiwrQkFBbUM7QUFDbkMsZ0VBQXdDO0FBQ3hDLHNFQUE4QztBQUc5QywrRUFBdUQ7QUFFdkQsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztBQUUvRyxTQUFTLG1CQUFtQixDQUFDLE9BQThCO0lBQzFELG9EQUFvRDtJQUNwRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDcEIsSUFBSSxFQUFFLEtBQUs7UUFDWCxPQUFPLEVBQUUsSUFBSSxHQUFHLENBQUM7UUFDakIsVUFBVSxFQUFFLGdCQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRTtLQUNkLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDL0MsQ0FBQztBQUVEOzs7Ozs7R0FNRztBQUNILFNBQThCLGFBQWEsQ0FBQyxJQUFZLEVBQUUsT0FBOEI7O1FBQ3ZGLDZEQUE2RDtRQUM3RCxNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxQyw0REFBNEQ7UUFDNUQsZ0JBQU0sQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUUsdUNBQXVDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN2RixnQkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLHdEQUF3RCxDQUFDLENBQUM7UUFDbEYsZ0JBQU0sQ0FB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