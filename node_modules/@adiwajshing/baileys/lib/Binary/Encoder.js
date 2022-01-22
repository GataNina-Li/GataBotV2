"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Constants_1 = require("./Constants");
class Encoder {
    constructor() {
        this.data = [];
    }
    pushByte(value) {
        this.data.push(value & 0xff);
    }
    pushInt(value, n, littleEndian = false) {
        for (let i = 0; i < n; i++) {
            const curShift = littleEndian ? i : n - 1 - i;
            this.data.push((value >> (curShift * 8)) & 0xff);
        }
    }
    pushInt20(value) {
        this.pushBytes([(value >> 16) & 0x0f, (value >> 8) & 0xff, value & 0xff]);
    }
    pushBytes(bytes) {
        bytes.forEach(b => this.data.push(b));
    }
    writeByteLength(length) {
        if (length >= 4294967296)
            throw new Error('string too large to encode: ' + length);
        if (length >= 1 << 20) {
            this.pushByte(Constants_1.WA.Tags.BINARY_32);
            this.pushInt(length, 4); // 32 bit integer
        }
        else if (length >= 256) {
            this.pushByte(Constants_1.WA.Tags.BINARY_20);
            this.pushInt20(length);
        }
        else {
            this.pushByte(Constants_1.WA.Tags.BINARY_8);
            this.pushByte(length);
        }
    }
    writeStringRaw(string) {
        const bytes = Buffer.from(string, 'utf-8');
        this.writeByteLength(bytes.length);
        this.pushBytes(bytes);
    }
    writeJid(left, right) {
        this.pushByte(Constants_1.WA.Tags.JID_PAIR);
        left && left.length > 0 ? this.writeString(left) : this.writeToken(Constants_1.WA.Tags.LIST_EMPTY);
        this.writeString(right);
    }
    writeToken(token) {
        if (token < 245) {
            this.pushByte(token);
        }
        else if (token <= 500) {
            throw new Error('invalid token');
        }
    }
    writeString(token, i = null) {
        if (token === 'c.us')
            token = 's.whatsapp.net';
        const tokenIndex = Constants_1.WA.SingleByteTokens.indexOf(token);
        if (!i && token === 's.whatsapp.net') {
            this.writeToken(tokenIndex);
        }
        else if (tokenIndex >= 0) {
            if (tokenIndex < Constants_1.WA.Tags.SINGLE_BYTE_MAX) {
                this.writeToken(tokenIndex);
            }
            else {
                const overflow = tokenIndex - Constants_1.WA.Tags.SINGLE_BYTE_MAX;
                const dictionaryIndex = overflow >> 8;
                if (dictionaryIndex < 0 || dictionaryIndex > 3) {
                    throw new Error('double byte dict token out of range: ' + token + ', ' + tokenIndex);
                }
                this.writeToken(Constants_1.WA.Tags.DICTIONARY_0 + dictionaryIndex);
                this.writeToken(overflow % 256);
            }
        }
        else if (token) {
            const jidSepIndex = token.indexOf('@');
            if (jidSepIndex <= 0) {
                this.writeStringRaw(token);
            }
            else {
                this.writeJid(token.slice(0, jidSepIndex), token.slice(jidSepIndex + 1, token.length));
            }
        }
    }
    writeAttributes(attrs, keys) {
        if (!attrs) {
            return;
        }
        keys.forEach((key) => {
            this.writeString(key);
            this.writeString(attrs[key]);
        });
    }
    writeListStart(listSize) {
        if (listSize === 0) {
            this.pushByte(Constants_1.WA.Tags.LIST_EMPTY);
        }
        else if (listSize < 256) {
            this.pushBytes([Constants_1.WA.Tags.LIST_8, listSize]);
        }
        else {
            this.pushBytes([Constants_1.WA.Tags.LIST_16, listSize]);
        }
    }
    writeChildren(children) {
        if (!children)
            return;
        if (typeof children === 'string') {
            this.writeString(children, true);
        }
        else if (Buffer.isBuffer(children)) {
            this.writeByteLength(children.length);
            this.pushBytes(children);
        }
        else if (Array.isArray(children)) {
            this.writeListStart(children.length);
            children.forEach(c => c && this.writeNode(c));
        }
        else if (typeof children === 'object') {
            const buffer = Constants_1.WA.Message.encode(children).finish();
            this.writeByteLength(buffer.length);
            this.pushBytes(buffer);
        }
        else {
            throw new Error('invalid children: ' + children + ' (' + typeof children + ')');
        }
    }
    getValidKeys(obj) {
        return obj ? Object.keys(obj).filter((key) => obj[key] !== null && obj[key] !== undefined) : [];
    }
    writeNode(node) {
        if (!node) {
            return;
        }
        else if (node.length !== 3) {
            throw new Error('invalid node given: ' + node);
        }
        const validAttributes = this.getValidKeys(node[1]);
        this.writeListStart(2 * validAttributes.length + 1 + (node[2] ? 1 : 0));
        this.writeString(node[0]);
        this.writeAttributes(node[1], validAttributes);
        this.writeChildren(node[2]);
    }
    write(data) {
        this.data = [];
        this.writeNode(data);
        return Buffer.from(this.data);
    }
}
exports.default = Encoder;
