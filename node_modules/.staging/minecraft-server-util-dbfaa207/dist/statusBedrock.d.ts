import { BedrockStatusResponse } from './model/StatusResponse';
import { BedrockStatusOptions } from './model/Options';
/**
 * Retrieves the status of the Bedrock edition server
 * @param {string} host The host of the server
 * @param {BedrockStatusOptions} [options] The options to use when retrieving the status
 * @returns {Promise<BedrockStatusResponse>} The status information of the server
 * @async
 */
export default function statusBedrock(host: string, options?: BedrockStatusOptions): Promise<BedrockStatusResponse>;
