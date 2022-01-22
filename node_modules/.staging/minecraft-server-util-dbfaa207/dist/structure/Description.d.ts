/**
 * The result of the formatted description of the server.
 * @class
 */
declare class Description {
    /** The description text as a string. */
    descriptionText: string;
    /**
     * Creates a new description class from the text.
     * @param {string} descriptionText The MOTD text
     * @constructor
     */
    constructor(descriptionText: string);
    /**
     * Converts the MOTD into a string format
     * @returns {string} The string format of the MOTD
     */
    toString(): string;
    /**
     * Converts the MOTD into a string format without any formatting
     * @returns {string} The MOTD string without formatting
     */
    toRaw(): string;
    /**
     * Converts the special formatting characters to ANSI escape codes, commonly used for terminal formatting
     * @returns {string} The ANSI escaped formatting text
     */
    toANSI(): string;
}
export default Description;
