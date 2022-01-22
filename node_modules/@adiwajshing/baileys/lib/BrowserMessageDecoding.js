"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const WAConnection_1 = require("./WAConnection");
const Decoder_1 = __importDefault(require("./Binary/Decoder"));
const file = fs_1.default.readFileSync('./browser-messages.json', { encoding: 'utf-8' });
const json = JSON.parse(file);
const encKey = Buffer.from(json.bundle.encKey, 'base64');
const macKey = Buffer.from(json.bundle.macKey, 'base64');
const harFile = JSON.parse(fs_1.default.readFileSync(json.harFilePath, { encoding: 'utf-8' }));
const entries = harFile['log']['entries'];
let wsMessages = [];
entries.forEach((e, i) => {
    if ('_webSocketMessages' in e) {
        wsMessages.push(...e['_webSocketMessages']);
    }
});
const decrypt = (buffer, fromMe) => WAConnection_1.decryptWA(buffer, macKey, encKey, new Decoder_1.default(), fromMe);
console.log('parsing ' + wsMessages.length + ' messages');
const list = wsMessages.map((item, i) => {
    const buffer = item.data.includes(',') ? item.data : Buffer.from(item.data, 'base64');
    try {
        const [tag, json, binaryTags] = decrypt(buffer, item.type === 'send');
        return { tag, json: json && JSON.stringify(json), binaryTags };
    }
    catch (error) {
        return { error: error.message, data: buffer.toString('utf-8') };
    }
})
    .filter(Boolean);
const str = JSON.stringify(list, null, '\t');
fs_1.default.writeFileSync('decoded-ws.json', str);
