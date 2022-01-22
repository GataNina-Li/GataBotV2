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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
const QR = __importStar(require("qrcode-terminal"));
const _3_Connect_1 = require("./3.Connect");
const Constants_1 = require("./Constants");
const Utils_1 = require("./Utils");
const keyed_db_1 = __importDefault(require("@adiwajshing/keyed-db"));
const Mutex_1 = require("./Mutex");
class WAConnection extends _3_Connect_1.WAConnection {
    constructor() {
        super();
        /** find a chat or return an error */
        this.assertChatGet = jid => {
            const chat = this.chats.get(jid);
            if (!chat)
                throw new Error(`chat '${jid}' not found`);
            return chat;
        };
        this.emitParticipantsUpdate = (jid, participants, action) => {
            const chat = this.chats.get(jid);
            const meta = chat === null || chat === void 0 ? void 0 : chat.metadata;
            if (meta) {
                switch (action) {
                    case 'add':
                        participants.forEach(jid => (meta.participants.push({ ...this.contactAddOrGet(jid), isAdmin: false, isSuperAdmin: false })));
                        break;
                    case 'remove':
                        meta.participants = meta.participants.filter(p => !participants.includes(p.jid));
                        break;
                    case 'promote':
                    case 'demote':
                        const isAdmin = action === 'promote';
                        meta.participants.forEach(p => {
                            if (participants.includes(p.jid))
                                p.isAdmin = isAdmin;
                        });
                        break;
                }
            }
            this.emit('group-participants-update', { jid, participants, action });
        };
        this.emitGroupUpdate = (jid, update) => {
            const chat = this.chats.get(jid);
            if (chat.metadata)
                Object.assign(chat.metadata, update);
            this.emit('group-update', { jid, ...update });
        };
        this.chatUpdateTime = (chat, stamp) => this.chats.update(chat.jid, c => c.t = stamp);
        this.setMaxListeners(30);
        this.chatsDebounceTimeout.setTask(() => {
            this.logger.debug('pinging with chats query');
            this.sendChatsQuery(this.msgCount);
            this.chatsDebounceTimeout.start();
        });
        this.on('open', () => {
            // send queries WA Web expects
            this.sendBinary(['query', { type: 'contacts', epoch: '1' }, null], [Constants_1.WAMetric.queryContact, Constants_1.WAFlag.ignore]);
            this.sendBinary(['query', { type: 'status', epoch: '1' }, null], [Constants_1.WAMetric.queryStatus, Constants_1.WAFlag.ignore]);
            this.sendBinary(['query', { type: 'quick_reply', epoch: '1' }, null], [Constants_1.WAMetric.queryQuickReply, Constants_1.WAFlag.ignore]);
            this.sendBinary(['query', { type: 'label', epoch: '1' }, null], [Constants_1.WAMetric.queryLabel, Constants_1.WAFlag.ignore]);
            this.sendBinary(['query', { type: 'emoji', epoch: '1' }, null], [Constants_1.WAMetric.queryEmoji, Constants_1.WAFlag.ignore]);
            this.sendBinary(['action', { type: 'set', epoch: '1' }, [['presence', { type: Constants_1.Presence.available }, null]]], [Constants_1.WAMetric.presence, Constants_1.WAFlag.available]);
            if (this.connectOptions.queryChatsTillReceived) {
                this.chatsDebounceTimeout.start();
            }
            else {
                this.sendChatsQuery(1);
            }
            this.logger.debug('sent init queries');
        });
        // on disconnects
        this.on('CB:Cmd,type:disconnect', json => (this.state === 'open' && this.unexpectedDisconnect(json[1].kind || 'unknown')));
        this.on('CB:Pong', json => {
            if (!json[1]) {
                this.unexpectedDisconnect(Constants_1.DisconnectReason.close);
                this.logger.info('Connection terminated by phone, closing...');
            }
            else if (this.phoneConnected !== json[1]) {
                this.phoneConnected = json[1];
                this.emit('connection-phone-change', { connected: this.phoneConnected });
            }
        });
        // chats received
        this.on('CB:response,type:chat', json => {
            if (json[1].duplicate || !json[2])
                return;
            this.chatsDebounceTimeout.cancel();
            const chats = new keyed_db_1.default(this.chatOrderingKey, c => c.jid);
            json[2].forEach(([item, chat]) => {
                if (!chat) {
                    this.logger.warn(`unexpectedly got null chat: ${item}`, chat);
                    return;
                }
                chat.jid = (0, Utils_1.whatsappID)(chat.jid);
                chat.t = +chat.t;
                chat.count = +chat.count;
                chat.messages = (0, Utils_1.newMessagesDB)();
                // chats data (log json to see what it looks like)
                chats.insertIfAbsent(chat);
            });
            this.logger.info(`received ${json[2].length} chats`);
            const oldChats = this.chats;
            const updatedChats = [];
            let hasNewChats = false;
            chats.all().forEach(chat => {
                const respectiveContact = this.contacts[chat.jid];
                chat.name = (respectiveContact === null || respectiveContact === void 0 ? void 0 : respectiveContact.name) || (respectiveContact === null || respectiveContact === void 0 ? void 0 : respectiveContact.notify) || chat.name;
                const oldChat = oldChats.get(chat.jid);
                if (!oldChat) {
                    hasNewChats = true;
                }
                else {
                    chat.messages = oldChat.messages;
                    if (oldChat.t !== chat.t || oldChat.modify_tag !== chat.modify_tag) {
                        const changes = (0, Utils_1.shallowChanges)(oldChat, chat, { lookForDeletedKeys: true });
                        delete chat.metadata; // remove group metadata as that may have changed; TODO, write better mechanism for this
                        delete changes.messages;
                        updatedChats.push({ ...changes, jid: chat.jid });
                    }
                }
            });
            this.chats = chats;
            this.lastChatsReceived = new Date();
            updatedChats.length > 0 && this.emit('chats-update', updatedChats);
            this.emit('chats-received', { hasNewChats });
        });
        // we store these last messages
        const lastMessages = {};
        // keep track of overlaps, 
        // if there are no overlaps of messages and we had messages present, we clear the previous messages
        // this prevents missing messages in conversations
        let overlaps = {};
        const onLastBatchOfDataReceived = () => {
            // find which chats had missing messages
            // list out all the jids, and how many messages we've cached now
            const chatsWithMissingMessages = Object.keys(overlaps).map(jid => {
                // if there was no overlap, delete previous messages
                if (!overlaps[jid].didOverlap && overlaps[jid].requiresOverlap) {
                    this.logger.debug(`received messages for ${jid}, but did not overlap with previous messages, clearing...`);
                    const chat = this.chats.get(jid);
                    if (chat) {
                        const message = chat.messages.get(lastMessages[jid]);
                        const remainingMessages = chat.messages.paginatedByValue(message, this.maxCachedMessages, undefined, 'after');
                        chat.messages = (0, Utils_1.newMessagesDB)([message, ...remainingMessages]);
                        return { jid, count: chat.messages.length }; // return number of messages we've left
                    }
                }
            }).filter(Boolean);
            this.emit('initial-data-received', { chatsWithMissingMessages });
        };
        // messages received
        const messagesUpdate = (json, style) => {
            //console.log('msg ', json[1])
            this.messagesDebounceTimeout.start(undefined, onLastBatchOfDataReceived);
            if (style === 'last') {
                overlaps = {};
            }
            const messages = json[2];
            if (messages) {
                const updates = {};
                messages.reverse().forEach(([, , message]) => {
                    const jid = message.key.remoteJid;
                    const chat = this.chats.get(jid);
                    const mKeyID = (0, Utils_1.WA_MESSAGE_ID)(message);
                    if (chat) {
                        if (style === 'previous') {
                            const fm = chat.messages.get(lastMessages[jid]);
                            if (!fm)
                                return;
                            const prevEpoch = fm['epoch'];
                            message['epoch'] = prevEpoch - 1;
                        }
                        else if (style === 'last') {
                            // no overlap required, if there were no previous messages
                            overlaps[jid] = { requiresOverlap: chat.messages.length > 0 };
                            const lm = chat.messages.all()[chat.messages.length - 1];
                            const prevEpoch = (lm && lm['epoch']) || 0;
                            // hacky way to allow more previous messages
                            message['epoch'] = prevEpoch + 1000;
                        }
                        if (chat.messages.upsert(message).length > 0) {
                            overlaps[jid] = { ...(overlaps[jid] || { requiresOverlap: true }), didOverlap: true };
                        }
                        updates[jid] = updates[jid] || (0, Utils_1.newMessagesDB)();
                        updates[jid].upsert(message);
                        lastMessages[jid] = mKeyID;
                    }
                    else if (!chat)
                        this.logger.debug({ jid }, `chat not found`);
                });
                if (Object.keys(updates).length > 0) {
                    this.emit('chats-update', Object.keys(updates).map(jid => ({ jid, messages: updates[jid] })));
                }
            }
        };
        this.on('CB:action,add:last', json => messagesUpdate(json, 'last'));
        this.on('CB:action,add:before', json => messagesUpdate(json, 'previous'));
        this.on('CB:action,add:unread', json => messagesUpdate(json, 'previous'));
        // contacts received
        this.on('CB:response,type:contacts', json => {
            if (json[1].duplicate || !json[2])
                return;
            const contacts = this.contacts;
            const updatedContacts = [];
            json[2].forEach(([type, contact]) => {
                if (!contact)
                    return this.logger.info(`unexpectedly got null contact: ${type}`, contact);
                contact.jid = (0, Utils_1.whatsappID)(contact.jid);
                const presentContact = contacts[contact.jid];
                if (presentContact) {
                    const changes = (0, Utils_1.shallowChanges)(presentContact, contact, { lookForDeletedKeys: false });
                    if (changes && Object.keys(changes).length > 0) {
                        updatedContacts.push({ ...changes, jid: contact.jid });
                    }
                }
                else
                    updatedContacts.push(contact);
                contacts[contact.jid] = { ...(presentContact || {}), ...contact };
            });
            // update chat names
            const updatedChats = [];
            this.chats.all().forEach(c => {
                const contact = contacts[c.jid];
                if (contact) {
                    const name = (contact === null || contact === void 0 ? void 0 : contact.name) || (contact === null || contact === void 0 ? void 0 : contact.notify) || c.name;
                    if (name !== c.name) {
                        updatedChats.push({ jid: c.jid, name });
                    }
                }
            });
            updatedChats.length > 0 && this.emit('chats-update', updatedChats);
            this.logger.info(`received ${json[2].length} contacts`);
            this.contacts = contacts;
            this.emit('contacts-received', { updatedContacts });
        });
        // new messages
        this.on('CB:action,add:relay,message', json => {
            const message = json[2][0][2];
            this.chatAddMessageAppropriate(message);
        });
        this.on('CB:Chat,cmd:action', json => {
            const data = json[1].data;
            if (data) {
                const emitGroupParticipantsUpdate = (action) => this.emitParticipantsUpdate(json[1].id, data[2].participants.map(Utils_1.whatsappID), action);
                const emitGroupUpdate = (data) => this.emitGroupUpdate(json[1].id, data);
                switch (data[0]) {
                    case "promote":
                        emitGroupParticipantsUpdate('promote');
                        break;
                    case "demote":
                        emitGroupParticipantsUpdate('demote');
                        break;
                    case "desc_add":
                        emitGroupUpdate({ ...data[2], descOwner: data[1] });
                        break;
                    default:
                        this.logger.debug({ unhandled: true }, json);
                        break;
                }
            }
        });
        // presence updates
        this.on('CB:Presence', json => {
            const chatUpdate = this.applyingPresenceUpdate(json[1]);
            chatUpdate && this.emit('chat-update', chatUpdate);
        });
        // If a message has been updated (usually called when a video message gets its upload url, or live locations)
        this.on('CB:action,add:update,message', json => {
            const message = json[2][0][2];
            const jid = (0, Utils_1.whatsappID)(message.key.remoteJid);
            const chat = this.chats.get(jid);
            if (!chat)
                return;
            // reinsert to update
            const oldMessage = chat.messages.get((0, Utils_1.WA_MESSAGE_ID)(message));
            if (oldMessage) {
                message['epoch'] = oldMessage['epoch'];
                if (chat.messages.upsert(message).length) {
                    const chatUpdate = { jid, messages: (0, Utils_1.newMessagesDB)([message]) };
                    this.emit('chat-update', chatUpdate);
                }
            }
            else {
                this.logger.debug({ unhandled: true }, 'received message update for non-present message from ' + jid);
            }
        });
        // message status updates
        const onMessageStatusUpdate = json => {
            json = json[2][0][1];
            const MAP = {
                read: Constants_1.WA_MESSAGE_STATUS_TYPE.READ,
                message: Constants_1.WA_MESSAGE_STATUS_TYPE.DELIVERY_ACK,
                error: Constants_1.WA_MESSAGE_STATUS_TYPE.ERROR
            };
            this.onMessageStatusUpdate((0, Utils_1.whatsappID)(json.jid), { id: json.index, fromMe: json.owner === 'true' }, MAP[json.type]);
        };
        this.on('CB:action,add:relay,received', onMessageStatusUpdate);
        this.on('CB:action,,received', onMessageStatusUpdate);
        this.on('CB:Msg,cmd:ack', json => (this.onMessageStatusUpdate((0, Utils_1.whatsappID)(json[1].to), { id: json[1].id, fromMe: true }, +json[1].ack + 1)));
        // If a user's contact has changed
        this.on('CB:action,,user', json => {
            const node = json[2][0];
            if (node) {
                const user = node[1];
                user.jid = (0, Utils_1.whatsappID)(user.jid);
                this.contacts[user.jid] = user;
                this.emit('contact-update', user);
                const chat = this.chats.get(user.jid);
                if (chat) {
                    chat.name = user.name || user.notify || chat.name;
                    this.emit('chat-update', { jid: chat.jid, name: chat.name });
                }
            }
        });
        // chat archive, pin etc.
        this.on('CB:action,,chat', json => {
            var _a;
            json = json[2][0];
            const updateType = json[1].type;
            const jid = (0, Utils_1.whatsappID)((_a = json[1]) === null || _a === void 0 ? void 0 : _a.jid);
            const chat = this.chats.get(jid);
            if (!chat)
                return;
            const FUNCTIONS = {
                'delete': () => {
                    chat['delete'] = 'true';
                    this.chats.deleteById(chat.jid);
                    return 'delete';
                },
                'clear': () => {
                    if (!json[2])
                        chat.messages.clear();
                    else
                        json[2].forEach(item => chat.messages.filter(m => m.key.id !== item[1].index));
                    return 'clear';
                },
                'archive': () => {
                    this.chats.update(chat.jid, chat => chat.archive = 'true');
                    return 'archive';
                },
                'unarchive': () => {
                    delete chat.archive;
                    return 'archive';
                },
                'pin': () => {
                    chat.pin = json[1].pin;
                    return 'pin';
                }
            };
            const func = FUNCTIONS[updateType];
            if (func) {
                const property = func();
                this.emit('chat-update', { jid, [property]: chat[property] || 'false' });
            }
        });
        // profile picture updates
        this.on('CB:Cmd,type:picture', async (json) => {
            json = json[1];
            const jid = (0, Utils_1.whatsappID)(json.jid);
            const imgUrl = await this.getProfilePicture(jid).catch(() => '');
            const contact = this.contacts[jid];
            if (contact) {
                contact.imgUrl = imgUrl;
                this.emit('contact-update', { jid, imgUrl });
            }
            const chat = this.chats.get(jid);
            if (chat) {
                chat.imgUrl = imgUrl;
                this.emit('chat-update', { jid, imgUrl });
            }
        });
        // status updates
        this.on('CB:Status,status', async (json) => {
            const jid = (0, Utils_1.whatsappID)(json[1].id);
            this.emit('contact-update', { jid, status: json[1].status });
        });
        // User Profile Name Updates
        this.on('CB:Conn,pushname', json => {
            if (this.user) {
                const name = json[1].pushname;
                if (this.user.name !== name) {
                    this.user.name = name; // update on client too
                    this.emit('contact-update', { jid: this.user.jid, name });
                }
            }
        });
        // read updates
        this.on('CB:action,,read', async (json) => {
            const update = json[2][0][1];
            const jid = (0, Utils_1.whatsappID)(update.jid);
            const chat = this.chats.get(jid);
            if (chat) {
                if (update.type === 'false')
                    chat.count = -1;
                else
                    chat.count = 0;
                this.emit('chat-update', { jid: chat.jid, count: chat.count });
            }
            else {
                this.logger.warn('recieved read update for unknown chat ' + jid);
            }
        });
        this.on('qr', qr => {
            if (this.connectOptions.logQR) {
                QR.generate(qr, { small: true });
            }
        });
        // blocklist updates
        this.on('CB:Blocklist', json => {
            json = json[1];
            const initial = this.blocklist;
            this.blocklist = json.blocklist;
            const added = this.blocklist.filter(id => !initial.includes(id));
            const removed = initial.filter(id => !this.blocklist.includes(id));
            const update = { added, removed };
            this.emit('blocklist-update', update);
        });
    }
    sendChatsQuery(epoch) {
        return this.sendBinary(['query', { type: 'chat', epoch: epoch.toString() }, null], [Constants_1.WAMetric.queryChat, Constants_1.WAFlag.ignore]);
    }
    /** Get the URL to download the profile picture of a person/group */
    async getProfilePicture(jid) {
        const response = await this.query({
            json: ['query', 'ProfilePicThumb', jid || this.user.jid],
            expect200: true,
            requiresPhoneConnection: false
        });
        return response.eurl;
    }
    applyingPresenceUpdate(update) {
        var _a, _b;
        const chatId = (0, Utils_1.whatsappID)(update.id);
        const jid = (0, Utils_1.whatsappID)(update.participant || update.id);
        const chat = this.chats.get(chatId);
        if (chat && jid.endsWith('@s.whatsapp.net')) { // if its a single chat
            chat.presences = chat.presences || {};
            const presence = { ...(chat.presences[jid] || {}) };
            if (update.t)
                presence.lastSeen = +update.t;
            else if (update.type === Constants_1.Presence.unavailable && (presence.lastKnownPresence === Constants_1.Presence.available || presence.lastKnownPresence === Constants_1.Presence.composing)) {
                presence.lastSeen = (0, Utils_1.unixTimestampSeconds)();
            }
            presence.lastKnownPresence = update.type;
            // no update
            if (presence.lastKnownPresence === ((_a = chat.presences[jid]) === null || _a === void 0 ? void 0 : _a.lastKnownPresence) && presence.lastSeen === ((_b = chat.presences[jid]) === null || _b === void 0 ? void 0 : _b.lastSeen)) {
                return;
            }
            const contact = this.contacts[jid];
            if (contact) {
                presence.name = contact.name || contact.notify || contact.vname;
            }
            chat.presences[jid] = presence;
            return { jid: chatId, presences: { [jid]: presence } };
        }
    }
    /** inserts an empty chat into the DB */
    chatAdd(jid, name, properties = {}) {
        const chat = {
            jid,
            name,
            t: (0, Utils_1.unixTimestampSeconds)(),
            messages: (0, Utils_1.newMessagesDB)(),
            count: 0,
            ...(properties || {})
        };
        if (this.chats.insertIfAbsent(chat).length) {
            this.emit('chat-new', chat);
            return chat;
        }
    }
    onMessageStatusUpdate(jid, key, status) {
        const chat = this.chats.get((0, Utils_1.whatsappID)(jid));
        const msg = chat === null || chat === void 0 ? void 0 : chat.messages.get((0, Utils_1.GET_MESSAGE_ID)(key));
        if (msg) {
            if (typeof status !== 'undefined') {
                if (status > msg.status || status === Constants_1.WA_MESSAGE_STATUS_TYPE.ERROR) {
                    msg.status = status;
                    this.emit('chat-update', { jid: chat.jid, messages: (0, Utils_1.newMessagesDB)([msg]) });
                }
            }
            else {
                this.logger.warn({ update: status }, 'received unknown message status update');
            }
        }
        else {
            this.logger.debug({ unhandled: true, update: status, key }, 'received message status update for non-present message');
        }
    }
    contactAddOrGet(jid) {
        jid = (0, Utils_1.whatsappID)(jid);
        if (!this.contacts[jid])
            this.contacts[jid] = { jid };
        return this.contacts[jid];
    }
    /** Adds the given message to the appropriate chat, if the chat doesn't exist, it is created */
    async chatAddMessageAppropriate(message) {
        const jid = (0, Utils_1.whatsappID)(message.key.remoteJid);
        if ((0, Utils_1.isGroupID)(jid) && !jid.includes('-')) {
            this.logger.warn({ gid: jid }, 'recieved odd group ID');
            return;
        }
        const chat = this.chats.get(jid) || await this.chatAdd(jid);
        this.chatAddMessage(message, chat);
    }
    chatAddMessage(message, chat) {
        var _a, _b, _c, _d;
        // store updates in this
        const chatUpdate = { jid: chat.jid };
        // add to count if the message isn't from me & there exists a message
        if (!message.key.fromMe && message.message) {
            chat.count += 1;
            chatUpdate.count = chat.count;
            const participant = (0, Utils_1.whatsappID)(message.participant || chat.jid);
            const contact = chat.presences && chat.presences[participant];
            if ((contact === null || contact === void 0 ? void 0 : contact.lastKnownPresence) === Constants_1.Presence.composing) { // update presence
                const update = this.applyingPresenceUpdate({ id: chat.jid, participant, type: Constants_1.Presence.available });
                update && Object.assign(chatUpdate, update);
            }
        }
        const ephemeralProtocolMsg = (_c = (_b = (_a = message.message) === null || _a === void 0 ? void 0 : _a.ephemeralMessage) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.protocolMessage;
        if (ephemeralProtocolMsg &&
            ephemeralProtocolMsg.type === Constants_1.WAMessageProto.ProtocolMessage.ProtocolMessageType.EPHEMERAL_SETTING) {
            chatUpdate.eph_setting_ts = message.messageTimestamp.toString();
            chatUpdate.ephemeral = ephemeralProtocolMsg.ephemeralExpiration.toString();
            if (ephemeralProtocolMsg.ephemeralExpiration) {
                chat.eph_setting_ts = chatUpdate.eph_setting_ts;
                chat.ephemeral = chatUpdate.ephemeral;
            }
            else {
                delete chat.eph_setting_ts;
                delete chat.ephemeral;
            }
        }
        const messages = chat.messages;
        const protocolMessage = (_d = message.message) === null || _d === void 0 ? void 0 : _d.protocolMessage;
        // if it's a message to delete another message
        if (protocolMessage) {
            switch (protocolMessage.type) {
                case Constants_1.WAMessageProto.ProtocolMessage.ProtocolMessageType.REVOKE:
                    const found = chat.messages.get((0, Utils_1.GET_MESSAGE_ID)(protocolMessage.key));
                    if (found === null || found === void 0 ? void 0 : found.message) {
                        this.logger.info('deleting message: ' + protocolMessage.key.id + ' in chat: ' + protocolMessage.key.remoteJid);
                        found.messageStubType = Constants_1.WA_MESSAGE_STUB_TYPE.REVOKE;
                        delete found.message;
                        chatUpdate.messages = (0, Utils_1.newMessagesDB)([found]);
                    }
                    break;
                default:
                    break;
            }
        }
        else if (!messages.get((0, Utils_1.WA_MESSAGE_ID)(message))) { // if the message is not already there
            const lastEpoch = (messages.last && messages.last['epoch']) || 0;
            message['epoch'] = lastEpoch + 1;
            messages.insert(message);
            while (messages.length > this.maxCachedMessages) {
                messages.delete(messages.all()[0]); // delete oldest messages
            }
            // only update if it's an actual message
            if (message.message && !ephemeralProtocolMsg) {
                this.chats.update(chat.jid, chat => {
                    chat.t = +(0, Utils_1.toNumber)(message.messageTimestamp);
                    chatUpdate.t = chat.t;
                    // a new message unarchives the chat
                    if (chat.archive) {
                        delete chat.archive;
                        chatUpdate.archive = 'false';
                    }
                });
            }
            chatUpdate.hasNewMessage = true;
            chatUpdate.messages = (0, Utils_1.newMessagesDB)([message]);
            // check if the message is an action 
            if (message.messageStubType) {
                const jid = chat.jid;
                //let actor = whatsappID (message.participant)
                let participants;
                const emitParticipantsUpdate = (action) => (this.emitParticipantsUpdate(jid, participants, action));
                const emitGroupUpdate = (update) => this.emitGroupUpdate(jid, update);
                switch (message.messageStubType) {
                    case Constants_1.WA_MESSAGE_STUB_TYPE.CHANGE_EPHEMERAL_SETTING:
                        chatUpdate.eph_setting_ts = message.messageTimestamp.toString();
                        chatUpdate.ephemeral = message.messageStubParameters[0];
                        if (+chatUpdate.ephemeral) {
                            chat.eph_setting_ts = chatUpdate.eph_setting_ts;
                            chat.ephemeral = chatUpdate.ephemeral;
                        }
                        else {
                            delete chat.eph_setting_ts;
                            delete chat.ephemeral;
                        }
                        break;
                    case Constants_1.WA_MESSAGE_STUB_TYPE.GROUP_PARTICIPANT_LEAVE:
                    case Constants_1.WA_MESSAGE_STUB_TYPE.GROUP_PARTICIPANT_REMOVE:
                        participants = message.messageStubParameters.map(Utils_1.whatsappID);
                        emitParticipantsUpdate('remove');
                        // mark the chat read only if you left the group
                        if (participants.includes(this.user.jid)) {
                            chat.read_only = 'true';
                            chatUpdate.read_only = 'true';
                        }
                        break;
                    case Constants_1.WA_MESSAGE_STUB_TYPE.GROUP_PARTICIPANT_ADD:
                    case Constants_1.WA_MESSAGE_STUB_TYPE.GROUP_PARTICIPANT_INVITE:
                    case Constants_1.WA_MESSAGE_STUB_TYPE.GROUP_PARTICIPANT_ADD_REQUEST_JOIN:
                        participants = message.messageStubParameters.map(Utils_1.whatsappID);
                        if (participants.includes(this.user.jid) && chat.read_only === 'true') {
                            delete chat.read_only;
                            chatUpdate.read_only = 'false';
                        }
                        emitParticipantsUpdate('add');
                        break;
                    case Constants_1.WA_MESSAGE_STUB_TYPE.GROUP_CHANGE_ANNOUNCE:
                        const announce = message.messageStubParameters[0] === 'on' ? 'true' : 'false';
                        emitGroupUpdate({ announce });
                        break;
                    case Constants_1.WA_MESSAGE_STUB_TYPE.GROUP_CHANGE_RESTRICT:
                        const restrict = message.messageStubParameters[0] === 'on' ? 'true' : 'false';
                        emitGroupUpdate({ restrict });
                        break;
                    case Constants_1.WA_MESSAGE_STUB_TYPE.GROUP_CHANGE_SUBJECT:
                    case Constants_1.WA_MESSAGE_STUB_TYPE.GROUP_CREATE:
                        chat.name = message.messageStubParameters[0];
                        chatUpdate.name = chat.name;
                        if (chat.metadata)
                            chat.metadata.subject = chat.name;
                        break;
                }
            }
        }
        this.emit('chat-update', chatUpdate);
    }
    /** sets the profile picture of a chat */
    async setProfilePicture(chat) {
        chat.imgUrl = await this.getProfilePicture(chat.jid).catch(err => '');
    }
    on(event, listener) { return super.on(event, listener); }
    emit(event, ...args) { return super.emit(event, ...args); }
}
__decorate([
    (0, Mutex_1.Mutex)(jid => jid)
], WAConnection.prototype, "getProfilePicture", null);
exports.WAConnection = WAConnection;
