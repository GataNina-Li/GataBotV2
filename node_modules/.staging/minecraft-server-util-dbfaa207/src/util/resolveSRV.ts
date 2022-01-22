import dns from 'dns';
import { promisify } from 'util';

interface SRVRecord {
	host: string,
	port: number
}

/**
 * Performs a DNS lookup on the host for a _minecraft._tcp SRV record
 * @param {string} host The host to perform the lookup on
 * @returns {SRVRecord | null} The result of the lookup
 * @async
 */
async function resolveSRV(host: string): Promise<SRVRecord | null> {
	try {
		const records = await promisify(dns.resolveSrv)('_minecraft._tcp.' + host);

		if (records.length < 1) return null;

		return {
			host: records[0].name,
			port: records[0].port
		};
	} catch {
		return null;
	}
}

export { SRVRecord };
export default resolveSRV;