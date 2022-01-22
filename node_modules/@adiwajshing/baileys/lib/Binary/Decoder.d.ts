/// <reference types="node" />
import { WA } from './Constants';
export default class Decoder {
    buffer: Buffer;
    index: number;
    checkEOS(length: number): void;
    next(): number;
    readByte(): number;
    readStringFromChars(length: number): string;
    readBytes(n: number): Buffer;
    readInt(n: number, littleEndian?: boolean): number;
    readInt20(): number;
    unpackHex(value: number): number;
    unpackNibble(value: number): number;
    unpackByte(tag: number, value: number): number;
    readPacked8(tag: number): string;
    readRangedVarInt(min: any, max: any, description?: string): void;
    isListTag(tag: number): boolean;
    readListSize(tag: number): number;
    readString(tag: number): string;
    readAttributes(n: number): {
        [key: string]: string;
    };
    readList(tag: number): WA.Node[];
    getToken(index: number): string;
    getTokenDouble(index1: any, index2: any): string;
    readNode(): WA.Node;
    read(buffer: Buffer): WA.Node;
}
