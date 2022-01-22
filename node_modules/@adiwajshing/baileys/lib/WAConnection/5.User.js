"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAConnection = void 0;
const _4_Events_1 = require("./4.Events");
const Constants_1 = require("../WAConnection/Constants");
const Utils_1 = require("./Utils");
const Mutex_1 = require("./Mutex");
// All user related functions -- get profile picture, set status etc.
class WAConnection extends _4_Events_1.WAConnection {
    constructor() {
        super(...arguments);
        /**
         * Query whether a given number is registered on WhatsApp
         * @param str phone number/jid you want to check for
         * @returns undefined if the number doesn't exists, otherwise the correctly formatted jid
         */
        this.isOnWhatsApp = async (str) => {
            const { status, jid, biz } = await this.query({ json: ['query', 'exist', str], requiresPhoneConnection: false });
            if (status === 200)
                return { exists: true, jid: Utils_1.whatsappID(jid), isBusiness: biz };
        };
        /**
         * Tell someone about your presence -- online, typing, offline etc.
         * @param jid the ID of the person/group who you are updating
         * @param type your presence
         */
        this.updatePresence = (jid, type) => this.sendBinary(['action',
            { epoch: this.msgCount.toString(), type: 'set' },
            [['presence', { type: type, to: jid }, null]]
        ], [Constants_1.WAMetric.presence, Constants_1.WAFlag[type]], // weird stuff WA does
        undefined, true);
        /** Request an update on the presence of a user */
        this.requestPresenceUpdate = async (jid) => this.query({ json: ['action', 'presence', 'subscribe', jid] });
    }
    /** Query the status of the person (see groupMetadata() for groups) */
    async getStatus(jid) {
        const status = await this.query({ json: ['query', 'Status', jid || this.user.jid], requiresPhoneConnection: false });
        return status;
    }
    async setStatus(status) {
        const response = await this.setQuery([
            [
                'status',
                null,
                Buffer.from(status, 'utf-8')
            ]
        ]);
        this.emit('contact-update', { jid: this.user.jid, status });
        return response;
    }
    /** Updates business profile. */
    async updateBusinessProfile(profile) {
        var _a;
        if ((_a = profile.business_hours) === null || _a === void 0 ? void 0 : _a.config) {
            profile.business_hours.business_config = profile.business_hours.config;
            delete profile.business_hours.config;
        }
        const json = ['action', "editBusinessProfile", { ...profile, v: 2 }];
        let response;
        try {
            response = await this.query({ json, expect200: true, requiresPhoneConnection: true });
        }
        catch (_) {
            return { status: 400 };
        }
        return { status: response.status };
    }
    async updateProfileName(name) {
        const response = (await this.setQuery([
            [
                'profile',
                {
                    name
                },
                null
            ]
        ]));
        if (response.status === 200) {
            this.user.name = response.pushname;
            this.emit('contact-update', { jid: this.user.jid, name });
        }
        return response;
    }
    /** Get your contacts */
    async getContacts() {
        const json = ['query', { epoch: this.msgCount.toString(), type: 'contacts' }, null];
        const response = await this.query({ json, binaryTags: [Constants_1.WAMetric.queryContact, Constants_1.WAFlag.ignore], expect200: true, requiresPhoneConnection: true }); // this has to be an encrypted query
        return response;
    }
    /** Get the stories of your contacts */
    async getStories() {
        const json = ['query', { epoch: this.msgCount.toString(), type: 'status' }, null];
        const response = await this.query({ json, binaryTags: [Constants_1.WAMetric.queryStatus, Constants_1.WAFlag.ignore], expect200: true, requiresPhoneConnection: true });
        if (Array.isArray(response[2])) {
            return response[2].map(row => {
                var _a, _b;
                return ({
                    unread: (_a = row[1]) === null || _a === void 0 ? void 0 : _a.unread,
                    count: (_b = row[1]) === null || _b === void 0 ? void 0 : _b.count,
                    messages: Array.isArray(row[2]) ? row[2].map(m => m[2]) : []
                });
            });
        }
        return [];
    }
    /** Fetch your chats */
    async getChats() {
        const json = ['query', { epoch: this.msgCount.toString(), type: 'chat' }, null];
        return this.query({ json, binaryTags: [5, Constants_1.WAFlag.ignore], expect200: true }); // this has to be an encrypted query
    }
    /** Query broadcast list info */
    async getBroadcastListInfo(jid) {
        return this.query({
            json: ['query', 'contact', jid],
            expect200: true,
            requiresPhoneConnection: true
        });
    }
    /**
     * Load chats in a paginated manner + gets the profile picture
     * @param before chats before the given cursor
     * @param count number of results to return
     * @param searchString optionally search for users
     * @returns the chats & the cursor to fetch the next page
     */
    loadChats(count, before, options = {}) {
        var _a;
        const searchString = (_a = options.searchString) === null || _a === void 0 ? void 0 : _a.toLowerCase();
        const chats = this.chats.paginated(before, count, options && (chat => {
            var _a, _b;
            return ((typeof (options === null || options === void 0 ? void 0 : options.custom) !== 'function' || (options === null || options === void 0 ? void 0 : options.custom(chat))) &&
                (typeof searchString === 'undefined' || ((_a = chat.name) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchString)) || ((_b = chat.jid) === null || _b === void 0 ? void 0 : _b.includes(searchString))));
        }));
        const cursor = (chats[chats.length - 1] && chats.length >= count) && this.chatOrderingKey.key(chats[chats.length - 1]);
        return { chats, cursor };
    }
    /**
     * Update the profile picture
     * @param jid
     * @param img
     */
    async updateProfilePicture(jid, img) {
        jid = Utils_1.whatsappID(jid);
        const data = await Utils_1.generateProfilePicture(img);
        const tag = this.generateMessageTag();
        const query = [
            'picture',
            { jid: jid, id: tag, type: 'set' },
            [
                ['image', null, data.img],
                ['preview', null, data.preview]
            ]
        ];
        const response = await this.setQuery([query], [Constants_1.WAMetric.picture, 136], tag);
        if (jid === this.user.jid)
            this.user.imgUrl = response.eurl;
        else if (this.chats.get(jid)) {
            this.chats.get(jid).imgUrl = response.eurl;
            this.emit('chat-update', { jid, imgUrl: response.eurl });
        }
        return response;
    }
    /**
     * Add or remove user from blocklist
     * @param jid the ID of the person who you are blocking/unblocking
     * @param type type of operation
     */
    async blockUser(jid, type = 'add') {
        const json = [
            'block',
            {
                type: type,
            },
            [
                ['user', { jid }, null]
            ],
        ];
        const result = await this.setQuery([json], [Constants_1.WAMetric.block, Constants_1.WAFlag.ignore]);
        if (result.status === 200) {
            if (type === 'add') {
                this.blocklist.push(jid);
            }
            else {
                const index = this.blocklist.indexOf(jid);
                if (index !== -1) {
                    this.blocklist.splice(index, 1);
                }
            }
            // Blocklist update event
            const update = { added: [], removed: [] };
            let key = type === 'add' ? 'added' : 'removed';
            update[key] = [jid];
            this.emit('blocklist-update', update);
        }
        return result;
    }
    /**
     * Query Business Profile (Useful for VCards)
     * @param jid Business Jid
     * @returns {WABusinessProfile} profile object or undefined if not business account
     */
    async getBusinessProfile(jid) {
        jid = Utils_1.whatsappID(jid);
        const { profiles: [{ profile, wid }] } = await this.query({
            json: ["query", "businessProfile", [
                    {
                        "wid": jid.replace('@s.whatsapp.net', '@c.us')
                    }
                ], 84],
            expect200: true,
            requiresPhoneConnection: false,
        });
        return {
            ...profile,
            wid: Utils_1.whatsappID(wid)
        };
    }
}
__decorate([
    Mutex_1.Mutex(jid => jid)
], WAConnection.prototype, "updateProfilePicture", null);
__decorate([
    Mutex_1.Mutex(jid => jid)
], WAConnection.prototype, "blockUser", null);
exports.WAConnection = WAConnection;
