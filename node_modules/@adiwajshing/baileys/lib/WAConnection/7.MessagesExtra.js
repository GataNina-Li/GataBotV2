"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAConnection = void 0;
const _6_MessagesSend_1 = require("./6.MessagesSend");
const Constants_1 = require("./Constants");
const Utils_1 = require("./Utils");
const Mutex_1 = require("./Mutex");
class WAConnection extends _6_MessagesSend_1.WAConnection {
    async loadAllUnreadMessages() {
        const tasks = this.chats.all()
            .filter(chat => chat.count > 0)
            .map(chat => this.loadMessages(chat.jid, chat.count));
        const list = await Promise.all(tasks);
        const combined = [];
        list.forEach(({ messages }) => combined.push(...messages));
        return combined;
    }
    /** Get the message info, who has read it, who its been delivered to */
    async messageInfo(jid, messageID) {
        const query = ['query', { type: 'message_info', index: messageID, jid: jid, epoch: this.msgCount.toString() }, null];
        const [, , response] = await this.query({
            json: query,
            binaryTags: [Constants_1.WAMetric.queryRead, Constants_1.WAFlag.ignore],
            expect200: true,
            requiresPhoneConnection: true
        });
        const info = { reads: [], deliveries: [] };
        if (response) {
            const reads = response.filter(node => node[0] === 'read');
            if (reads[0]) {
                info.reads = reads[0][2].map(item => item[1]);
            }
            const deliveries = response.filter(node => node[0] === 'delivery');
            if (deliveries[0]) {
                info.deliveries = deliveries[0][2].map(item => item[1]);
            }
        }
        return info;
    }
    /**
     * Marks a chat as read/unread; updates the chat object too
     * @param jid the ID of the person/group whose message you want to mark read
     * @param unread unreads the chat, if true
     */
    async chatRead(jid, type = 'read') {
        jid = Utils_1.whatsappID(jid);
        const chat = this.assertChatGet(jid);
        const count = type === 'unread' ? '-2' : Math.abs(chat.count).toString();
        if (type === 'unread' || chat.count !== 0) {
            const idx = await this.getChatIndex(jid);
            await this.setQuery([
                ['read', { jid, count, ...idx, participant: undefined }, null]
            ], [Constants_1.WAMetric.read, Constants_1.WAFlag.ignore]);
        }
        chat.count = type === 'unread' ? -1 : 0;
        this.emit('chat-update', { jid, count: chat.count });
    }
    /**
     * Sends a read receipt for a given message;
     * does not update the chat do @see chatRead
     * @deprecated just use chatRead()
     * @param jid the ID of the person/group whose message you want to mark read
     * @param messageKey the key of the message
     * @param count number of messages to read, set to < 0 to unread a message
     */
    async sendReadReceipt(jid, messageKey, count) {
        var _a;
        const attributes = {
            jid,
            count: count.toString(),
            index: messageKey === null || messageKey === void 0 ? void 0 : messageKey.id,
            participant: (messageKey === null || messageKey === void 0 ? void 0 : messageKey.participant) || undefined,
            owner: (_a = messageKey === null || messageKey === void 0 ? void 0 : messageKey.fromMe) === null || _a === void 0 ? void 0 : _a.toString()
        };
        const read = await this.setQuery([['read', attributes, null]], [Constants_1.WAMetric.read, Constants_1.WAFlag.ignore]);
        return read;
    }
    async fetchMessagesFromWA(jid, count, indexMessage, mostRecentFirst = true) {
        var _a;
        const json = [
            'query',
            {
                epoch: this.msgCount.toString(),
                type: 'message',
                jid: jid,
                kind: mostRecentFirst ? 'before' : 'after',
                count: count.toString(),
                index: indexMessage === null || indexMessage === void 0 ? void 0 : indexMessage.id,
                owner: (indexMessage === null || indexMessage === void 0 ? void 0 : indexMessage.fromMe) === false ? 'false' : 'true',
            },
            null,
        ];
        const response = await this.query({ json, binaryTags: [Constants_1.WAMetric.queryMessages, Constants_1.WAFlag.ignore], expect200: false, requiresPhoneConnection: true });
        return ((_a = response[2]) === null || _a === void 0 ? void 0 : _a.map(item => item[2])) || [];
    }
    /**
     * Load the conversation with a group or person
     * @param count the number of messages to load
     * @param cursor the data for which message to offset the query by
     * @param mostRecentFirst retrieve the most recent message first or retrieve from the converation start
     */
    async loadMessages(jid, count, cursor, mostRecentFirst = true) {
        var _a;
        jid = Utils_1.whatsappID(jid);
        const retrieve = (count, indexMessage) => this.fetchMessagesFromWA(jid, count, indexMessage, mostRecentFirst);
        const chat = this.chats.get(jid);
        const hasCursor = (cursor === null || cursor === void 0 ? void 0 : cursor.id) && typeof (cursor === null || cursor === void 0 ? void 0 : cursor.fromMe) !== 'undefined';
        const cursorValue = hasCursor && (chat === null || chat === void 0 ? void 0 : chat.messages.get(Utils_1.GET_MESSAGE_ID(cursor)));
        let messages;
        if ((chat === null || chat === void 0 ? void 0 : chat.messages) && mostRecentFirst && (!hasCursor || cursorValue)) {
            messages = chat.messages.paginatedByValue(cursorValue, count, null, 'before');
            const diff = count - messages.length;
            if (diff < 0) {
                messages = messages.slice(-count); // get the last X messages
            }
            else if (diff > 0) {
                const fMessage = chat.messages.all()[0];
                let fepoch = (fMessage && fMessage['epoch']) || 0;
                const extra = await retrieve(diff, ((_a = messages[0]) === null || _a === void 0 ? void 0 : _a.key) || cursor);
                // add to DB
                for (let i = extra.length - 1; i >= 0; i--) {
                    const m = extra[i];
                    fepoch -= 1;
                    m['epoch'] = fepoch;
                    if (chat.messages.length < this.maxCachedMessages) {
                        chat.messages.insertIfAbsent(m);
                    }
                }
                messages.unshift(...extra);
            }
        }
        else
            messages = await retrieve(count, cursor);
        if (messages[0])
            cursor = { id: messages[0].key.id, fromMe: messages[0].key.fromMe };
        else
            cursor = null;
        return { messages, cursor };
    }
    /**
     * Load the entire friggin conversation with a group or person
     * @param onMessage callback for every message retrieved
     * @param chunkSize the number of messages to load in a single request
     * @param mostRecentFirst retrieve the most recent message first or retrieve from the converation start
     */
    loadAllMessages(jid, onMessage, chunkSize = 25, mostRecentFirst = true) {
        let offsetID = null;
        const loadMessage = async () => {
            const { messages } = await this.loadMessages(jid, chunkSize, offsetID, mostRecentFirst);
            // callback with most recent message first (descending order of date)
            let lastMessage;
            if (mostRecentFirst) {
                for (let i = messages.length - 1; i >= 0; i--) {
                    await onMessage(messages[i]);
                    lastMessage = messages[i];
                }
            }
            else {
                for (let i = 0; i < messages.length; i++) {
                    await onMessage(messages[i]);
                    lastMessage = messages[i];
                }
            }
            // if there are still more messages
            if (messages.length >= chunkSize) {
                offsetID = lastMessage.key; // get the last message
                await Utils_1.delay(200);
                return loadMessage();
            }
        };
        return loadMessage();
    }
    /**
     * Find a message in a given conversation
     * @param chunkSize the number of messages to load in a single request
     * @param onMessage callback for every message retrieved, if return true -- the loop will break
     */
    async findMessage(jid, chunkSize, onMessage) {
        var _a;
        const chat = this.chats.get(Utils_1.whatsappID(jid));
        let count = ((_a = chat === null || chat === void 0 ? void 0 : chat.messages) === null || _a === void 0 ? void 0 : _a.all().length) || chunkSize;
        let offsetID;
        while (true) {
            const { messages, cursor } = await this.loadMessages(jid, count, offsetID, true);
            // callback with most recent message first (descending order of date)
            for (let i = messages.length - 1; i >= 0; i--) {
                if (onMessage(messages[i]))
                    return;
            }
            if (messages.length === 0)
                return;
            // if there are more messages
            offsetID = cursor;
            await Utils_1.delay(200);
        }
    }
    /**
     * Loads all messages sent after a specific date
     */
    async messagesReceivedAfter(date, onlyUnrespondedMessages = false) {
        const stamp = Utils_1.unixTimestampSeconds(date);
        // find the index where the chat timestamp becomes greater
        const idx = this.chats.all().findIndex(c => c.t < stamp);
        // all chats before that index -- i.e. all chats that were updated after that
        const chats = this.chats.all().slice(0, idx);
        const messages = [];
        await Promise.all(chats.map(async (chat) => {
            await this.findMessage(chat.jid, 5, m => {
                if (Utils_1.toNumber(m.messageTimestamp) < stamp || (onlyUnrespondedMessages && m.key.fromMe))
                    return true;
                messages.push(m);
            });
        }));
        return messages;
    }
    /** Load a single message specified by the ID */
    async loadMessage(jid, id) {
        let message;
        jid = Utils_1.whatsappID(jid);
        const chat = this.chats.get(jid);
        if (chat) {
            // see if message is present in cache
            message = chat.messages.get(Utils_1.GET_MESSAGE_ID({ id, fromMe: true })) || chat.messages.get(Utils_1.GET_MESSAGE_ID({ id, fromMe: false }));
        }
        if (!message) {
            // load the message before the given message
            let messages = (await this.loadMessages(jid, 1, { id, fromMe: true })).messages;
            if (!messages[0])
                messages = (await this.loadMessages(jid, 1, { id, fromMe: false })).messages;
            // the message after the loaded message is the message required
            const actual = await this.loadMessages(jid, 1, messages[0] && messages[0].key, false);
            message = actual.messages[0];
        }
        return message;
    }
    /**
     * Search WhatsApp messages with a given text string
     * @param txt the search string
     * @param inJid the ID of the chat to search in, set to null to search all chats
     * @param count number of results to return
     * @param page page number of results (starts from 1)
     */
    async searchMessages(txt, inJid, count, page) {
        const json = [
            'query',
            {
                epoch: this.msgCount.toString(),
                type: 'search',
                search: Buffer.from(txt, 'utf-8'),
                count: count.toString(),
                page: page.toString(),
                jid: inJid
            },
            null,
        ];
        const response = await this.query({ json, binaryTags: [24, Constants_1.WAFlag.ignore], expect200: true }); // encrypt and send  off
        const messages = response[2] ? response[2].map(row => row[2]) : [];
        return {
            last: response[1]['last'] === 'true',
            messages: messages
        };
    }
    /**
     * Delete a message in a chat for yourself
     * @param messageKey key of the message you want to delete
     */
    async clearMessage(messageKey) {
        const tag = Math.round(Math.random() * 1000000);
        const attrs = [
            'chat',
            { jid: messageKey.remoteJid, modify_tag: tag.toString(), type: 'clear' },
            [
                ['item', { owner: `${messageKey.fromMe}`, index: messageKey.id }, null]
            ]
        ];
        const result = await this.setQuery([attrs]);
        const chat = this.chats.get(Utils_1.whatsappID(messageKey.remoteJid));
        if (chat) {
            const value = chat.messages.get(Utils_1.GET_MESSAGE_ID(messageKey));
            value && chat.messages.delete(value);
        }
        return result;
    }
    /**
     * Star or unstar a message
     * @param messageKey key of the message you want to star or unstar
     */
    async starMessage(messageKey, type = 'star') {
        const attrs = [
            'chat',
            {
                jid: messageKey.remoteJid,
                type
            },
            [
                ['item', { owner: `${messageKey.fromMe}`, index: messageKey.id }, null]
            ]
        ];
        const result = await this.setQuery([attrs]);
        const chat = this.chats.get(Utils_1.whatsappID(messageKey.remoteJid));
        if (result.status == 200 && chat) {
            const message = chat.messages.get(Utils_1.GET_MESSAGE_ID(messageKey));
            if (message) {
                message.starred = type === 'star';
                const chatUpdate = { jid: messageKey.remoteJid, messages: Utils_1.newMessagesDB([message]) };
                this.emit('chat-update', chatUpdate);
            }
        }
        return result;
    }
    /**
     * Delete a message in a chat for everyone
     * @param id the person or group where you're trying to delete the message
     * @param messageKey key of the message you want to delete
     */
    async deleteMessage(k, messageKey) {
        if (typeof k === 'object') {
            messageKey = k;
        }
        const json = {
            protocolMessage: {
                key: messageKey,
                type: Constants_1.WAMessageProto.ProtocolMessage.ProtocolMessageType.REVOKE
            }
        };
        const waMessage = this.prepareMessageFromContent(messageKey.remoteJid, json, {});
        await this.relayWAMessage(waMessage);
        return waMessage;
    }
    /**
     * Generate forwarded message content like WA does
     * @param message the message to forward
     * @param forceForward will show the message as forwarded even if it is from you
     */
    generateForwardMessageContent(message, forceForward = false) {
        var _a;
        let content = message.message;
        if (!content)
            throw new Constants_1.BaileysError('no content in message', { status: 400 });
        content = Constants_1.WAMessageProto.Message.fromObject(content); // hacky copy
        let key = Object.keys(content)[0];
        let score = ((_a = content[key].contextInfo) === null || _a === void 0 ? void 0 : _a.forwardingScore) || 0;
        score += message.key.fromMe && !forceForward ? 0 : 1;
        if (key === Constants_1.MessageType.text) {
            content[Constants_1.MessageType.extendedText] = { text: content[key] };
            delete content[Constants_1.MessageType.text];
            key = Constants_1.MessageType.extendedText;
        }
        if (score > 0)
            content[key].contextInfo = { forwardingScore: score, isForwarded: true };
        else
            content[key].contextInfo = {};
        return content;
    }
    /**
     * Forward a message like WA
     * @param jid the chat ID to forward to
     * @param message the message to forward
     * @param forceForward will show the message as forwarded even if it is from you
     */
    async forwardMessage(jid, message, forceForward = false) {
        const content = this.generateForwardMessageContent(message, forceForward);
        const waMessage = this.prepareMessageFromContent(jid, content, {});
        await this.relayWAMessage(waMessage);
        return waMessage;
    }
    async modifyChat(jid, type, arg) {
        jid = Utils_1.whatsappID(jid);
        const chat = this.assertChatGet(jid);
        let chatAttrs = { jid: jid };
        if (type === Constants_1.ChatModification.mute && !arg) {
            throw new Constants_1.BaileysError('duration must be set to the timestamp of the time of pinning/unpinning of the chat', { status: 400 });
        }
        const durationMs = arg || 0;
        const includeStarred = arg;
        let index;
        switch (type) {
            case Constants_1.ChatModification.pin:
            case Constants_1.ChatModification.mute:
                const strStamp = (Utils_1.unixTimestampSeconds() + Math.floor(durationMs / 1000)).toString();
                chatAttrs.type = type;
                chatAttrs[type] = strStamp;
                break;
            case Constants_1.ChatModification.unpin:
            case Constants_1.ChatModification.unmute:
                chatAttrs.type = type.replace('un', ''); // replace 'unpin' with 'pin'
                chatAttrs.previous = chat[type.replace('un', '')];
                break;
            case Constants_1.ChatModification.clear:
                chatAttrs.type = type;
                chatAttrs.star = includeStarred ? 'true' : 'false';
                index = await this.getChatIndex(jid);
                chatAttrs = { ...chatAttrs, ...index };
                delete chatAttrs.participant;
                break;
            default:
                chatAttrs.type = type;
                index = await this.getChatIndex(jid);
                chatAttrs = { ...chatAttrs, ...index };
                break;
        }
        const response = await this.setQuery([['chat', chatAttrs, null]], [Constants_1.WAMetric.chat, Constants_1.WAFlag.ignore]);
        if (chat && response.status === 200) {
            switch (type) {
                case Constants_1.ChatModification.clear:
                    if (includeStarred) {
                        chat.messages.clear();
                    }
                    else {
                        chat.messages = chat.messages.filter(m => m.starred);
                    }
                    break;
                case Constants_1.ChatModification.delete:
                    this.chats.deleteById(jid);
                    this.emit('chat-update', { jid, delete: 'true' });
                    break;
                default:
                    this.chats.update(jid, chat => {
                        if (type.includes('un')) {
                            type = type.replace('un', '');
                            delete chat[type.replace('un', '')];
                            this.emit('chat-update', { jid, [type]: false });
                        }
                        else {
                            chat[type] = chatAttrs[type] || 'true';
                            this.emit('chat-update', { jid, [type]: chat[type] });
                        }
                    });
                    break;
            }
        }
        return response;
    }
    async getChatIndex(jid) {
        var _a;
        const chatAttrs = {};
        const { messages: [msg] } = await this.loadMessages(jid, 1);
        if (msg) {
            chatAttrs.index = msg.key.id;
            chatAttrs.owner = msg.key.fromMe.toString();
        }
        if (Utils_1.isGroupID(jid)) {
            chatAttrs.participant = msg.key.fromMe ? (_a = this.user) === null || _a === void 0 ? void 0 : _a.jid : Utils_1.whatsappID(msg.participant || msg.key.participant);
        }
        return chatAttrs;
    }
}
__decorate([
    Mutex_1.Mutex()
], WAConnection.prototype, "loadAllUnreadMessages", null);
__decorate([
    Mutex_1.Mutex((jid, messageID) => jid + messageID)
], WAConnection.prototype, "messageInfo", null);
__decorate([
    Mutex_1.Mutex(jid => jid)
], WAConnection.prototype, "chatRead", null);
__decorate([
    Mutex_1.Mutex(jid => jid)
], WAConnection.prototype, "loadMessages", null);
__decorate([
    Mutex_1.Mutex(m => m.remoteJid)
], WAConnection.prototype, "clearMessage", null);
__decorate([
    Mutex_1.Mutex(m => m.remoteJid)
], WAConnection.prototype, "starMessage", null);
__decorate([
    Mutex_1.Mutex((jid, type) => jid + type)
], WAConnection.prototype, "modifyChat", null);
exports.WAConnection = WAConnection;
