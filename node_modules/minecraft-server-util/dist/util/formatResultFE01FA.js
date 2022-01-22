"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = __importDefault(require("assert"));
const parseDescription_1 = __importDefault(require("./parseDescription"));
/**
 * Formats the raw response from a status request into a more useable format
 * @param {string} host The host of the server
 * @param {number} port The port of the server
 * @param {SRVRecord | null} srvRecord The SRV lookup data
 * @param {number} protocolVersion The protocol version returned from the server
 * @param {string} version The version string of the server
 * @param {string} motd The MOTD of the server
 * @param {number} onlinePlayers The amount of players in the server
 * @param {number} maxPlayers The maximum amount of players in the server
 * @returns {StatusResponse} The formatted result
 */
function formatResultFE01FA(host, port, srvRecord, protocolVersion, version, motd, onlinePlayers, maxPlayers, roundTripLatency) {
    assert_1.default(typeof host === 'string', 'Expected host to be a string, got ' + typeof host);
    assert_1.default(host.length > 0, 'Expected host.length > 0, got ' + host.length);
    assert_1.default(typeof port === 'number', 'Expected port to be a number, got ' + typeof port);
    assert_1.default(Number.isInteger(port), 'Expected port to be an integer, got ' + port);
    assert_1.default(port > 0, 'Expected port > 0, got ' + port);
    assert_1.default(port < 65536, 'Expected port < 65536, got ' + port);
    assert_1.default(typeof protocolVersion === 'number', 'Expected protocolVersion to be a number, got ' + typeof protocolVersion);
    assert_1.default(Number.isInteger(protocolVersion), 'Expected protocolVersion to be an integer, got ' + protocolVersion);
    assert_1.default(protocolVersion >= 0, 'Expected protocolVersion >= 0, got ' + protocolVersion);
    assert_1.default(typeof version === 'string', 'Expected version to be a string, got ' + typeof version);
    assert_1.default(version.length > 0, 'Expected version.length > 0, got ' + version.length);
    assert_1.default(typeof onlinePlayers === 'number', 'Expected onlinePlayers to be a number, got ' + typeof onlinePlayers);
    assert_1.default(Number.isInteger(onlinePlayers), 'Expected onlinePlayers to be an integer, got ' + onlinePlayers);
    assert_1.default(typeof maxPlayers === 'number', 'Expected maxPlayers to be a number, got ' + typeof maxPlayers);
    assert_1.default(Number.isInteger(maxPlayers), 'Expected maxPlayers to be an integer, got ' + maxPlayers);
    const description = parseDescription_1.default(motd);
    return {
        host,
        port,
        srvRecord,
        version,
        protocolVersion,
        onlinePlayers,
        maxPlayers,
        samplePlayers: null,
        description,
        favicon: null,
        modInfo: null,
        rawResponse: null,
        roundTripLatency
    };
}
exports.default = formatResultFE01FA;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0UmVzdWx0RkUwMUZBLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvZm9ybWF0UmVzdWx0RkUwMUZBLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLDBFQUFrRDtBQUlsRDs7Ozs7Ozs7Ozs7R0FXRztBQUNILFNBQVMsa0JBQWtCLENBQUMsSUFBWSxFQUFFLElBQVksRUFBRSxTQUEyQixFQUFFLGVBQXVCLEVBQUUsT0FBZSxFQUFFLElBQVksRUFBRSxhQUFxQixFQUFFLFVBQWtCLEVBQUUsZ0JBQXdCO0lBQy9NLGdCQUFNLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFLG9DQUFvQyxHQUFHLE9BQU8sSUFBSSxDQUFDLENBQUM7SUFDckYsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxnQ0FBZ0MsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEUsZ0JBQU0sQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUUsb0NBQW9DLEdBQUcsT0FBTyxJQUFJLENBQUMsQ0FBQztJQUNyRixnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsc0NBQXNDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDOUUsZ0JBQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLHlCQUF5QixHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ25ELGdCQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssRUFBRSw2QkFBNkIsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUMzRCxnQkFBTSxDQUFDLE9BQU8sZUFBZSxLQUFLLFFBQVEsRUFBRSwrQ0FBK0MsR0FBRyxPQUFPLGVBQWUsQ0FBQyxDQUFDO0lBQ3RILGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxlQUFlLENBQUMsRUFBRSxpREFBaUQsR0FBRyxlQUFlLENBQUMsQ0FBQztJQUMvRyxnQkFBTSxDQUFDLGVBQWUsSUFBSSxDQUFDLEVBQUUscUNBQXFDLEdBQUcsZUFBZSxDQUFDLENBQUM7SUFDdEYsZ0JBQU0sQ0FBQyxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUUsdUNBQXVDLEdBQUcsT0FBTyxPQUFPLENBQUMsQ0FBQztJQUM5RixnQkFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLG1DQUFtQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNqRixnQkFBTSxDQUFDLE9BQU8sYUFBYSxLQUFLLFFBQVEsRUFBRSw2Q0FBNkMsR0FBRyxPQUFPLGFBQWEsQ0FBQyxDQUFDO0lBQ2hILGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSwrQ0FBK0MsR0FBRyxhQUFhLENBQUMsQ0FBQztJQUN6RyxnQkFBTSxDQUFDLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRSwwQ0FBMEMsR0FBRyxPQUFPLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZHLGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSw0Q0FBNEMsR0FBRyxVQUFVLENBQUMsQ0FBQztJQUVoRyxNQUFNLFdBQVcsR0FBRywwQkFBZ0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUUzQyxPQUFPO1FBQ04sSUFBSTtRQUNKLElBQUk7UUFDSixTQUFTO1FBQ1QsT0FBTztRQUNQLGVBQWU7UUFDZixhQUFhO1FBQ2IsVUFBVTtRQUNWLGFBQWEsRUFBRSxJQUFJO1FBQ25CLFdBQVc7UUFDWCxPQUFPLEVBQUUsSUFBSTtRQUNiLE9BQU8sRUFBRSxJQUFJO1FBQ2IsV0FBVyxFQUFFLElBQUk7UUFDakIsZ0JBQWdCO0tBQ2hCLENBQUM7QUFDSCxDQUFDO0FBRUQsa0JBQWUsa0JBQWtCLENBQUMifQ==