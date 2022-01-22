"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAConnection = void 0;
const fs = __importStar(require("fs"));
const Utils = __importStar(require("./Utils"));
const Encoder_1 = __importDefault(require("../Binary/Encoder"));
const Decoder_1 = __importDefault(require("../Binary/Decoder"));
const got_1 = __importDefault(require("got"));
const Constants_1 = require("./Constants");
const events_1 = require("events");
const keyed_db_1 = __importDefault(require("@adiwajshing/keyed-db"));
const http_1 = require("http");
const pino_1 = __importDefault(require("pino"));
const logger = pino_1.default({ prettyPrint: { levelFirst: true, ignore: 'hostname', translateTime: true }, prettifier: require('pino-pretty') });
class WAConnection extends events_1.EventEmitter {
    constructor() {
        super(...arguments);
        /** The version of WhatsApp Web we're telling the servers we are */
        this.version = [2, 2142, 12];
        /** The Browser we're telling the WhatsApp Web servers we are */
        this.browserDescription = Utils.Browsers.baileys('Chrome');
        /** Should requests be queued when the connection breaks in between; if 0, then an error will be thrown */
        this.pendingRequestTimeoutMs = null;
        /** The connection state */
        this.state = 'close';
        this.connectOptions = {
            maxIdleTimeMs: 60000,
            maxRetries: 10,
            connectCooldownMs: 4000,
            phoneResponseTime: 15000,
            maxQueryResponseTime: 10000,
            alwaysUseTakeover: true,
            queryChatsTillReceived: true,
            logQR: true
        };
        /** When to auto-reconnect */
        this.autoReconnect = Constants_1.ReconnectMode.onConnectionLost;
        /** Whether the phone is connected */
        this.phoneConnected = false;
        /** key to use to order chats */
        this.chatOrderingKey = Utils.waChatKey(false);
        this.logger = logger.child({ class: 'Baileys' });
        /** log messages */
        this.shouldLogMessages = false;
        this.messageLog = [];
        this.maxCachedMessages = 50;
        this.chats = new keyed_db_1.default(Utils.waChatKey(false), value => value.jid);
        this.contacts = {};
        this.blocklist = [];
        this.msgCount = 0;
        this.encoder = new Encoder_1.default();
        this.decoder = new Decoder_1.default();
        this.phoneCheckListeners = 0;
        this.referenceDate = new Date(); // used for generating tags
        this.lastSeen = null; // last keep alive received
        this.lastDisconnectTime = null;
        this.connectionDebounceTimeout = Utils.debouncedTimeout(1000, () => this.state === 'connecting' && this.endConnection(Constants_1.DisconnectReason.timedOut));
        // timeout to know when we're done recieving messages
        this.messagesDebounceTimeout = Utils.debouncedTimeout(2000);
        // ping chats till recieved
        this.chatsDebounceTimeout = Utils.debouncedTimeout(10000);
        /**
         * Does a fetch request with the configuration of the connection
         */
        this.fetchRequest = (endpoint, method = 'GET', body, agent, headers, followRedirect = true) => (got_1.default(endpoint, {
            method,
            body,
            followRedirect,
            headers: { Origin: Constants_1.DEFAULT_ORIGIN, ...(headers || {}) },
            agent: { https: agent || this.connectOptions.fetchAgent }
        }));
    }
    /**
     * Connect to WhatsAppWeb
     * @param options the connect options
     */
    async connect() {
        return null;
    }
    async unexpectedDisconnect(error) {
        if (this.state === 'open') {
            const willReconnect = (this.autoReconnect === Constants_1.ReconnectMode.onAllErrors ||
                (this.autoReconnect === Constants_1.ReconnectMode.onConnectionLost && error !== Constants_1.DisconnectReason.replaced)) &&
                error !== Constants_1.DisconnectReason.invalidSession; // do not reconnect if credentials have been invalidated
            this.closeInternal(error, willReconnect);
            willReconnect && (this.connect()
                .catch(err => { }) // prevent unhandled exeception
            );
        }
        else {
            this.endConnection(error);
        }
    }
    /**
     * base 64 encode the authentication credentials and return them
     * these can then be used to login again by passing the object to the connect () function.
     * @see connect () in WhatsAppWeb.Session
     */
    base64EncodedAuthInfo() {
        return {
            clientID: this.authInfo.clientID,
            serverToken: this.authInfo.serverToken,
            clientToken: this.authInfo.clientToken,
            encKey: this.authInfo.encKey.toString('base64'),
            macKey: this.authInfo.macKey.toString('base64'),
        };
    }
    /** Can you login to WA without scanning the QR */
    canLogin() {
        var _a, _b;
        return !!((_a = this.authInfo) === null || _a === void 0 ? void 0 : _a.encKey) && !!((_b = this.authInfo) === null || _b === void 0 ? void 0 : _b.macKey);
    }
    /** Clear authentication info so a new connection can be created */
    clearAuthInfo() {
        this.authInfo = null;
        return this;
    }
    /**
     * Load in the authentication credentials
     * @param authInfo the authentication credentials or file path to auth credentials
     */
    loadAuthInfo(authInfo) {
        if (!authInfo)
            throw new Error('given authInfo is null');
        if (typeof authInfo === 'string') {
            this.logger.info(`loading authentication credentials from ${authInfo}`);
            const file = fs.readFileSync(authInfo, { encoding: 'utf-8' }); // load a closed session back if it exists
            authInfo = JSON.parse(file);
        }
        if ('clientID' in authInfo) {
            this.authInfo = {
                clientID: authInfo.clientID,
                serverToken: authInfo.serverToken,
                clientToken: authInfo.clientToken,
                encKey: Buffer.isBuffer(authInfo.encKey) ? authInfo.encKey : Buffer.from(authInfo.encKey, 'base64'),
                macKey: Buffer.isBuffer(authInfo.macKey) ? authInfo.macKey : Buffer.from(authInfo.macKey, 'base64'),
            };
        }
        else {
            const secretBundle = typeof authInfo.WASecretBundle === 'string' ? JSON.parse(authInfo.WASecretBundle) : authInfo.WASecretBundle;
            this.authInfo = {
                clientID: authInfo.WABrowserId.replace(/\"/g, ''),
                serverToken: authInfo.WAToken2.replace(/\"/g, ''),
                clientToken: authInfo.WAToken1.replace(/\"/g, ''),
                encKey: Buffer.from(secretBundle.encKey, 'base64'),
                macKey: Buffer.from(secretBundle.macKey, 'base64'), // decode from base64
            };
        }
        return this;
    }
    /**
     * Wait for a message with a certain tag to be received
     * @param tag the message tag to await
     * @param json query that was sent
     * @param timeoutMs timeout after which the promise will reject
     */
    async waitForMessage(tag, requiresPhoneConnection, timeoutMs) {
        let onRecv;
        let onErr;
        let cancelPhoneChecker;
        if (requiresPhoneConnection) {
            this.startPhoneCheckInterval();
            cancelPhoneChecker = this.exitQueryIfResponseNotExpected(tag, err => onErr(err));
        }
        try {
            const result = await Utils.promiseTimeout(timeoutMs, (resolve, reject) => {
                onRecv = resolve;
                onErr = ({ reason, status }) => reject(new Constants_1.BaileysError(reason, { status }));
                this.on(`TAG:${tag}`, onRecv);
                this.on('ws-close', onErr); // if the socket closes, you'll never receive the message
            });
            return result;
        }
        finally {
            requiresPhoneConnection && this.clearPhoneCheckInterval();
            this.off(`TAG:${tag}`, onRecv);
            this.off(`ws-close`, onErr);
            cancelPhoneChecker && cancelPhoneChecker();
        }
    }
    /** Generic function for action, set queries */
    async setQuery(nodes, binaryTags = [Constants_1.WAMetric.group, Constants_1.WAFlag.ignore], tag) {
        const json = ['action', { epoch: this.msgCount.toString(), type: 'set' }, nodes];
        const result = await this.query({ json, binaryTags, tag, expect200: true, requiresPhoneConnection: true });
        return result;
    }
    /**
     * Query something from the WhatsApp servers
     * @param json the query itself
     * @param binaryTags the tags to attach if the query is supposed to be sent encoded in binary
     * @param timeoutMs timeout after which the query will be failed (set to null to disable a timeout)
     * @param tag the tag to attach to the message
     */
    async query(q) {
        let { json, binaryTags, tag, timeoutMs, expect200, waitForOpen, longTag, requiresPhoneConnection, startDebouncedTimeout, maxRetries } = q;
        requiresPhoneConnection = requiresPhoneConnection !== false;
        waitForOpen = waitForOpen !== false;
        let triesLeft = maxRetries || 2;
        tag = tag || this.generateMessageTag(longTag);
        while (triesLeft >= 0) {
            if (waitForOpen)
                await this.waitForConnection();
            const promise = this.waitForMessage(tag, requiresPhoneConnection, timeoutMs);
            if (this.logger.level === 'trace') {
                this.logger.trace({ fromMe: true }, `${tag},${JSON.stringify(json)}`);
            }
            if (binaryTags)
                tag = await this.sendBinary(json, binaryTags, tag);
            else
                tag = await this.sendJSON(json, tag);
            try {
                const response = await promise;
                if (expect200 && response.status && Math.floor(+response.status / 100) !== 2) {
                    const message = http_1.STATUS_CODES[response.status] || 'unknown';
                    throw new Constants_1.BaileysError(`Unexpected status in '${json[0] || 'query'}': ${http_1.STATUS_CODES[response.status]}(${response.status})`, { query: json, message, status: response.status });
                }
                if (startDebouncedTimeout) {
                    this.connectionDebounceTimeout.start();
                }
                return response;
            }
            catch (error) {
                if (triesLeft === 0) {
                    throw error;
                }
                // read here: http://getstatuscode.com/599
                if (error.status === 599) {
                    this.unexpectedDisconnect(Constants_1.DisconnectReason.badSession);
                }
                else if ((error.message === 'close' || error.message === 'lost') &&
                    waitForOpen &&
                    this.state !== 'close' &&
                    (this.pendingRequestTimeoutMs === null ||
                        this.pendingRequestTimeoutMs > 0)) {
                    // nothing here
                }
                else
                    throw error;
                triesLeft -= 1;
                this.logger.debug(`query failed due to ${error}, retrying...`);
            }
        }
    }
    exitQueryIfResponseNotExpected(tag, cancel) {
        let timeout;
        const listener = ({ connected }) => {
            if (connected) {
                timeout = setTimeout(() => {
                    this.logger.info({ tag }, `cancelling wait for message as a response is no longer expected from the phone`);
                    cancel({ reason: 'Not expecting a response', status: 422 });
                }, this.connectOptions.maxQueryResponseTime);
                this.off('connection-phone-change', listener);
            }
        };
        this.on('connection-phone-change', listener);
        return () => {
            this.off('connection-phone-change', listener);
            timeout && clearTimeout(timeout);
        };
    }
    /** interval is started when a query takes too long to respond */
    startPhoneCheckInterval() {
        this.phoneCheckListeners += 1;
        if (!this.phoneCheckInterval) {
            // if its been a long time and we haven't heard back from WA, send a ping
            this.phoneCheckInterval = setInterval(() => {
                if (!this.conn)
                    return; // if disconnected, then don't do anything
                this.logger.info('checking phone connection...');
                this.sendAdminTest();
                if (this.phoneConnected !== false) {
                    this.phoneConnected = false;
                    this.emit('connection-phone-change', { connected: false });
                }
            }, this.connectOptions.phoneResponseTime);
        }
    }
    clearPhoneCheckInterval() {
        this.phoneCheckListeners -= 1;
        if (this.phoneCheckListeners <= 0) {
            this.phoneCheckInterval && clearInterval(this.phoneCheckInterval);
            this.phoneCheckInterval = undefined;
            this.phoneCheckListeners = 0;
        }
    }
    /** checks for phone connection */
    async sendAdminTest() {
        return this.sendJSON(['admin', 'test']);
    }
    /**
     * Send a binary encoded message
     * @param json the message to encode & send
     * @param tags the binary tags to tell WhatsApp what the message is all about
     * @param tag the tag to attach to the message
     * @return the message tag
     */
    async sendBinary(json, tags, tag = null, longTag = false) {
        const binary = this.encoder.write(json); // encode the JSON to the WhatsApp binary format
        let buff = Utils.aesEncrypt(binary, this.authInfo.encKey); // encrypt it using AES and our encKey
        const sign = Utils.hmacSign(buff, this.authInfo.macKey); // sign the message using HMAC and our macKey
        tag = tag || this.generateMessageTag(longTag);
        if (this.shouldLogMessages)
            this.messageLog.push({ tag, json: JSON.stringify(json), fromMe: true, binaryTags: tags });
        buff = Buffer.concat([
            Buffer.from(tag + ','),
            Buffer.from(tags),
            sign,
            buff, // the actual encrypted buffer
        ]);
        await this.send(buff); // send it off
        return tag;
    }
    /**
     * Send a plain JSON message to the WhatsApp servers
     * @param json the message to send
     * @param tag the tag to attach to the message
     * @returns the message tag
     */
    async sendJSON(json, tag = null, longTag = false) {
        tag = tag || this.generateMessageTag(longTag);
        if (this.shouldLogMessages)
            this.messageLog.push({ tag, json: JSON.stringify(json), fromMe: true });
        await this.send(`${tag},${JSON.stringify(json)}`);
        return tag;
    }
    /** Send some message to the WhatsApp servers */
    async send(m) {
        this.conn.send(m);
    }
    async waitForConnection() {
        if (this.state === 'open')
            return;
        let onOpen;
        let onClose;
        if (this.pendingRequestTimeoutMs !== null && this.pendingRequestTimeoutMs <= 0) {
            throw new Constants_1.BaileysError(Constants_1.DisconnectReason.close, { status: 428 });
        }
        await (Utils.promiseTimeout(this.pendingRequestTimeoutMs, (resolve, reject) => {
            onClose = ({ reason }) => {
                if (reason === Constants_1.DisconnectReason.invalidSession || reason === Constants_1.DisconnectReason.intentional) {
                    reject(new Error(reason));
                }
            };
            onOpen = resolve;
            this.on('close', onClose);
            this.on('open', onOpen);
        })
            .finally(() => {
            this.off('open', onOpen);
            this.off('close', onClose);
        }));
    }
    /**
     * Disconnect from the phone. Your auth credentials become invalid after sending a disconnect request.
     * @see close() if you just want to close the connection
     */
    async logout() {
        this.authInfo = null;
        if (this.state === 'open') {
            //throw new Error("You're not even connected, you can't log out")
            await new Promise(resolve => this.conn.send('goodbye,["admin","Conn","disconnect"]', null, resolve));
        }
        this.user = undefined;
        this.chats.clear();
        this.contacts = {};
        this.close();
    }
    /** Close the connection to WhatsApp Web */
    close() {
        this.closeInternal(Constants_1.DisconnectReason.intentional);
    }
    closeInternal(reason, isReconnecting = false) {
        this.logger.info(`closed connection, reason ${reason}${isReconnecting ? ', reconnecting in a few seconds...' : ''}`);
        this.state = 'close';
        this.phoneConnected = false;
        this.lastDisconnectReason = reason;
        this.lastDisconnectTime = new Date();
        this.endConnection(reason);
        // reconnecting if the timeout is active for the reconnect loop
        this.emit('close', { reason, isReconnecting });
    }
    endConnection(reason) {
        var _a, _b, _c, _d, _e;
        (_a = this.conn) === null || _a === void 0 ? void 0 : _a.removeAllListeners('close');
        (_b = this.conn) === null || _b === void 0 ? void 0 : _b.removeAllListeners('error');
        (_c = this.conn) === null || _c === void 0 ? void 0 : _c.removeAllListeners('open');
        (_d = this.conn) === null || _d === void 0 ? void 0 : _d.removeAllListeners('message');
        this.initTimeout && clearTimeout(this.initTimeout);
        this.connectionDebounceTimeout.cancel();
        this.messagesDebounceTimeout.cancel();
        this.chatsDebounceTimeout.cancel();
        this.keepAliveReq && clearInterval(this.keepAliveReq);
        this.phoneCheckListeners = 0;
        this.clearPhoneCheckInterval();
        this.emit('ws-close', { reason });
        try {
            (_e = this.conn) === null || _e === void 0 ? void 0 : _e.close();
            //this.conn?.terminate()
        }
        catch (_f) {
        }
        this.conn = undefined;
        this.lastSeen = undefined;
        this.msgCount = 0;
    }
    generateMessageTag(longTag = false) {
        const seconds = Utils.unixTimestampSeconds(this.referenceDate);
        const tag = `${longTag ? seconds : (seconds % 1000)}.--${this.msgCount}`;
        this.msgCount += 1; // increment message count, it makes the 'epoch' field when sending binary messages
        return tag;
    }
}
exports.WAConnection = WAConnection;
