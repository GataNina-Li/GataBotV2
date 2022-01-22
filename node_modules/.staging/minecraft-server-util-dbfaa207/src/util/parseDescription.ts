import Description from '../structure/Description';
import { Chat } from '../model/Chat';

const colorCodes = {
	black: '0',
	dark_blue: '1',
	dark_green: '2',
	dark_aqua: '3',
	dark_red: '4',
	dark_purple: '5',
	gold: '6',
	gray: '7',
	dark_gray: '8',
	blue: '9',
	green: 'a',
	aqua: 'b',
	red: 'c',
	light_purple: 'd',
	yellow: 'e',
	white: 'f'
};

const formatCodes = {
	obfuscated: 'k',
	bold: 'l',
	strikethrough: 'm',
	underline: 'n',
	italic: 'o',
	reset: 'r'
};

/**
 * Parses the MOTD from the many formats that Minecraft uses into a {@see Description} class.
 * @param {Chat | string} description The raw MOTD provided by the server
 * @returns {Description} The formatted result of the description
 */
function parseDescription(description: Chat | string): Description {
	if (typeof description === 'string') return new Description(description);

	let result = '';

	if ('color' in description && typeof description.color !== 'undefined') {
		if (Object.prototype.hasOwnProperty.call(colorCodes, description.color)) {
			// @ts-ignore
			result += '\u00A7' + colorCodes[description.color];
		} else if (Object.prototype.hasOwnProperty.call(formatCodes, description.color)) {
			// @ts-ignore
			result += '\u00A7' + formatCodes[description.color];
		}
	}

	for (const prop in Object.getOwnPropertyNames(description)) {
		if (Object.prototype.hasOwnProperty.call(formatCodes, prop)) {
			// @ts-ignore
			result += '\u00A7' + formatCodes[prop];
		}
	}

	result += description.text || '';

	if (Object.prototype.hasOwnProperty.call(description, 'extra') && typeof description.extra !== 'undefined' && description.extra.constructor === Array) {
		for (let i = 0; i < description.extra.length; i++) {
			result += parseDescription(description.extra[i]);
		}
	}

	return new Description(result);
}

export default parseDescription;