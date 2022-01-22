import ansi, { CSPair } from 'ansi-styles';

const formattingCode = /\u00C2?\u00A7([a-fklmnor0-9])/g;

const ansiMap = new Map<string, CSPair>();
ansiMap.set('0', ansi.black);
ansiMap.set('1', ansi.blue);
ansiMap.set('2', ansi.green);
ansiMap.set('3', ansi.cyan);
ansiMap.set('4', ansi.red);
ansiMap.set('5', ansi.magenta);
ansiMap.set('6', ansi.yellow);
ansiMap.set('7', ansi.gray);
ansiMap.set('8', ansi.blackBright);
ansiMap.set('9', ansi.blueBright);
ansiMap.set('a', ansi.greenBright);
ansiMap.set('b', ansi.cyanBright);
ansiMap.set('c', ansi.redBright);
ansiMap.set('d', ansi.magentaBright);
ansiMap.set('e', ansi.yellowBright);
ansiMap.set('f', ansi.whiteBright);
ansiMap.set('k', ansi.reset);
ansiMap.set('l', ansi.bold);
ansiMap.set('m', ansi.strikethrough);
ansiMap.set('n', ansi.underline);
ansiMap.set('o', ansi.italic);
ansiMap.set('r', ansi.reset);

/**
 * The result of the formatted description of the server.
 * @class
 */
class Description {
	/** The description text as a string. */
	public descriptionText: string;

	/**
	 * Creates a new description class from the text.
	 * @param {string} descriptionText The MOTD text
	 * @constructor
	 */
	constructor(descriptionText: string) {
		this.descriptionText = descriptionText;
	}

	/**
	 * Converts the MOTD into a string format
	 * @returns {string} The string format of the MOTD
	 */
	toString(): string {
		return this.descriptionText;
	}

	/**
	 * Converts the MOTD into a string format without any formatting
	 * @returns {string} The MOTD string without formatting
	 */
	toRaw(): string {
		return this.descriptionText.replace(formattingCode, '');
	}

	/**
	 * Converts the special formatting characters to ANSI escape codes, commonly used for terminal formatting
	 * @returns {string} The ANSI escaped formatting text
	 */
	toANSI(): string {
		return this.descriptionText.replace(formattingCode, (match: string, p1: string): string => {
			const value = ansiMap.get(p1);

			if (!value) return ansi.reset.open;

			return value.open;
		}) + ansi.reset.open;
	}
}

export default Description;