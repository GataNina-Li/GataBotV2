/// <reference types="node" />
import TCPSocket from './TCPSocket';
/**
 * A packet class with utilities for reading and writing from a stream.
 * @class
 */
declare class Packet {
    /** The buffered data in the packet. */
    buffer: Buffer;
    private encoder;
    private decoder;
    /**
     * Automatically read a packet from a stream using the Minecraft 1.7+ format.
     * @param {TCPSocket} socket The TCP socket to read data from
     * @returns {Promise<Packet>} The buffered packet with the data
     * @async
     */
    static from(socket: TCPSocket): Promise<Packet>;
    /**
     * Reads a byte from the packet data
     * @returns {number} The byte read from the packet
     */
    readByte(): number;
    /**
     * Reads bytes from the packet data
     * @returns {Buffer} The bytes read from the packet
     */
    readBytes(length: number): Buffer;
    /**
    * Write bytes to the packet data
    * @param {...number} values The bytes to write to the packet
    */
    writeByte(...values: number[]): void;
    /**
    * Write bytes to the packet data
    * @param {Buffer} data The bytes to write to the packet
    */
    writeBuffer(data: Buffer | Uint8Array): void;
    /**
     * Reads a short (int16, big-endian) from the packet data
     * @returns {number} The int16 read from the packet
     */
    readShortBE(): number;
    /**
     * Writes a short (int16, big-endian) to the packet data
     * @param {number} value The int16 written to the packet
     */
    writeShortBE(value: number): void;
    /**
     * Reads a short (int16, little-endian) from the packet data
     * @returns {number} The int16 read from the packet
     */
    readShortLE(): number;
    /**
     * Writes a short (int16, little-endian) to the packet data
     * @param {number} value The int16 written to the packet
     */
    writeShortLE(value: number): void;
    /**
     * Reads a short (uint16, big-endian) from the packet data
     * @returns {number} The uint16 read from the packet
     */
    readUShortBE(): number;
    /**
     * Writes a short (uint16, big-endian) to the packet data
     * @param {number} value The uint16 written to the packet
     */
    writeUShortBE(value: number): void;
    /**
     * Reads a short (uint16, little-endian) from the packet data
     * @returns {number} The uint16 read from the packet
     */
    readUShortLE(): number;
    /**
     * Writes a short (uint16, little-endian) to the packet data
     * @returns {number} The uint16 written to the packet
     */
    writeUShortLE(value: number): void;
    /**
     * Reads an int (int32, big-endian) from the packet data
     * @returns {number} The int32 read from the packet
     */
    readIntBE(): number;
    /**
     * Writes an int (int32, big-endian) to the packet data
     * @param {number} value The int32 written to the packet
     */
    writeIntBE(value: number): void;
    /**
     * Reads an int (int32, little-endian) from the packet data
     * @returns {number} The int32 read from the packet
     */
    readIntLE(): number;
    /**
     * Writes an int (int32, little-endian) to the packet data
     * @param {number} value The int32 written to the packet
     */
    writeIntLE(value: number): void;
    /**
     * Reads an int (uint32, big-endian) from the packet data
     * @returns {number} The uint32 read from the packet
     */
    readUIntBE(): number;
    /**
     * Writes an int (uint32, big-endian) to the packet data
     * @param {number} value The uint32 written to the packet
     */
    writeUIntBE(value: number): void;
    /**
     * Reads an int (uint32, little-endian) from the packet data
     * @returns {number} The uint32 read from the packet
     */
    readUIntLE(): number;
    /**
     * Writes an int (uint32, little-endian) to the packet data
     * @param {number} value The uint32 written to the packet
     */
    writeUIntLE(value: number): void;
    /**
     * Reads a long (int64, big-endian) from the packet data
     * @returns {number} The int64 read from the packet
     */
    readLongBE(): bigint;
    /**
     * Writes a long (int64, big-endian) to the packet data
     * @param {bigint} value The int64 written to the packet
     */
    writeLongBE(value: bigint): void;
    /**
     * Reads a long (int64, little-endian) from the packet data
     * @returns {number} The int64 read from the packet
     */
    readLongLE(): bigint;
    /**
     * Writes a long (int64, little-endian) to the packet data
     * @param {bigint} value The int64 written to the packet
     */
    writeLongLE(value: bigint): void;
    /**
     * Reads a long (uint64, big-endian) from the packet data
     * @returns {number} The uint64 read from the packet
     */
    readULongBE(): bigint;
    /**
     * Writes a long (uint64, big-endian) to the packet data
     * @param {bigint} value The uint64 written to the packet
     */
    writeULongBE(value: bigint): void;
    /**
     * Reads a long (uint64, little-endian) from the packet data
     * @returns {number} The uint64 read from the packet
     */
    readULongLE(): bigint;
    /**
     * Writes a long (uint64, little-endian) to the packet data
     * @param {bigint} value The uint64 written to the packet
     */
    writeULongLE(value: bigint): void;
    /**
     * Reads a varint from the packet data
     * @returns {number} The varint read from the packet
     */
    readVarInt(): number;
    /**
     * Writes a varint to the packet data
     * @param {number} value The varint written to the packet
     */
    writeVarInt(value: number): void;
    /**
     * Reads a short-prefixed string from the packet data
     * @returns {string} The string read from the packet
     */
    readString(): string;
    /**
     * Writes a short-prefixed string to the packet data
     * @param {string} value The string written to the packet
     * @param {boolean} [writeLength=true] Write the length to the packet
     */
    writeString(value: string, writeLength?: boolean): void;
    /**
     * Reads a null terminated string from the packet data
     * @returns {string} The string read from the packet
     */
    readStringNT(): string;
    /**
     * Writes a null terminated string to the packet
     * @param {string} value The string to write to the packet
     */
    writeStringNT(value: string): void;
}
export default Packet;
