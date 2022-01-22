"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
/**
 * A packet class with utilities for reading and writing from a stream.
 * @class
 */
class Packet {
    constructor() {
        /** The buffered data in the packet. */
        this.buffer = Buffer.alloc(0);
        this.encoder = new util_1.TextEncoder();
        this.decoder = new util_1.TextDecoder('utf-8');
    }
    /**
     * Automatically read a packet from a stream using the Minecraft 1.7+ format.
     * @param {TCPSocket} socket The TCP socket to read data from
     * @returns {Promise<Packet>} The buffered packet with the data
     * @async
     */
    static from(socket) {
        return __awaiter(this, void 0, void 0, function* () {
            const length = yield socket.readVarInt();
            if (length < 1)
                return new Packet();
            const data = yield socket.readBytes(length);
            const packet = new Packet();
            packet.buffer = data;
            return packet;
        });
    }
    /**
     * Reads a byte from the packet data
     * @returns {number} The byte read from the packet
     */
    readByte() {
        if (this.buffer.byteLength < 1)
            throw new Error('Cannot readByte() as buffer is empty');
        const value = this.buffer[0];
        this.buffer = this.buffer.slice(1);
        return value;
    }
    /**
     * Reads bytes from the packet data
     * @returns {Buffer} The bytes read from the packet
     */
    readBytes(length) {
        if (this.buffer.byteLength < 1)
            throw new Error('Cannot readByte() as buffer is empty');
        const value = this.buffer.slice(0, length);
        this.buffer = this.buffer.slice(length);
        return value;
    }
    /**
    * Write bytes to the packet data
    * @param {...number} values The bytes to write to the packet
    */
    writeByte(...values) {
        this.buffer = Buffer.concat([this.buffer, Uint8Array.from(values)]);
    }
    /**
    * Write bytes to the packet data
    * @param {Buffer} data The bytes to write to the packet
    */
    writeBuffer(data) {
        this.buffer = Buffer.concat([this.buffer, data]);
    }
    /**
     * Reads a short (int16, big-endian) from the packet data
     * @returns {number} The int16 read from the packet
     */
    readShortBE() {
        if (this.buffer.byteLength < 2)
            throw new Error('Cannot readShort() as buffer is empty or too small for type');
        const value = this.buffer.readInt16BE();
        this.buffer = this.buffer.slice(2);
        return value;
    }
    /**
     * Writes a short (int16, big-endian) to the packet data
     * @param {number} value The int16 written to the packet
     */
    writeShortBE(value) {
        const buf = Buffer.alloc(2);
        buf.writeInt16BE(value);
        this.writeBuffer(buf);
    }
    /**
     * Reads a short (int16, little-endian) from the packet data
     * @returns {number} The int16 read from the packet
     */
    readShortLE() {
        if (this.buffer.byteLength < 2)
            throw new Error('Cannot readShortLE() as buffer is empty or too small for type');
        const value = this.buffer.readInt16LE();
        this.buffer = this.buffer.slice(2);
        return value;
    }
    /**
     * Writes a short (int16, little-endian) to the packet data
     * @param {number} value The int16 written to the packet
     */
    writeShortLE(value) {
        const buf = Buffer.alloc(2);
        buf.writeInt16LE(value);
        this.writeBuffer(buf);
    }
    /**
     * Reads a short (uint16, big-endian) from the packet data
     * @returns {number} The uint16 read from the packet
     */
    readUShortBE() {
        if (this.buffer.byteLength < 2)
            throw new Error('Cannot readShort() as buffer is empty or too small for type');
        const value = this.buffer.readUInt16BE();
        this.buffer = this.buffer.slice(2);
        return value;
    }
    /**
     * Writes a short (uint16, big-endian) to the packet data
     * @param {number} value The uint16 written to the packet
     */
    writeUShortBE(value) {
        const buf = Buffer.alloc(2);
        buf.writeUInt16BE(value);
        this.writeBuffer(buf);
    }
    /**
     * Reads a short (uint16, little-endian) from the packet data
     * @returns {number} The uint16 read from the packet
     */
    readUShortLE() {
        if (this.buffer.byteLength < 2)
            throw new Error('Cannot readUShortLE() as buffer is empty or too small for type');
        const value = this.buffer.readUInt16LE();
        this.buffer = this.buffer.slice(2);
        return value;
    }
    /**
     * Writes a short (uint16, little-endian) to the packet data
     * @returns {number} The uint16 written to the packet
     */
    writeUShortLE(value) {
        const buf = Buffer.alloc(2);
        buf.writeUInt16LE(value);
        this.writeBuffer(buf);
    }
    /**
     * Reads an int (int32, big-endian) from the packet data
     * @returns {number} The int32 read from the packet
     */
    readIntBE() {
        if (this.buffer.byteLength < 4)
            throw new Error('Cannot readInt() as buffer is empty or too small for type');
        const value = this.buffer.readInt32BE();
        this.buffer = this.buffer.slice(4);
        return value;
    }
    /**
     * Writes an int (int32, big-endian) to the packet data
     * @param {number} value The int32 written to the packet
     */
    writeIntBE(value) {
        const buf = Buffer.alloc(4);
        buf.writeInt32BE(value);
        this.writeBuffer(buf);
    }
    /**
     * Reads an int (int32, little-endian) from the packet data
     * @returns {number} The int32 read from the packet
     */
    readIntLE() {
        if (this.buffer.byteLength < 4)
            throw new Error('Cannot readInt() as buffer is empty or too small for type');
        const value = this.buffer.readInt32LE();
        this.buffer = this.buffer.slice(4);
        return value;
    }
    /**
     * Writes an int (int32, little-endian) to the packet data
     * @param {number} value The int32 written to the packet
     */
    writeIntLE(value) {
        const buf = Buffer.alloc(4);
        buf.writeInt32LE(value);
        this.writeBuffer(buf);
    }
    /**
     * Reads an int (uint32, big-endian) from the packet data
     * @returns {number} The uint32 read from the packet
     */
    readUIntBE() {
        if (this.buffer.byteLength < 4)
            throw new Error('Cannot readInt() as buffer is empty or too small for type');
        const value = this.buffer.readUInt32BE();
        this.buffer = this.buffer.slice(4);
        return value;
    }
    /**
     * Writes an int (uint32, big-endian) to the packet data
     * @param {number} value The uint32 written to the packet
     */
    writeUIntBE(value) {
        const buf = Buffer.alloc(4);
        buf.writeUInt32BE(value);
        this.writeBuffer(buf);
    }
    /**
     * Reads an int (uint32, little-endian) from the packet data
     * @returns {number} The uint32 read from the packet
     */
    readUIntLE() {
        if (this.buffer.byteLength < 4)
            throw new Error('Cannot readInt() as buffer is empty or too small for type');
        const value = this.buffer.readUInt32LE();
        this.buffer = this.buffer.slice(4);
        return value;
    }
    /**
     * Writes an int (uint32, little-endian) to the packet data
     * @param {number} value The uint32 written to the packet
     */
    writeUIntLE(value) {
        const buf = Buffer.alloc(4);
        buf.writeUInt32LE(value);
        this.writeBuffer(buf);
    }
    /**
     * Reads a long (int64, big-endian) from the packet data
     * @returns {number} The int64 read from the packet
     */
    readLongBE() {
        if (this.buffer.byteLength < 8)
            throw new Error('Cannot readInt() as buffer is empty or too small for type');
        const value = this.buffer.readBigInt64BE();
        this.buffer = this.buffer.slice(8);
        return value;
    }
    /**
     * Writes a long (int64, big-endian) to the packet data
     * @param {bigint} value The int64 written to the packet
     */
    writeLongBE(value) {
        const buf = Buffer.alloc(8);
        buf.writeBigInt64BE(value);
        this.writeBuffer(buf);
    }
    /**
     * Reads a long (int64, little-endian) from the packet data
     * @returns {number} The int64 read from the packet
     */
    readLongLE() {
        if (this.buffer.byteLength < 8)
            throw new Error('Cannot readInt() as buffer is empty or too small for type');
        const value = this.buffer.readBigInt64LE();
        this.buffer = this.buffer.slice(8);
        return value;
    }
    /**
     * Writes a long (int64, little-endian) to the packet data
     * @param {bigint} value The int64 written to the packet
     */
    writeLongLE(value) {
        const buf = Buffer.alloc(8);
        buf.writeBigInt64LE(value);
        this.writeBuffer(buf);
    }
    /**
     * Reads a long (uint64, big-endian) from the packet data
     * @returns {number} The uint64 read from the packet
     */
    readULongBE() {
        if (this.buffer.byteLength < 8)
            throw new Error('Cannot readInt() as buffer is empty or too small for type');
        const value = this.buffer.readBigUInt64BE();
        this.buffer = this.buffer.slice(8);
        return value;
    }
    /**
     * Writes a long (uint64, big-endian) to the packet data
     * @param {bigint} value The uint64 written to the packet
     */
    writeULongBE(value) {
        const buf = Buffer.alloc(8);
        buf.writeBigUInt64BE(value);
        this.writeBuffer(buf);
    }
    /**
     * Reads a long (uint64, little-endian) from the packet data
     * @returns {number} The uint64 read from the packet
     */
    readULongLE() {
        if (this.buffer.byteLength < 8)
            throw new Error('Cannot readInt() as buffer is empty or too small for type');
        const value = this.buffer.readBigUInt64LE();
        this.buffer = this.buffer.slice(8);
        return value;
    }
    /**
     * Writes a long (uint64, little-endian) to the packet data
     * @param {bigint} value The uint64 written to the packet
     */
    writeULongLE(value) {
        const buf = Buffer.alloc(8);
        buf.writeBigUInt64LE(value);
        this.writeBuffer(buf);
    }
    /**
     * Reads a varint from the packet data
     * @returns {number} The varint read from the packet
     */
    readVarInt() {
        let numRead = 0;
        let result = 0;
        let read, value;
        do {
            if (numRead > 4)
                throw new Error('VarInt exceeds data bounds');
            read = this.readByte();
            value = (read & 0b01111111);
            result |= (value << (7 * numRead));
            numRead++;
            if (numRead > 5)
                throw new Error('VarInt is too big');
        } while ((read & 0b10000000) != 0);
        return result;
    }
    /**
     * Writes a varint to the packet data
     * @param {number} value The varint written to the packet
     */
    writeVarInt(value) {
        do {
            let temp = value & 0b01111111;
            value >>>= 7;
            if (value != 0) {
                temp |= 0b10000000;
            }
            this.writeByte(temp);
        } while (value != 0);
    }
    /**
     * Reads a short-prefixed string from the packet data
     * @returns {string} The string read from the packet
     */
    readString() {
        const length = this.readVarInt();
        const value = this.readBytes(length);
        return this.decoder.decode(value);
    }
    /**
     * Writes a short-prefixed string to the packet data
     * @param {string} value The string written to the packet
     * @param {boolean} [writeLength=true] Write the length to the packet
     */
    writeString(value, writeLength = true) {
        if (writeLength)
            this.writeVarInt(value.length);
        this.writeBuffer(this.encoder.encode(value));
    }
    /**
     * Reads a null terminated string from the packet data
     * @returns {string} The string read from the packet
     */
    readStringNT() {
        let read, bytes = new Uint8Array();
        while ((read = this.readByte()) !== 0) {
            bytes = Uint8Array.from([...bytes, read]);
        }
        return this.decoder.decode(bytes);
    }
    /**
     * Writes a null terminated string to the packet
     * @param {string} value The string to write to the packet
     */
    writeStringNT(value) {
        this.writeBuffer(this.encoder.encode(value));
        this.writeByte(0);
    }
}
exports.default = Packet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGFja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3N0cnVjdHVyZS9QYWNrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSwrQkFBZ0Q7QUFHaEQ7OztHQUdHO0FBQ0gsTUFBTSxNQUFNO0lBQVo7UUFDQyx1Q0FBdUM7UUFDaEMsV0FBTSxHQUFXLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEMsWUFBTyxHQUFnQixJQUFJLGtCQUFXLEVBQUUsQ0FBQztRQUN6QyxZQUFPLEdBQWdCLElBQUksa0JBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQWlkekQsQ0FBQztJQS9jQTs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBTyxJQUFJLENBQUMsTUFBaUI7O1lBQ2xDLE1BQU0sTUFBTSxHQUFHLE1BQU0sTUFBTSxDQUFDLFVBQVUsRUFBRSxDQUFDO1lBRXpDLElBQUksTUFBTSxHQUFHLENBQUM7Z0JBQUUsT0FBTyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBRXBDLE1BQU0sSUFBSSxHQUFHLE1BQU0sTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUU1QyxNQUFNLE1BQU0sR0FBRyxJQUFJLE1BQU0sRUFBRSxDQUFDO1lBRTVCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBRXJCLE9BQU8sTUFBTSxDQUFDO1FBQ2YsQ0FBQztLQUFBO0lBRUQ7OztPQUdHO0lBQ0gsUUFBUTtRQUNQLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQztZQUFFLE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUV4RixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTdCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFF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