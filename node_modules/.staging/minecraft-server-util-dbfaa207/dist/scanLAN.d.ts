import { ScanLANOptions } from './model/Options';
import { ScanLANResponse } from './model/ScanLANResponse';
/**
 * Scans the local area network for any Minecraft worlds.
 * @param {ScanLANOptions} [options] The options to use when scanning LAN
 * @returns {Promise<ScanLANResponse>} The response of the scan
 * @async
 */
export default function scanLAN(options?: ScanLANOptions): Promise<ScanLANResponse>;
