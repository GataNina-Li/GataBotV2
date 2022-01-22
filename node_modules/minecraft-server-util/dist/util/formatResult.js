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
 * @param {RawStatusResponse} result The raw JSON data returned from the server
 * @returns {StatusResponse} The formatted result
 */
function formatResult(host, port, srvRecord, result, roundTripLatency) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    assert_1.default(typeof host === 'string', 'Expected host to be a string, got ' + typeof host);
    assert_1.default(host.length > 0, 'Expected host.length > 0, got ' + host.length);
    assert_1.default(typeof port === 'number', 'Expected port to be a number, got ' + typeof port);
    assert_1.default(Number.isInteger(port), 'Expected integer, got ' + port);
    assert_1.default(port > 0, 'Expected port > 0, got ' + port);
    assert_1.default(port < 65536, 'Expected port < 65536, got ' + port);
    assert_1.default(typeof result === 'object', 'Expected object, got ' + (typeof result));
    assert_1.default(typeof roundTripLatency === 'number', 'Expected roundTripLatency to be a number, got ' + typeof roundTripLatency);
    assert_1.default(Number.isInteger(roundTripLatency), 'Expected roundTripLatency to be an integer, got ' + roundTripLatency);
    assert_1.default(roundTripLatency >= 0, 'Expected roundTripLatency >= 0, got ' + roundTripLatency);
    const version = (_b = (_a = result === null || result === void 0 ? void 0 : result.version) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : null;
    const protocolVersion = (_d = (_c = result === null || result === void 0 ? void 0 : result.version) === null || _c === void 0 ? void 0 : _c.protocol) !== null && _d !== void 0 ? _d : null;
    const onlinePlayers = (_f = (_e = result === null || result === void 0 ? void 0 : result.players) === null || _e === void 0 ? void 0 : _e.online) !== null && _f !== void 0 ? _f : null;
    const maxPlayers = (_h = (_g = result === null || result === void 0 ? void 0 : result.players) === null || _g === void 0 ? void 0 : _g.max) !== null && _h !== void 0 ? _h : null;
    const samplePlayers = (_k = (_j = result === null || result === void 0 ? void 0 : result.players) === null || _j === void 0 ? void 0 : _j.sample) !== null && _k !== void 0 ? _k : null;
    const description = typeof result.description !== 'undefined' ? parseDescription_1.default(result.description) : null;
    const favicon = (_l = result === null || result === void 0 ? void 0 : result.favicon) !== null && _l !== void 0 ? _l : null;
    const modInfo = (_m = result === null || result === void 0 ? void 0 : result.modinfo) !== null && _m !== void 0 ? _m : null;
    return {
        host,
        port,
        srvRecord,
        version,
        protocolVersion,
        onlinePlayers,
        maxPlayers,
        samplePlayers,
        description,
        favicon,
        modInfo,
        rawResponse: result,
        roundTripLatency
    };
}
exports.default = formatResult;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ybWF0UmVzdWx0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3V0aWwvZm9ybWF0UmVzdWx0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLDBFQUFrRDtBQUtsRDs7Ozs7OztHQU9HO0FBQ0gsU0FBUyxZQUFZLENBQUMsSUFBWSxFQUFFLElBQVksRUFBRSxTQUEyQixFQUFFLE1BQXlCLEVBQUUsZ0JBQXdCOztJQUNqSSxnQkFBTSxDQUFDLE9BQU8sSUFBSSxLQUFLLFFBQVEsRUFBRSxvQ0FBb0MsR0FBRyxPQUFPLElBQUksQ0FBQyxDQUFDO0lBQ3JGLGdCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsZ0NBQWdDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3hFLGdCQUFNLENBQUMsT0FBTyxJQUFJLEtBQUssUUFBUSxFQUFFLG9DQUFvQyxHQUFHLE9BQU8sSUFBSSxDQUFDLENBQUM7SUFDckYsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLHdCQUF3QixHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ2hFLGdCQUFNLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBRSx5QkFBeUIsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNuRCxnQkFBTSxDQUFDLElBQUksR0FBRyxLQUFLLEVBQUUsNkJBQTZCLEdBQUcsSUFBSSxDQUFDLENBQUM7SUFDM0QsZ0JBQU0sQ0FBQyxPQUFPLE1BQU0sS0FBSyxRQUFRLEVBQUUsdUJBQXVCLEdBQUcsQ0FBQyxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDOUUsZ0JBQU0sQ0FBQyxPQUFPLGdCQUFnQixLQUFLLFFBQVEsRUFBRSxnREFBZ0QsR0FBRyxPQUFPLGdCQUFnQixDQUFDLENBQUM7SUFDekgsZ0JBQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEVBQUUsa0RBQWtELEdBQUcsZ0JBQWdCLENBQUMsQ0FBQztJQUNsSCxnQkFBTSxDQUFDLGdCQUFnQixJQUFJLENBQUMsRUFBRSxzQ0FBc0MsR0FBRyxnQkFBZ0IsQ0FBQyxDQUFDO0lBRXpGLE1BQU0sT0FBTyxHQUFHLE1BQUEsTUFBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsT0FBTywwQ0FBRSxJQUFJLG1DQUFJLElBQUksQ0FBQztJQUM5QyxNQUFNLGVBQWUsR0FBRyxNQUFBLE1BQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLE9BQU8sMENBQUUsUUFBUSxtQ0FBSSxJQUFJLENBQUM7SUFDMUQsTUFBTSxhQUFhLEdBQUcsTUFBQSxNQUFBLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxPQUFPLDBDQUFFLE1BQU0sbUNBQUksSUFBSSxDQUFDO0lBQ3RELE1BQU0sVUFBVSxHQUFHLE1BQUEsTUFBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsT0FBTywwQ0FBRSxHQUFHLG1DQUFJLElBQUksQ0FBQztJQUNoRCxNQUFNLGFBQWEsR0FBRyxNQUFBLE1BQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLE9BQU8sMENBQUUsTUFBTSxtQ0FBSSxJQUFJLENBQUM7SUFDdEQsTUFBTSxXQUFXLEdBQUcsT0FBTyxNQUFNLENBQUMsV0FBVyxLQUFLLFdBQVcsQ0FBQyxDQUFDLENBQUMsMEJBQWdCLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7SUFDNUcsTUFBTSxPQUFPLEdBQUcsTUFBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsT0FBTyxtQ0FBSSxJQUFJLENBQUM7SUFDeEMsTUFBTSxPQUFPLEdBQUcsTUFBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsT0FBTyxtQ0FBSSxJQUFJLENBQUM7SUFFeEMsT0FBTztRQUNOLElBQUk7UUFDSixJQUFJO1FBQ0osU0FBUztRQUNULE9BQU87UUFDUCxlQUFlO1FBQ2YsYUFBYTtRQUNiLFVBQVU7UUFDVixhQUFhO1FBQ2IsV0FBVztRQUNYLE9BQU87UUFDUCxPQUFPO1FBQ1AsV0FBVyxFQUFFLE1BQU07UUFDbkIsZ0JBQWdCO0tBQ2hCLENBQUM7QUFDSCxDQUFDO0FBRUQsa0JBQWUsWUFBWSxDQUFDIn0=