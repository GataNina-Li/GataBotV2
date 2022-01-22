import { proto } from '../../WAMessage/WAMessage';
export declare namespace WA {
    const Tags: {
        LIST_EMPTY: number;
        STREAM_END: number;
        DICTIONARY_0: number;
        DICTIONARY_1: number;
        DICTIONARY_2: number;
        DICTIONARY_3: number;
        LIST_8: number;
        LIST_16: number;
        JID_PAIR: number;
        HEX_8: number;
        BINARY_8: number;
        BINARY_20: number;
        BINARY_32: number;
        NIBBLE_8: number;
        SINGLE_BYTE_MAX: number;
        PACKED_MAX: number;
    };
    const DoubleByteTokens: any[];
    const SingleByteTokens: string[];
    const Message: typeof proto.WebMessageInfo;
    type NodeAttributes = {
        [key: string]: string;
    } | string | null;
    type NodeData = Array<Node> | any | null;
    type Node = [string, NodeAttributes, NodeData];
}
