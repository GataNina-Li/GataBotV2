/// <reference types="node" />
import { WA } from './Constants';
export default class Encoder {
    data: number[];
    pushByte(value: number): void;
    pushInt(value: number, n: number, littleEndian?: boolean): void;
    pushInt20(value: number): void;
    pushBytes(bytes: Uint8Array | Buffer | number[]): void;
    writeByteLength(length: number): void;
    writeStringRaw(string: string): void;
    writeJid(left: string, right: string): void;
    writeToken(token: number): void;
    writeString(token: string, i?: boolean): void;
    writeAttributes(attrs: Record<string, string> | string, keys: string[]): void;
    writeListStart(listSize: number): void;
    writeChildren(children: string | Array<WA.Node> | Buffer | Object): void;
    getValidKeys(obj: Object): string[];
    writeNode(node: WA.Node): void;
    write(data: any): Buffer;
}
