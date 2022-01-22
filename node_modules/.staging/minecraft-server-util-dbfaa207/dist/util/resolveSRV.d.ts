interface SRVRecord {
    host: string;
    port: number;
}
/**
 * Performs a DNS lookup on the host for a _minecraft._tcp SRV record
 * @param {string} host The host to perform the lookup on
 * @returns {SRVRecord | null} The result of the lookup
 * @async
 */
declare function resolveSRV(host: string): Promise<SRVRecord | null>;
export { SRVRecord };
export default resolveSRV;
