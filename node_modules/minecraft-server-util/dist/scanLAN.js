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
const dgram_1 = __importDefault(require("dgram"));
const util_1 = require("util");
const Description_1 = __importDefault(require("./structure/Description"));
const pattern = /\[MOTD\](.+)?(?=\[\/MOTD\])\[\/MOTD\]\[AD\](\d+)\[\/AD\]/;
const decoder = new util_1.TextDecoder('utf-8');
function applyDefaultOptions(options) {
    // Apply the provided options on the default options
    return Object.assign({
        scanTime: 1000 * 5
    }, options);
}
/**
 * Scans the local area network for any Minecraft worlds.
 * @param {ScanLANOptions} [options] The options to use when scanning LAN
 * @returns {Promise<ScanLANResponse>} The response of the scan
 * @async
 */
function scanLAN(options) {
    return __awaiter(this, void 0, void 0, function* () {
        // Applies the provided options on top of the default options
        const opts = applyDefaultOptions(options);
        // Assert that the arguments are the correct type and format
        assert_1.default(typeof options === 'object' || typeof options === 'undefined', `Expected 'options' to be an object or undefined, got ${typeof options}`);
        assert_1.default(typeof opts === 'object', `Expected 'options' to be an object, got ${typeof opts}`);
        assert_1.default(typeof opts.scanTime === 'number', `Expected 'options.scanTime' to be a number, got ${typeof opts.scanTime}`);
        assert_1.default(opts.scanTime >= 1500, `Expected 'options.scanTime' to be greater than or equal to 1500, got ${opts.scanTime}`);
        // Create a list of servers that the socket will append to
        const servers = [];
        // Create a new UDP socket and listen for messages
        const socket = dgram_1.default.createSocket('udp4');
        // Wait for messages being broadcased
        socket.on('message', (message, info) => {
            var _a, _b;
            const text = decoder.decode(message);
            // Ensure that the text sent to the scan port matches the "Open to LAN" format
            if (!pattern.test(text))
                return;
            const match = text.match(pattern);
            if (!match)
                return;
            // Parse the port out of the matched text
            const port = parseInt(match[2]);
            if (isNaN(port))
                return;
            if (servers.length > 0) {
                // Check if the server already exists in the list of servers for long scan times
                const server = servers.find((server) => server.host === info.address && server.port === port);
                if (server)
                    return;
                servers.push({
                    host: info.address,
                    port,
                    description: new Description_1.default((_a = match[1]) !== null && _a !== void 0 ? _a : '')
                });
            }
            else {
                // Add the server to the servers list
                servers.push({
                    host: info.address,
                    port,
                    description: new Description_1.default((_b = match[1]) !== null && _b !== void 0 ? _b : '')
                });
            }
        });
        // Bind to the 4445 port which is used for receiving and broadcasting "Open to LAN" worlds
        socket.bind(4445, () => {
            socket.addMembership('224.0.2.60');
        });
        // Return the timeout promise that will resolve when the scan time is up
        return new Promise((resolve) => setTimeout(() => {
            resolve({ servers });
            socket.close();
        }, opts.scanTime));
    });
}
exports.default = scanLAN;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NhbkxBTi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uL3NyYy9zY2FuTEFOLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQUEsb0RBQTRCO0FBQzVCLGtEQUEwQjtBQUMxQiwrQkFBbUM7QUFDbkMsMEVBQWtEO0FBSWxELE1BQU0sT0FBTyxHQUFHLDBEQUEwRCxDQUFDO0FBQzNFLE1BQU0sT0FBTyxHQUFHLElBQUksa0JBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUV6QyxTQUFTLG1CQUFtQixDQUFDLE9BQXdCO0lBQ3BELG9EQUFvRDtJQUNwRCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUM7UUFDcEIsUUFBUSxFQUFFLElBQUksR0FBRyxDQUFDO0tBQ1UsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUN6QyxDQUFDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUE4QixPQUFPLENBQUMsT0FBd0I7O1FBQzdELDZEQUE2RDtRQUM3RCxNQUFNLElBQUksR0FBRyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUUxQyw0REFBNEQ7UUFDNUQsZ0JBQU0sQ0FBQyxPQUFPLE9BQU8sS0FBSyxRQUFRLElBQUksT0FBTyxPQUFPLEtBQUssV0FBVyxFQUFFLHdEQUF3RCxPQUFPLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFDaEosZ0JBQU0sQ0FBQyxPQUFPLElBQUksS0FBSyxRQUFRLEVBQUUsMkNBQTJDLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztRQUMzRixnQkFBTSxDQUFDLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUUsbURBQW1ELE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDckgsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksRUFBRSx3RUFBd0UsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFFdkgsMERBQTBEO1FBQzFELE1BQU0sT0FBTyxHQUFvQixFQUFFLENBQUM7UUFFcEMsa0RBQWtEO1FBQ2xELE1BQU0sTUFBTSxHQUFHLGVBQUssQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFMUMscUNBQXFDO1FBQ3JDLE1BQU0sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFOztZQUN0QyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBRXJDLDhFQUE4RTtZQUM5RSxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Z0JBQUUsT0FBTztZQUVoQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxLQUFLO2dCQUFFLE9BQU87WUFFbkIseUNBQXlDO1lBQ3pDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUM7Z0JBQUUsT0FBTztZQUV4QixJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN2QixnRkFBZ0Y7Z0JBQ2hGLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLE9BQU8sSUFBSSxNQUFNLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxDQUFDO2dCQUM5RixJQUFJLE1BQU07b0JBQUUsT0FBTztnQkFFbkIsT0FBTyxDQUFDLElBQUksQ0FBQztvQkFDWixJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU87b0JBQ2xCLElBQUk7b0JBQ0osV0FBVyxFQUFFLElBQUkscUJBQVcsQ0FBQyxNQUFBLEtBQUssQ0FBQyxDQUFDLENBQUMsbUNBQUksRUFBRSxDQUFDO2lCQUM1QyxDQUFDLENBQUM7YUFDSDtpQkFBTTtnQkFDTixxQ0FBcUM7Z0JBQ3JDLE9BQU8sQ0FBQyxJQUFJLENBQUM7b0JBQ1osSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPO29CQUNsQixJQUFJO29CQUNKLFdBQVcsRUFBRSxJQUFJLHFCQUFXLENBQUMsTUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLG1DQUFJLEVBQUUsQ0FBQztpQkFDNUMsQ0FBQyxDQUFDO2FBQ0g7UUFDRixDQUFDLENBQUMsQ0FBQztRQUVILDBGQUEwRjtRQUMxRixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7WUFDdEIsTUFBTSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQztRQUVILHdFQUF3RTtRQUN4RSxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFO1lBQy9DLE9BQU8sQ0FBQyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7WUFFckIsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2hCLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUNwQixDQUFDO0NBQUE7QUE3REQsMEJBNkRDIn0=