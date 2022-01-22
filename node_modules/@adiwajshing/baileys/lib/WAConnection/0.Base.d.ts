/// <reference types="node" />
import WS from 'ws';
import Encoder from '../Binary/Encoder';
import Decoder from '../Binary/Decoder';
import { Method } from 'got';
import { AuthenticationCredentials, WAUser, WANode, WATag, DisconnectReason, WAConnectionState, AnyAuthenticationCredentials, WAContact, WAQuery, ReconnectMode, WAConnectOptions, MediaConnInfo } from './Constants';
import { EventEmitter } from 'events';
import KeyedDB from '@adiwajshing/keyed-db';
import { Agent } from 'https';
import pino from 'pino';
export declare class WAConnection extends EventEmitter {
    /** The version of WhatsApp Web we're telling the servers we are */
    version: [number, number, number];
    /** The Browser we're telling the WhatsApp Web servers we are */
    browserDescription: [string, string, string];
    /** Metadata like WhatsApp id, name set on WhatsApp etc. */
    user: WAUser;
    /** Should requests be queued when the connection breaks in between; if 0, then an error will be thrown */
    pendingRequestTimeoutMs: number;
    /** The connection state */
    state: WAConnectionState;
    connectOptions: WAConnectOptions;
    /** When to auto-reconnect */
    autoReconnect: ReconnectMode;
    /** Whether the phone is connected */
    phoneConnected: boolean;
    /** key to use to order chats */
    chatOrderingKey: {
        key: (c: import("./Constants").WAChat) => string;
        compare: (k1: string, k2: string) => number;
    };
    logger: pino.Logger;
    /** log messages */
    shouldLogMessages: boolean;
    messageLog: {
        tag: string;
        json: string;
        fromMe: boolean;
        binaryTags?: any[];
    }[];
    maxCachedMessages: number;
    lastChatsReceived: Date;
    chats: KeyedDB<import("./Constants").WAChat, string>;
    contacts: {
        [k: string]: WAContact;
    };
    blocklist: string[];
    /** Data structure of tokens & IDs used to establish one's identiy to WhatsApp Web */
    protected authInfo: AuthenticationCredentials;
    /** Curve keys to initially authenticate */
    protected curveKeys: {
        private: Uint8Array;
        public: Uint8Array;
    };
    /** The websocket connection */
    protected conn: WS;
    protected msgCount: number;
    protected keepAliveReq: NodeJS.Timeout;
    protected encoder: Encoder;
    protected decoder: Decoder;
    protected phoneCheckInterval: any;
    protected phoneCheckListeners: number;
    protected referenceDate: Date;
    protected lastSeen: Date;
    protected initTimeout: NodeJS.Timeout;
    protected lastDisconnectTime: Date;
    protected lastDisconnectReason: DisconnectReason;
    protected mediaConn: MediaConnInfo;
    protected connectionDebounceTimeout: {
        start: (newIntervalMs?: number, newTask?: () => void) => void;
        cancel: () => void;
        setTask: (newTask: () => void) => () => void;
        setInterval: (newInterval: number) => number;
    };
    protected messagesDebounceTimeout: {
        start: (newIntervalMs?: number, newTask?: () => void) => void;
        cancel: () => void;
        setTask: (newTask: () => void) => () => void;
        setInterval: (newInterval: number) => number;
    };
    protected chatsDebounceTimeout: {
        start: (newIntervalMs?: number, newTask?: () => void) => void;
        cancel: () => void;
        setTask: (newTask: () => void) => () => void;
        setInterval: (newInterval: number) => number;
    };
    /**
     * Connect to WhatsAppWeb
     * @param options the connect options
     */
    connect(): Promise<any>;
    unexpectedDisconnect(error: DisconnectReason): Promise<void>;
    /**
     * base 64 encode the authentication credentials and return them
     * these can then be used to login again by passing the object to the connect () function.
     * @see connect () in WhatsAppWeb.Session
     */
    base64EncodedAuthInfo(): {
        clientID: string;
        serverToken: string;
        clientToken: string;
        encKey: string;
        macKey: string;
    };
    /** Can you login to WA without scanning the QR */
    canLogin(): boolean;
    /** Clear authentication info so a new connection can be created */
    clearAuthInfo(): this;
    /**
     * Load in the authentication credentials
     * @param authInfo the authentication credentials or file path to auth credentials
     */
    loadAuthInfo(authInfo: AnyAuthenticationCredentials | string): this;
    /**
     * Wait for a message with a certain tag to be received
     * @param tag the message tag to await
     * @param json query that was sent
     * @param timeoutMs timeout after which the promise will reject
     */
    waitForMessage(tag: string, requiresPhoneConnection: boolean, timeoutMs?: number): Promise<any>;
    /** Generic function for action, set queries */
    setQuery(nodes: WANode[], binaryTags?: WATag, tag?: string): Promise<{
        status: number;
    }>;
    /**
     * Query something from the WhatsApp servers
     * @param json the query itself
     * @param binaryTags the tags to attach if the query is supposed to be sent encoded in binary
     * @param timeoutMs timeout after which the query will be failed (set to null to disable a timeout)
     * @param tag the tag to attach to the message
     */
    query(q: WAQuery): Promise<any>;
    protected exitQueryIfResponseNotExpected(tag: string, cancel: ({ reason, status }: {
        reason: any;
        status: any;
    }) => void): () => void;
    /** interval is started when a query takes too long to respond */
    protected startPhoneCheckInterval(): void;
    protected clearPhoneCheckInterval(): void;
    /** checks for phone connection */
    protected sendAdminTest(): Promise<string>;
    /**
     * Send a binary encoded message
     * @param json the message to encode & send
     * @param tags the binary tags to tell WhatsApp what the message is all about
     * @param tag the tag to attach to the message
     * @return the message tag
     */
    protected sendBinary(json: WANode, tags: WATag, tag?: string, longTag?: boolean): Promise<string>;
    /**
     * Send a plain JSON message to the WhatsApp servers
     * @param json the message to send
     * @param tag the tag to attach to the message
     * @returns the message tag
     */
    protected sendJSON(json: any[] | WANode, tag?: string, longTag?: boolean): Promise<string>;
    /** Send some message to the WhatsApp servers */
    protected send(m: any): Promise<void>;
    protected waitForConnection(): Promise<void>;
    /**
     * Disconnect from the phone. Your auth credentials become invalid after sending a disconnect request.
     * @see close() if you just want to close the connection
     */
    logout(): Promise<void>;
    /** Close the connection to WhatsApp Web */
    close(): void;
    protected closeInternal(reason?: DisconnectReason, isReconnecting?: boolean): void;
    protected endConnection(reason: DisconnectReason): void;
    /**
     * Does a fetch request with the configuration of the connection
     */
    protected fetchRequest: (endpoint: string, method?: Method, body?: any, agent?: Agent, headers?: {
        [k: string]: string;
    }, followRedirect?: boolean) => import("got").CancelableRequest<import("got").Response<string>>;
    generateMessageTag(longTag?: boolean): string;
}
