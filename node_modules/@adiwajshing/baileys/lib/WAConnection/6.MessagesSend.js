"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAConnection = void 0;
const _5_User_1 = require("./5.User");
const fs_1 = require("fs");
const Constants_1 = require("./Constants");
const Utils_1 = require("./Utils");
const Mutex_1 = require("./Mutex");
class WAConnection extends _5_User_1.WAConnection {
    /**
     * Send a message to the given ID (can be group, single, or broadcast)
     * @param id the id to send to
     * @param message the message can be a buffer, plain string, location message, extended text message
     * @param type type of message
     * @param options Extra options
     */
    async sendMessage(id, message, type, options = {}) {
        const waMessage = await this.prepareMessage(id, message, type, options);
        await this.relayWAMessage(waMessage, { waitForAck: options.waitForAck !== false });
        return waMessage;
    }
    /**
     * Send a list message
     * @param id the id to send to
     * @param button the optional button text, title and description button
     * @param rows the rows of sections list message
     */
    async sendListMessage(id, button, rows = []) {
        let messageList = Constants_1.WAMessageProto.Message.fromObject({
            listMessage: Constants_1.WAMessageProto.ListMessage.fromObject({
                buttonText: button.buttonText,
                description: button.description,
                listType: 1,
                sections: [
                    {
                        title: button.title,
                        rows: [...rows]
                    }
                ]
            })
        });
        let waMessageList = await this.prepareMessageFromContent(id, messageList, {});
        await this.relayWAMessage(waMessageList, { waitForAck: true });
        return waMessageList;
    }
    /** Prepares a message for sending via sendWAMessage () */
    async prepareMessage(id, message, type, options = {}) {
        const content = await this.prepareMessageContent(message, type, options);
        const preparedMessage = this.prepareMessageFromContent(id, content, options);
        return preparedMessage;
    }
    /**
     * Toggles disappearing messages for the given chat
     *
     * @param jid the chat to toggle
     * @param ephemeralExpiration 0 to disable, enter any positive number to enable disappearing messages for the specified duration;
     * For the default see WA_DEFAULT_EPHEMERAL
     */
    async toggleDisappearingMessages(jid, ephemeralExpiration, opts = { waitForAck: true }) {
        if (Utils_1.isGroupID(jid)) {
            const tag = this.generateMessageTag(true);
            await this.setQuery([
                [
                    'group',
                    { id: tag, jid, type: 'prop', author: this.user.jid },
                    [['ephemeral', { value: ephemeralExpiration.toString() }, null]]
                ]
            ], [Constants_1.WAMetric.group, Constants_1.WAFlag.other], tag);
        }
        else {
            const message = this.prepareMessageFromContent(jid, this.prepareDisappearingMessageSettingContent(ephemeralExpiration), {});
            await this.relayWAMessage(message, opts);
        }
    }
    /** Prepares the message content */
    async prepareMessageContent(message, type, options) {
        let m = {};
        switch (type) {
            case Constants_1.MessageType.text:
            case Constants_1.MessageType.extendedText:
                if (typeof message === 'string')
                    message = { text: message };
                if ('text' in message) {
                    if (options.detectLinks !== false && message.text.match(Constants_1.URL_REGEX)) {
                        try {
                            message = await this.generateLinkPreview(message.text);
                        }
                        catch (error) { // ignore if fails
                            this.logger.trace(`failed to generate link preview for message '${message.text}': ${error}`);
                        }
                    }
                    m.extendedTextMessage = Constants_1.WAMessageProto.ExtendedTextMessage.fromObject(message);
                }
                else {
                    throw new Constants_1.BaileysError('message needs to be a string or object with property \'text\'', message);
                }
                break;
            case Constants_1.MessageType.location:
            case Constants_1.MessageType.liveLocation:
                m.locationMessage = Constants_1.WAMessageProto.LocationMessage.fromObject(message);
                break;
            case Constants_1.MessageType.contact:
                m.contactMessage = Constants_1.WAMessageProto.ContactMessage.fromObject(message);
                break;
            case Constants_1.MessageType.contactsArray:
                m.contactsArrayMessage = Constants_1.WAMessageProto.ContactsArrayMessage.fromObject(message);
                break;
            case Constants_1.MessageType.groupInviteMessage:
                m.groupInviteMessage = Constants_1.WAMessageProto.GroupInviteMessage.fromObject(message);
                break;
            case Constants_1.MessageType.listMessage:
                m.listMessage = Constants_1.WAMessageProto.ListMessage.fromObject(message);
                break;
            case Constants_1.MessageType.buttonsMessage:
                m.buttonsMessage = Constants_1.WAMessageProto.ButtonsMessage.fromObject(message);
                break;
            case Constants_1.MessageType.image:
            case Constants_1.MessageType.sticker:
            case Constants_1.MessageType.document:
            case Constants_1.MessageType.video:
            case Constants_1.MessageType.audio:
                m = await this.prepareMessageMedia(message, type, options);
                break;
        }
        return Constants_1.WAMessageProto.Message.fromObject(m);
    }
    prepareDisappearingMessageSettingContent(ephemeralExpiration) {
        ephemeralExpiration = ephemeralExpiration || 0;
        const content = {
            ephemeralMessage: {
                message: {
                    protocolMessage: {
                        type: Constants_1.WAMessageProto.ProtocolMessage.ProtocolMessageType.EPHEMERAL_SETTING,
                        ephemeralExpiration
                    }
                }
            }
        };
        return Constants_1.WAMessageProto.Message.fromObject(content);
    }
    /** Prepare a media message for sending */
    async prepareMessageMedia(media, mediaType, options = {}) {
        if (mediaType === Constants_1.MessageType.document && !options.mimetype) {
            throw new Error('mimetype required to send a document');
        }
        if (mediaType === Constants_1.MessageType.sticker && options.caption) {
            throw new Error('cannot send a caption with a sticker');
        }
        if (!(mediaType === Constants_1.MessageType.image || mediaType === Constants_1.MessageType.video) && options.viewOnce) {
            throw new Error(`cannot send a ${mediaType} as a viewOnceMessage`);
        }
        if (!options.mimetype) {
            options.mimetype = Constants_1.MimetypeMap[mediaType];
        }
        let isGIF = false;
        if (options.mimetype === Constants_1.Mimetype.gif) {
            isGIF = true;
            options.mimetype = Constants_1.MimetypeMap[Constants_1.MessageType.video];
        }
        const requiresDurationComputation = mediaType === Constants_1.MessageType.audio && !options.duration;
        const requiresThumbnailComputation = (mediaType === Constants_1.MessageType.image || mediaType === Constants_1.MessageType.video) && !('thumbnail' in options);
        const requiresOriginalForSomeProcessing = requiresDurationComputation || requiresThumbnailComputation;
        const { mediaKey, encBodyPath, bodyPath, fileEncSha256, fileSha256, fileLength, didSaveToTmpPath } = await Utils_1.encryptedStream(media, mediaType, requiresOriginalForSomeProcessing);
        // url safe Base64 encode the SHA256 hash of the body
        const fileEncSha256B64 = encodeURIComponent(fileEncSha256.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/\=+$/, ''));
        if (requiresThumbnailComputation) {
            await Utils_1.generateThumbnail(bodyPath, mediaType, options);
        }
        if (requiresDurationComputation) {
            try {
                options.duration = await Utils_1.getAudioDuration(bodyPath);
            }
            catch (error) {
                this.logger.debug({ error }, 'failed to obtain audio duration: ' + error.message);
            }
        }
        // send a query JSON to obtain the url & auth token to upload our media
        let json = await this.refreshMediaConn(options.forceNewMediaOptions);
        let mediaUrl;
        for (let host of json.hosts) {
            const auth = encodeURIComponent(json.auth); // the auth token
            const url = `https://${host.hostname}${Constants_1.MediaPathMap[mediaType]}/${fileEncSha256B64}?auth=${auth}&token=${fileEncSha256B64}`;
            try {
                const { body: responseText } = await this.fetchRequest(url, 'POST', fs_1.createReadStream(encBodyPath), options.uploadAgent, { 'Content-Type': 'application/octet-stream' });
                const result = JSON.parse(responseText);
                mediaUrl = result === null || result === void 0 ? void 0 : result.url;
                if (mediaUrl)
                    break;
                else {
                    json = await this.refreshMediaConn(true);
                    throw new Error(`upload failed, reason: ${JSON.stringify(result)}`);
                }
            }
            catch (error) {
                const isLast = host.hostname === json.hosts[json.hosts.length - 1].hostname;
                this.logger.error(`Error in uploading to ${host.hostname} (${error}) ${isLast ? '' : ', retrying...'}`);
            }
        }
        if (!mediaUrl)
            throw new Error('Media upload failed on all hosts');
        // remove tmp files
        await Promise.all([
            fs_1.promises.unlink(encBodyPath),
            didSaveToTmpPath && bodyPath && fs_1.promises.unlink(bodyPath)
        ]
            .filter(Boolean));
        const message = {
            [mediaType]: Constants_1.MessageTypeProto[mediaType].fromObject({
                url: mediaUrl,
                mediaKey: mediaKey,
                mimetype: options.mimetype,
                fileEncSha256: fileEncSha256,
                fileSha256: fileSha256,
                fileLength: fileLength,
                seconds: options.duration,
                fileName: options.filename || 'file',
                gifPlayback: isGIF || undefined,
                caption: options.caption,
                ptt: options.ptt,
                viewOnce: options.viewOnce,
                isAnimated: options.isAnimated
            })
        };
        return Constants_1.WAMessageProto.Message.fromObject(message); // as WAMessageContent
    }
    /** prepares a WAMessage for sending from the given content & options */
    prepareMessageFromContent(id, message, options) {
        if (!options.timestamp)
            options.timestamp = new Date(); // set timestamp to now
        if (typeof options.sendEphemeral === 'undefined')
            options.sendEphemeral = 'chat';
        if (options.viewOnce)
            message = { viewOnceMessage: { message } };
        // prevent an annoying bug (WA doesn't accept sending messages with '@c.us')
        id = Utils_1.whatsappID(id);
        const key = Object.keys(message)[0];
        const timestamp = Utils_1.unixTimestampSeconds(options.timestamp);
        const quoted = options.quoted;
        if (options.contextInfo)
            message[key].contextInfo = options.contextInfo;
        if (quoted) {
            const participant = quoted.key.fromMe ? this.user.jid : (quoted.participant || quoted.key.participant || quoted.key.remoteJid);
            message[key].contextInfo = message[key].contextInfo || {};
            message[key].contextInfo.participant = participant;
            message[key].contextInfo.stanzaId = quoted.key.id;
            message[key].contextInfo.quotedMessage = quoted.message;
            // if a participant is quoted, then it must be a group
            // hence, remoteJid of group must also be entered
            if (quoted.key.participant) {
                message[key].contextInfo.remoteJid = quoted.key.remoteJid;
            }
        }
        if (options === null || options === void 0 ? void 0 : options.thumbnail) {
            message[key].jpegThumbnail = Buffer.from(options.thumbnail, 'base64');
        }
        const chat = this.chats.get(id);
        if (
        // if we want to send a disappearing message
        (((options === null || options === void 0 ? void 0 : options.sendEphemeral) === 'chat' && (chat === null || chat === void 0 ? void 0 : chat.ephemeral)) ||
            (options === null || options === void 0 ? void 0 : options.sendEphemeral) === true) &&
            // and it's not a protocol message -- delete, toggle disappear message
            key !== 'protocolMessage' &&
            // already not converted to disappearing message
            key !== 'ephemeralMessage') {
            message[key].contextInfo = {
                ...(message[key].contextInfo || {}),
                expiration: (chat === null || chat === void 0 ? void 0 : chat.ephemeral) || Constants_1.WA_DEFAULT_EPHEMERAL,
                ephemeralSettingTimestamp: chat === null || chat === void 0 ? void 0 : chat.eph_setting_ts
            };
            message = {
                ephemeralMessage: {
                    message
                }
            };
        }
        message = Constants_1.WAMessageProto.Message.fromObject(message);
        const messageJSON = {
            key: {
                remoteJid: id,
                fromMe: true,
                id: (options === null || options === void 0 ? void 0 : options.messageId) || Utils_1.generateMessageID(),
            },
            message: message,
            messageTimestamp: timestamp,
            messageStubParameters: [],
            participant: id.includes('@g.us') ? this.user.jid : null,
            status: Constants_1.WA_MESSAGE_STATUS_TYPE.PENDING
        };
        return Constants_1.WAMessageProto.WebMessageInfo.fromObject(messageJSON);
    }
    /** Relay (send) a WAMessage; more advanced functionality to send a built WA Message, you may want to stick with sendMessage() */
    async relayWAMessage(message, { waitForAck } = { waitForAck: true }) {
        var _a;
        const json = ['action', { epoch: this.msgCount.toString(), type: 'relay' }, [['message', null, message]]];
        const flag = message.key.remoteJid === ((_a = this.user) === null || _a === void 0 ? void 0 : _a.jid) ? Constants_1.WAFlag.acknowledge : Constants_1.WAFlag.ignore; // acknowledge when sending message to oneself
        const mID = message.key.id;
        message.status = Constants_1.WA_MESSAGE_STATUS_TYPE.PENDING;
        const promise = this.query({
            json,
            binaryTags: [Constants_1.WAMetric.message, flag],
            tag: mID,
            expect200: true,
            requiresPhoneConnection: true
        })
            .then(() => message.status = Constants_1.WA_MESSAGE_STATUS_TYPE.SERVER_ACK);
        if (waitForAck) {
            await promise;
        }
        else {
            const emitUpdate = (status) => {
                message.status = status;
                this.emit('chat-update', { jid: message.key.remoteJid, messages: Utils_1.newMessagesDB([message]) });
            };
            promise
                .then(() => emitUpdate(Constants_1.WA_MESSAGE_STATUS_TYPE.SERVER_ACK))
                .catch(() => emitUpdate(Constants_1.WA_MESSAGE_STATUS_TYPE.ERROR));
        }
        await this.chatAddMessageAppropriate(message);
    }
    /**
     * Fetches the latest url & media key for the given message.
     * You may need to call this when the message is old & the content is deleted off of the WA servers
     * @param message
     */
    async updateMediaMessage(message) {
        var _a, _b, _c, _d, _e;
        const content = ((_a = message.message) === null || _a === void 0 ? void 0 : _a.audioMessage) || ((_b = message.message) === null || _b === void 0 ? void 0 : _b.videoMessage) || ((_c = message.message) === null || _c === void 0 ? void 0 : _c.imageMessage) || ((_d = message.message) === null || _d === void 0 ? void 0 : _d.stickerMessage) || ((_e = message.message) === null || _e === void 0 ? void 0 : _e.documentMessage);
        if (!content)
            throw new Constants_1.BaileysError(`given message ${message.key.id} is not a media message`, message);
        const query = ['query', { type: 'media', index: message.key.id, owner: message.key.fromMe ? 'true' : 'false', jid: message.key.remoteJid, epoch: this.msgCount.toString() }, null];
        const response = await this.query({
            json: query,
            binaryTags: [Constants_1.WAMetric.queryMedia, Constants_1.WAFlag.ignore],
            expect200: true,
            requiresPhoneConnection: true
        });
        Object.keys(response[1]).forEach(key => content[key] = response[1][key]); // update message
    }
    /**
     * Securely downloads the media from the message.
     * Renews the download url automatically, if necessary.
     */
    async downloadMediaMessage(message, type = 'buffer') {
        var _a, _b, _c, _d;
        let mContent = ((_b = (_a = message.message) === null || _a === void 0 ? void 0 : _a.ephemeralMessage) === null || _b === void 0 ? void 0 : _b.message) || message.message;
        if (!mContent)
            throw new Constants_1.BaileysError('No message present', { status: 400 });
        const downloadMediaMessage = async () => {
            const stream = await Utils_1.decryptMediaMessageBuffer(mContent);
            if (type === 'buffer') {
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }
                return buffer;
            }
            return stream;
        };
        try {
            const buff = await downloadMediaMessage();
            return buff;
        }
        catch (error) {
            if (error instanceof Constants_1.BaileysError && error.status === 404) { // media needs to be updated
                this.logger.info(`updating media of message: ${message.key.id}`);
                await this.updateMediaMessage(message);
                mContent = ((_d = (_c = message.message) === null || _c === void 0 ? void 0 : _c.ephemeralMessage) === null || _d === void 0 ? void 0 : _d.message) || message.message;
                const buff = await downloadMediaMessage();
                return buff;
            }
            throw error;
        }
    }
    /**
     * Securely downloads the media from the message and saves to a file.
     * Renews the download url automatically, if necessary.
     * @param message the media message you want to decode
     * @param filename the name of the file where the media will be saved
     * @param attachExtension should the parsed extension be applied automatically to the file
     */
    async downloadAndSaveMediaMessage(message, filename, attachExtension = true) {
        const extension = Utils_1.extensionForMediaMessage(message.message);
        const trueFileName = attachExtension ? (filename + '.' + extension) : filename;
        const buffer = await this.downloadMediaMessage(message);
        await fs_1.promises.writeFile(trueFileName, buffer);
        return trueFileName;
    }
    /** Query a string to check if it has a url, if it does, return required extended text message */
    async generateLinkPreview(text) {
        const query = ['query', { type: 'url', url: text, epoch: this.msgCount.toString() }, null];
        const response = await this.query({ json: query, binaryTags: [26, Constants_1.WAFlag.ignore], expect200: true, requiresPhoneConnection: false });
        if (response[1])
            response[1].jpegThumbnail = response[2];
        const data = response[1];
        const content = { text };
        content.canonicalUrl = data['canonical-url'];
        content.matchedText = data['matched-text'];
        content.jpegThumbnail = data.jpegThumbnail;
        content.description = data.description;
        content.title = data.title;
        content.previewType = 0;
        return content;
    }
    async refreshMediaConn(forceGet = false) {
        if (!this.mediaConn || forceGet || (new Date().getTime() - this.mediaConn.fetchDate.getTime()) > this.mediaConn.ttl * 1000) {
            this.mediaConn = await this.getNewMediaConn();
            this.mediaConn.fetchDate = new Date();
        }
        return this.mediaConn;
    }
    async getNewMediaConn() {
        const { media_conn } = await this.query({ json: ['query', 'mediaConn'], requiresPhoneConnection: false });
        return media_conn;
    }
}
__decorate([
    Mutex_1.Mutex(message => { var _a; return (_a = message === null || message === void 0 ? void 0 : message.key) === null || _a === void 0 ? void 0 : _a.id; })
], WAConnection.prototype, "updateMediaMessage", null);
__decorate([
    Mutex_1.Mutex(message => { var _a; return (_a = message === null || message === void 0 ? void 0 : message.key) === null || _a === void 0 ? void 0 : _a.id; })
], WAConnection.prototype, "downloadMediaMessage", null);
__decorate([
    Mutex_1.Mutex()
], WAConnection.prototype, "refreshMediaConn", null);
exports.WAConnection = WAConnection;
