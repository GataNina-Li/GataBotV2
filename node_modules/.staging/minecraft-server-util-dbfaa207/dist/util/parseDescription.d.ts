import Description from '../structure/Description';
import { Chat } from '../model/Chat';
/**
 * Parses the MOTD from the many formats that Minecraft uses into a {@see Description} class.
 * @param {Chat | string} description The raw MOTD provided by the server
 * @returns {Description} The formatted result of the description
 */
declare function parseDescription(description: Chat | string): Description;
export default parseDescription;
