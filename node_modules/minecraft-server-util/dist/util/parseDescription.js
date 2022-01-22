"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Description_1 = __importDefault(require("../structure/Description"));
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
function parseDescription(description) {
    if (typeof description === 'string')
        return new Description_1.default(description);
    let result = '';
    if ('color' in description && typeof description.color !== 'undefined') {
        if (Object.prototype.hasOwnProperty.call(colorCodes, description.color)) {
            // @ts-ignore
            result += '\u00A7' + colorCodes[description.color];
        }
        else if (Object.prototype.hasOwnProperty.call(formatCodes, description.color)) {
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
    return new Description_1.default(result);
}
exports.default = parseDescription;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VEZXNjcmlwdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3BhcnNlRGVzY3JpcHRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSwyRUFBbUQ7QUFHbkQsTUFBTSxVQUFVLEdBQUc7SUFDbEIsS0FBSyxFQUFFLEdBQUc7SUFDVixTQUFTLEVBQUUsR0FBRztJQUNkLFVBQVUsRUFBRSxHQUFHO0lBQ2YsU0FBUyxFQUFFLEdBQUc7SUFDZCxRQUFRLEVBQUUsR0FBRztJQUNiLFdBQVcsRUFBRSxHQUFHO0lBQ2hCLElBQUksRUFBRSxHQUFHO0lBQ1QsSUFBSSxFQUFFLEdBQUc7SUFDVCxTQUFTLEVBQUUsR0FBRztJQUNkLElBQUksRUFBRSxHQUFHO0lBQ1QsS0FBSyxFQUFFLEdBQUc7SUFDVixJQUFJLEVBQUUsR0FBRztJQUNULEdBQUcsRUFBRSxHQUFHO0lBQ1IsWUFBWSxFQUFFLEdBQUc7SUFDakIsTUFBTSxFQUFFLEdBQUc7SUFDWCxLQUFLLEVBQUUsR0FBRztDQUNWLENBQUM7QUFFRixNQUFNLFdBQVcsR0FBRztJQUNuQixVQUFVLEVBQUUsR0FBRztJQUNmLElBQUksRUFBRSxHQUFHO0lBQ1QsYUFBYSxFQUFFLEdBQUc7SUFDbEIsU0FBUyxFQUFFLEdBQUc7SUFDZCxNQUFNLEVBQUUsR0FBRztJQUNYLEtBQUssRUFBRSxHQUFHO0NBQ1YsQ0FBQztBQUVGOzs7O0dBSUc7QUFDSCxTQUFTLGdCQUFnQixDQUFDLFdBQTBCO0lBQ25ELElBQUksT0FBTyxXQUFXLEtBQUssUUFBUTtRQUFFLE9BQU8sSUFBSSxxQkFBVyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRXpFLElBQUksTUFBTSxHQUFHLEVBQUUsQ0FBQztJQUVoQixJQUFJLE9BQU8sSUFBSSxXQUFXLElBQUksT0FBTyxXQUFXLENBQUMsS0FBSyxLQUFLLFdBQVcsRUFBRTtRQUN2RSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3hFLGFBQWE7WUFDYixNQUFNLElBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbkQ7YUFBTSxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsV0FBVyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ2hGLGFBQWE7WUFDYixNQUFNLElBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEQ7S0FDRDtJQUVELEtBQUssTUFBTSxJQUFJLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQzNELElBQUksTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUM1RCxhQUFhO1lBQ2IsTUFBTSxJQUFJLFFBQVEsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkM7S0FDRDtJQUVELE1BQU0sSUFBSSxXQUFXLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUVqQyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLElBQUksT0FBTyxXQUFXLENBQUMsS0FBSyxLQUFLLFdBQVcsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLFdBQVcsS0FBSyxLQUFLLEVBQUU7UUFDdEosS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ2xELE1BQU0sSUFBSSxnQkFBZ0IsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDakQ7S0FDRDtJQUVELE9BQU8sSUFBSSxxQkFBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFFRCxrQkFBZSxnQkFBZ0IsQ0FBQyJ9