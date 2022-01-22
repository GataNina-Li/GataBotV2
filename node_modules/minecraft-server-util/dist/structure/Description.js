"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ansi_styles_1 = __importDefault(require("ansi-styles"));
const formattingCode = /\u00C2?\u00A7([a-fklmnor0-9])/g;
const ansiMap = new Map();
ansiMap.set('0', ansi_styles_1.default.black);
ansiMap.set('1', ansi_styles_1.default.blue);
ansiMap.set('2', ansi_styles_1.default.green);
ansiMap.set('3', ansi_styles_1.default.cyan);
ansiMap.set('4', ansi_styles_1.default.red);
ansiMap.set('5', ansi_styles_1.default.magenta);
ansiMap.set('6', ansi_styles_1.default.yellow);
ansiMap.set('7', ansi_styles_1.default.gray);
ansiMap.set('8', ansi_styles_1.default.blackBright);
ansiMap.set('9', ansi_styles_1.default.blueBright);
ansiMap.set('a', ansi_styles_1.default.greenBright);
ansiMap.set('b', ansi_styles_1.default.cyanBright);
ansiMap.set('c', ansi_styles_1.default.redBright);
ansiMap.set('d', ansi_styles_1.default.magentaBright);
ansiMap.set('e', ansi_styles_1.default.yellowBright);
ansiMap.set('f', ansi_styles_1.default.whiteBright);
ansiMap.set('k', ansi_styles_1.default.reset);
ansiMap.set('l', ansi_styles_1.default.bold);
ansiMap.set('m', ansi_styles_1.default.strikethrough);
ansiMap.set('n', ansi_styles_1.default.underline);
ansiMap.set('o', ansi_styles_1.default.italic);
ansiMap.set('r', ansi_styles_1.default.reset);
/**
 * The result of the formatted description of the server.
 * @class
 */
class Description {
    /**
     * Creates a new description class from the text.
     * @param {string} descriptionText The MOTD text
     * @constructor
     */
    constructor(descriptionText) {
        this.descriptionText = descriptionText;
    }
    /**
     * Converts the MOTD into a string format
     * @returns {string} The string format of the MOTD
     */
    toString() {
        return this.descriptionText;
    }
    /**
     * Converts the MOTD into a string format without any formatting
     * @returns {string} The MOTD string without formatting
     */
    toRaw() {
        return this.descriptionText.replace(formattingCode, '');
    }
    /**
     * Converts the special formatting characters to ANSI escape codes, commonly used for terminal formatting
     * @returns {string} The ANSI escaped formatting text
     */
    toANSI() {
        return this.descriptionText.replace(formattingCode, (match, p1) => {
            const value = ansiMap.get(p1);
            if (!value)
                return ansi_styles_1.default.reset.open;
            return value.open;
        }) + ansi_styles_1.default.reset.open;
    }
}
exports.default = Description;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVzY3JpcHRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvc3RydWN0dXJlL0Rlc2NyaXB0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQTJDO0FBRTNDLE1BQU0sY0FBYyxHQUFHLGdDQUFnQyxDQUFDO0FBRXhELE1BQU0sT0FBTyxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO0FBQzFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDN0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxQkFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzdCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDNUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxQkFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxQkFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDbEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxQkFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQ2xDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxQkFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQ3BDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxQkFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUscUJBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNqQyxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxxQkFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLHFCQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7QUFFN0I7OztHQUdHO0FBQ0gsTUFBTSxXQUFXO0lBSWhCOzs7O09BSUc7SUFDSCxZQUFZLGVBQXVCO1FBQ2xDLElBQUksQ0FBQyxlQUFlLEdBQUcsZUFBZSxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7O09BR0c7SUFDSCxRQUFRO1FBQ1AsT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDO0lBQzdCLENBQUM7SUFFRDs7O09BR0c7SUFDSCxLQUFLO1FBQ0osT0FBTyxJQUFJLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7T0FHRztJQUNILE1BQU07UUFDTCxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxDQUFDLEtBQWEsRUFBRSxFQUFVLEVBQVUsRUFBRTtZQUN6RixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRTlCLElBQUksQ0FBQyxLQUFLO2dCQUFFLE9BQU8scUJBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBRW5DLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQztRQUNuQixDQUFDLENBQUMsR0FBRyxxQkFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDdEIsQ0FBQztDQUNEO0FBRUQsa0JBQWUsV0FBVyxDQUFDIn0=