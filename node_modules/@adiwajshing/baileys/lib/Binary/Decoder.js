"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
class Decoder {
    constructor() {
        this.buffer = null;
        this.index = 0;
    }
    checkEOS(length) {
        if (this.index + length > this.buffer.length) {
            throw new Error('end of stream');
        }
    }
    next() {
        const value = this.buffer[this.index];
        this.index += 1;
        return value;
    }
    readByte() {
        this.checkEOS(1);
        return this.next();
    }
    readStringFromChars(length) {
        this.checkEOS(length);
        const value = this.buffer.slice(this.index, this.index + length);
        this.index += length;
        return value.toString('utf-8');
    }
    readBytes(n) {
        this.checkEOS(n);
        const value = this.buffer.slice(this.index, this.index + n);
        this.index += n;
        return value;
    }
    readInt(n, littleEndian = false) {
        this.checkEOS(n);
        let val = 0;
        for (let i = 0; i < n; i++) {
            const shift = littleEndian ? i : n - 1 - i;
            val |= this.next() << (shift * 8);
        }
        return val;
    }
    readInt20() {
        this.checkEOS(3);
        return ((this.next() & 15) << 16) + (this.next() << 8) + this.next();
    }
    unpackHex(value) {
        if (value >= 0 && value < 16) {
            return value < 10 ? '0'.charCodeAt(0) + value : 'A'.charCodeAt(0) + value - 10;
        }
        throw new Error('invalid hex: ' + value);
    }
    unpackNibble(value) {
        if (value >= 0 && value <= 9) {
            return '0'.charCodeAt(0) + value;
        }
        switch (value) {
            case 10:
                return '-'.charCodeAt(0);
            case 11:
                return '.'.charCodeAt(0);
            case 15:
                return '\0'.charCodeAt(0);
            default:
                throw new Error('invalid nibble: ' + value);
        }
    }
    unpackByte(tag, value) {
        if (tag === Constants_1.WA.Tags.NIBBLE_8) {
            return this.unpackNibble(value);
        }
        else if (tag === Constants_1.WA.Tags.HEX_8) {
            return this.unpackHex(value);
        }
        else {
            throw new Error('unknown tag: ' + tag);
        }
    }
    readPacked8(tag) {
        const startByte = this.readByte();
        let value = '';
        for (let i = 0; i < (startByte & 127); i++) {
            const curByte = this.readByte();
            value += String.fromCharCode(this.unpackByte(tag, (curByte & 0xf0) >> 4));
            value += String.fromCharCode(this.unpackByte(tag, curByte & 0x0f));
        }
        if (startByte >> 7 !== 0) {
            value = value.slice(0, -1);
        }
        return value;
    }
    readRangedVarInt(min, max, description = 'unknown') {
        // value =
        throw new Error('WTF; should not be called');
    }
    isListTag(tag) {
        return tag === Constants_1.WA.Tags.LIST_EMPTY || tag === Constants_1.WA.Tags.LIST_8 || tag === Constants_1.WA.Tags.LIST_16;
    }
    readListSize(tag) {
        switch (tag) {
            case Constants_1.WA.Tags.LIST_EMPTY:
                return 0;
            case Constants_1.WA.Tags.LIST_8:
                return this.readByte();
            case Constants_1.WA.Tags.LIST_16:
                return this.readInt(2);
            default:
                throw new Error('invalid tag for list size: ' + tag);
        }
    }
    readString(tag) {
        if (tag >= 3 && tag <= 235) {
            const token = this.getToken(tag);
            return token; // === 's.whatsapp.net' ? 'c.us' : token
        }
        switch (tag) {
            case Constants_1.WA.Tags.DICTIONARY_0:
            case Constants_1.WA.Tags.DICTIONARY_1:
            case Constants_1.WA.Tags.DICTIONARY_2:
            case Constants_1.WA.Tags.DICTIONARY_3:
                return this.getTokenDouble(tag - Constants_1.WA.Tags.DICTIONARY_0, this.readByte());
            case Constants_1.WA.Tags.LIST_EMPTY:
                return null;
            case Constants_1.WA.Tags.BINARY_8:
                return this.readStringFromChars(this.readByte());
            case Constants_1.WA.Tags.BINARY_20:
                return this.readStringFromChars(this.readInt20());
            case Constants_1.WA.Tags.BINARY_32:
                return this.readStringFromChars(this.readInt(4));
            case Constants_1.WA.Tags.JID_PAIR:
                const i = this.readString(this.readByte());
                const j = this.readString(this.readByte());
                if (typeof i === 'string' && j) {
                    return i + '@' + j;
                }
                throw new Error('invalid jid pair: ' + i + ', ' + j);
            case Constants_1.WA.Tags.HEX_8:
            case Constants_1.WA.Tags.NIBBLE_8:
                return this.readPacked8(tag);
            default:
                throw new Error('invalid string with tag: ' + tag);
        }
    }
    readAttributes(n) {
        if (n !== 0) {
            const attributes = {};
            for (let i = 0; i < n; i++) {
                const key = this.readString(this.readByte());
                const b = this.readByte();
                attributes[key] = this.readString(b);
            }
            return attributes;
        }
        return null;
    }
    readList(tag) {
        const arr = [...new Array(this.readListSize(tag))];
        return arr.map(() => this.readNode());
    }
    getToken(index) {
        if (index < 3 || index >= Constants_1.WA.SingleByteTokens.length) {
            throw new Error('invalid token index: ' + index);
        }
        return Constants_1.WA.SingleByteTokens[index];
    }
    getTokenDouble(index1, index2) {
        const n = 256 * index1 + index2;
        if (n < 0 || n > Constants_1.WA.DoubleByteTokens.length) {
            throw new Error('invalid double token index: ' + n);
        }
        return Constants_1.WA.DoubleByteTokens[n];
    }
    readNode() {
        const listSize = this.readListSize(this.readByte());
        const descrTag = this.readByte();
        if (descrTag === Constants_1.WA.Tags.STREAM_END) {
            throw new Error('unexpected stream end');
        }
        const descr = this.readString(descrTag);
        if (listSize === 0 || !descr) {
            throw new Error('invalid node');
        }
        const attrs = this.readAttributes((listSize - 1) >> 1);
        let content = null;
        if (listSize % 2 === 0) {
            const tag = this.readByte();
            if (this.isListTag(tag)) {
                content = this.readList(tag);
            }
            else {
                let decoded;
                switch (tag) {
                    case Constants_1.WA.Tags.BINARY_8:
                        decoded = this.readBytes(this.readByte());
                        break;
                    case Constants_1.WA.Tags.BINARY_20:
                        decoded = this.readBytes(this.readInt20());
                        break;
                    case Constants_1.WA.Tags.BINARY_32:
                        decoded = this.readBytes(this.readInt(4));
                        break;
                    default:
                        decoded = this.readString(tag);
                        break;
                }
                if (descr === 'message' && Buffer.isBuffer(decoded)) {
                    content = Constants_1.WA.Message.decode(decoded);
                }
                else {
                    content = decoded;
                }
            }
        }
        return [descr, attrs, content];
    }
    read(buffer) {
        this.buffer = buffer;
        this.index = 0;
        return this.readNode();
    }
}
exports.default = Decoder;
