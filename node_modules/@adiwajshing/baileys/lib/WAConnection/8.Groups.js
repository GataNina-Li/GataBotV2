"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WAConnection = void 0;
const _7_MessagesExtra_1 = require("./7.MessagesExtra");
const Constants_1 = require("../WAConnection/Constants");
const Utils_1 = require("../WAConnection/Utils");
const Mutex_1 = require("./Mutex");
class WAConnection extends _7_MessagesExtra_1.WAConnection {
    constructor() {
        super(...arguments);
        /** Get the metadata of the group from WA */
        this.fetchGroupMetadataFromWA = async (jid) => {
            const metadata = await this.query({ json: ['query', 'GroupMetadata', jid], expect200: true });
            metadata.participants = metadata.participants.map(p => ({ ...this.contactAddOrGet(p.id), ...p }));
            return metadata;
        };
        /** Get the metadata (works after you've left the group also) */
        this.groupMetadataMinimal = async (jid) => {
            const query = ['query', { type: 'group', jid: jid, epoch: this.msgCount.toString() }, null];
            const response = await this.query({ json: query, binaryTags: [Constants_1.WAMetric.group, Constants_1.WAFlag.ignore], expect200: true });
            const json = response[2][0];
            const creatorDesc = json[1];
            const participants = json[2] ? json[2].filter(item => item[0] === 'participant') : [];
            const description = json[2] ? json[2].find(item => item[0] === 'description') : null;
            return {
                id: jid,
                owner: creatorDesc === null || creatorDesc === void 0 ? void 0 : creatorDesc.creator,
                creator: creatorDesc === null || creatorDesc === void 0 ? void 0 : creatorDesc.creator,
                creation: parseInt(creatorDesc === null || creatorDesc === void 0 ? void 0 : creatorDesc.create),
                subject: null,
                desc: description && description[2].toString('utf-8'),
                participants: participants.map(item => ({ ...this.contactAddOrGet(item[1].jid), isAdmin: item[1].type === 'admin' }))
            };
        };
        /**
         * Create a group
         * @param title like, the title of the group
         * @param participants people to include in the group
         */
        this.groupCreate = async (title, participants) => {
            const response = await this.groupQuery('create', null, title, participants);
            const gid = response.gid;
            let metadata;
            try {
                metadata = await this.groupMetadata(gid);
            }
            catch (error) {
                this.logger.warn(`error in group creation: ${error}, switching gid & checking`);
                // if metadata is not available
                const comps = gid.replace('@g.us', '').split('-');
                response.gid = `${comps[0]}-${+comps[1] + 1}@g.us`;
                metadata = await this.groupMetadata(gid);
                this.logger.warn(`group ID switched from ${gid} to ${response.gid}`);
            }
            await this.chatAdd(response.gid, title, { metadata });
            return response;
        };
        /**
         * Leave a group
         * @param jid the ID of the group
         */
        this.groupLeave = async (jid) => {
            const response = await this.groupQuery('leave', jid);
            const chat = this.chats.get(jid);
            if (chat)
                chat.read_only = 'true';
            return response;
        };
        /**
         * Update the subject of the group
         * @param {string} jid the ID of the group
         * @param {string} title the new title of the group
         */
        this.groupUpdateSubject = async (jid, title) => {
            const chat = this.chats.get(jid);
            if ((chat === null || chat === void 0 ? void 0 : chat.name) === title)
                throw new Constants_1.BaileysError('redundant change', { status: 400 });
            const response = await this.groupQuery('subject', jid, title);
            if (chat)
                chat.name = title;
            return response;
        };
        /**
         * Update the group description
         * @param {string} jid the ID of the group
         * @param {string} title the new title of the group
         */
        this.groupUpdateDescription = async (jid, description) => {
            const metadata = await this.groupMetadata(jid);
            const node = [
                'description',
                { id: Utils_1.generateMessageID(), prev: metadata === null || metadata === void 0 ? void 0 : metadata.descId },
                Buffer.from(description, 'utf-8')
            ];
            const response = await this.groupQuery('description', jid, null, null, [node]);
            return response;
        };
        /**
         * Add somebody to the group
         * @param jid the ID of the group
         * @param participants the people to add
         */
        this.groupAdd = (jid, participants) => this.groupQuery('add', jid, null, participants);
        /**
         * Remove somebody from the group
         * @param jid the ID of the group
         * @param participants the people to remove
         */
        this.groupRemove = (jid, participants) => this.groupQuery('remove', jid, null, participants);
        /**
         * Make someone admin on the group
         * @param jid the ID of the group
         * @param participants the people to make admin
         */
        this.groupMakeAdmin = (jid, participants) => this.groupQuery('promote', jid, null, participants);
        /**
         * Make demote an admin on the group
         * @param jid the ID of the group
         * @param participants the people to make admin
         */
        this.groupDemoteAdmin = (jid, participants) => this.groupQuery('demote', jid, null, participants);
        /**
         * Make demote an admin on the group
         * @param jid the ID of the group
         * @param participants the people to make admin
         */
        this.groupSettingChange = (jid, setting, onlyAdmins) => {
            const node = [setting, { value: onlyAdmins ? 'true' : 'false' }, null];
            return this.groupQuery('prop', jid, null, null, [node]);
        };
    }
    /** Generic function for group queries */
    async groupQuery(type, jid, subject, participants, additionalNodes) {
        const tag = this.generateMessageTag();
        const json = [
            'group',
            {
                author: this.user.jid,
                id: tag,
                type: type,
                jid: jid,
                subject: subject,
            },
            participants ? participants.map(jid => ['participant', { jid }, null]) : additionalNodes,
        ];
        const result = await this.setQuery([json], [Constants_1.WAMetric.group, 136], tag);
        return result;
    }
    /**
     * Get the metadata of the group
     * Baileys automatically caches & maintains this state
     */
    async groupMetadata(jid) {
        const chat = this.chats.get(jid);
        let metadata = chat === null || chat === void 0 ? void 0 : chat.metadata;
        if (!metadata) {
            if (chat === null || chat === void 0 ? void 0 : chat.read_only) {
                metadata = await this.groupMetadataMinimal(jid);
            }
            else {
                metadata = await this.fetchGroupMetadataFromWA(jid);
            }
            if (chat)
                chat.metadata = metadata;
        }
        return metadata;
    }
    /**
     * Get the invite link of the given group
     * @param jid the ID of the group
     * @returns invite code
     */
    async groupInviteCode(jid) {
        const json = ['query', 'inviteCode', jid];
        const response = await this.query({ json, expect200: true, requiresPhoneConnection: false });
        return response.code;
    }
    /**
     * Join group via invite code
     * @param code the invite code
     * @returns Object containing gid
     */
    async acceptInvite(code) {
        const json = ['action', 'invite', code];
        const response = await this.query({ json, expect200: true });
        return response;
    }
    /**
     * Revokes the current invite link for a group chat
     * @param jid the ID of the group
     */
    async revokeInvite(jid) {
        const json = ['action', 'inviteReset', jid];
        const response = await this.query({ json, expect200: true });
        return response;
    }
}
__decorate([
    Mutex_1.Mutex(jid => jid)
], WAConnection.prototype, "groupMetadata", null);
exports.WAConnection = WAConnection;
