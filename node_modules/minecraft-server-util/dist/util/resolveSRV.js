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
const dns_1 = __importDefault(require("dns"));
const util_1 = require("util");
/**
 * Performs a DNS lookup on the host for a _minecraft._tcp SRV record
 * @param {string} host The host to perform the lookup on
 * @returns {SRVRecord | null} The result of the lookup
 * @async
 */
function resolveSRV(host) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const records = yield util_1.promisify(dns_1.default.resolveSrv)('_minecraft._tcp.' + host);
            if (records.length < 1)
                return null;
            return {
                host: records[0].name,
                port: records[0].port
            };
        }
        catch (_a) {
            return null;
        }
    });
}
exports.default = resolveSRV;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzb2x2ZVNSVi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3Jlc29sdmVTUlYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7QUFBQSw4Q0FBc0I7QUFDdEIsK0JBQWlDO0FBT2pDOzs7OztHQUtHO0FBQ0gsU0FBZSxVQUFVLENBQUMsSUFBWTs7UUFDckMsSUFBSTtZQUNILE1BQU0sT0FBTyxHQUFHLE1BQU0sZ0JBQVMsQ0FBQyxhQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLENBQUM7WUFFM0UsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQUUsT0FBTyxJQUFJLENBQUM7WUFFcEMsT0FBTztnQkFDTixJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUk7Z0JBQ3JCLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSTthQUNyQixDQUFDO1NBQ0Y7UUFBQyxXQUFNO1lBQ1AsT0FBTyxJQUFJLENBQUM7U0FDWjtJQUNGLENBQUM7Q0FBQTtBQUdELGtCQUFlLFVBQVUsQ0FBQyJ9