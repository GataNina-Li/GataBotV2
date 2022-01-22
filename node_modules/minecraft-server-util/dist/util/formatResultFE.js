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
 * @param {string} motd The MOTD of the server
 * @param {number} onlinePlayers The amount of online players
 * @param {number} maxPlayers The maximum amount of players
 * @returns {StatusResponse} The formatted result
 */
function formatResultFE(host, port, srvRecord, motd, onlinePlayers, maxPlayers, roundTripLatency) {
    assert_1.default(typeof host === 'string', 'Expected host to be a string, got ' + typeof host);
    assert_1.default(host.length > 0, 'Expected host.length > 0, got ' + host.length);
    assert_1.default(typeof port === 'number', 'Expected port to be a number, got ' + typeof port);
    assert_1.default(Number.isInteger(port), 'Expected port to be an integer, got ' + port);
    assert_1.default(port > 0, 'Expected port > 0, got ' + port);
    assert_1.default(port < 65536, 'Expected port < 65536, got ' + port);
    assert_1.default(typeof onlinePlayers === 'number', 'Expected onlinePlayers to be a number, got ' + typeof onlinePlayers);
    assert_1.default(Number.isInteger(onlinePlayers), 'Expected onlinePlayers to be an integer, got ' + onlinePlayers);
    assert_1.default(typeof maxPlayers === 'number', 'Expected maxPlayers to be a number, got ' + typeof maxPlayers);
    assert_1.default(Number.isInteger(maxPlayers), 'Expected maxPlayers to be an integer, got ' + maxPlayers);
    assert_1.default(typeof roundTripLatency === 'number', 'Expected roundTripLatency to be a number, got ' + typeof roundTripLatency);
    assert_1.default(Number.isInteger(roundTripLatency), 'Expected roundTripLatency to be an integer, got ' + roundTripLatency);
    assert_1.default(roundTripLatency >= 0, 'Expected roundTripLatency >= 0, got ' + port);
    const description = parseDescription_1.default(motd);
    return {
        host,
        port,
        srvRecord,
        version: null,
        protocolVersion: null,
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
exports.default = formatResultFE;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0UmVzdWx0RkUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbC9mb3JtYXRSZXN1bHRGRS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLG9EQUE0QjtBQUM1QiwwRUFBa0Q7QUFJbEQ7Ozs7Ozs7OztHQVNHO0FBQ0gsU0FBUyxjQUFjLENBQUMsSUFBWSxFQUFFLElBQVksRUFBRSxTQUEyQixFQUFFLElBQVksRUFBRSxhQUFxQixFQUFFLFVBQWtCLEVBQUUsZ0JBQXdCO0lBQ2pLLGdCQUFNLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFLG9DQUFvQyxHQUFHLE9BQU8sSUFBSSxDQUFDLENBQUM7SUFDckYsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxnQ0FBZ0MsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEUsZ0JBQU0sQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUUsb0NBQW9DLEdBQUcsT0FBTyxJQUFJLENBQUMsQ0FBQztJQUNyRixnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsc0NBQXNDLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDOUUsZ0JBQU0sQ0FBQyxJQUFJLEdBQUcsQ0FBQyxFQUFFLHlCQUF5QixHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ25ELGdCQUFNLENBQUMsSUFBSSxHQUFHLEtBQUssRUFBRSw2QkFBNkIsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUMzRCxnQkFBTSxDQUFDLE9BQU8sYUFBYSxLQUFLLFFBQVEsRUFBRSw2Q0FBNkMsR0FBRyxPQUFPLGFBQWEsQ0FBQyxDQUFDO0lBQ2hILGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsRUFBRSwrQ0FBK0MsR0FBRyxhQUFhLENBQUMsQ0FBQztJQUN6RyxnQkFBTSxDQUFDLE9BQU8sVUFBVSxLQUFLLFFBQVEsRUFBRSwwQ0FBMEMsR0FBRyxPQUFPLFVBQVUsQ0FBQyxDQUFDO0lBQ3ZHLGdCQUFNLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsRUFBRSw0Q0FBNEMsR0FBRyxVQUFVLENBQUMsQ0FBQztJQUNoRyxnQkFBTSxDQUFDLE9BQU8sZ0JBQWdCLEtBQUssUUFBUSxFQUFFLGdEQUFnRCxHQUFHLE9BQU8sZ0JBQWdCLENBQUMsQ0FBQztJQUN6SCxnQkFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsRUFBRSxrREFBa0QsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO0lBQ2xILGdCQUFNLENBQUMsZ0JBQWdCLElBQUksQ0FBQyxFQUFFLHNDQUFzQyxHQUFHLElBQUksQ0FBQyxDQUFDO0lBRTdFLE1BQU0sV0FBVyxHQUFHLDBCQUFnQixDQUFDLElBQUksQ0FBQyxDQUFDO0lBRTNDLE9BQU87UUFDTixJQUFJO1FBQ0osSUFBSTtRQUNKLFNBQVM7UUFDVCxPQUFPLEVBQUUsSUFBSTtRQUNiLGVBQWUsRUFBRSxJQUFJO1FBQ3JCLGFBQWE7UUFDYixVQUFVO1FBQ1YsYUFBYSxFQUFFLElBQUk7UUFDbkIsV0FBVztRQUNYLE9BQU8sRUFBRSxJQUFJO1FBQ2IsT0FBTyxFQUFFLElBQUk7UUFDYixXQUFXLEVBQUUsSUFBSTtRQUNqQixnQkFBZ0I7S0FDaEIsQ0FBQztBQUNILENBQUM7QUFFRCxrQkFBZSxjQUFjLENBQUMifQ==