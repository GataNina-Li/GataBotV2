/// <reference types="node" />
import { WAConnection as Base } from './4.Events';
import { Presence, WABroadcastListInfo, WAProfilePictureChange, WALoadChatOptions, WABusinessProfile } from './Constants';
import { WAMessage } from '../WAConnection/Constants';
export declare class WAConnection extends Base {
    /**
     * Query whether a given number is registered on WhatsApp
     * @param str phone number/jid you want to check for
     * @returns undefined if the number doesn't exists, otherwise the correctly formatted jid
     */
    isOnWhatsApp: (str: string) => Promise<{
        exists: boolean;
        jid: string;
        isBusiness: boolean;
    }>;
    /**
     * Tell someone about your presence -- online, typing, offline etc.
     * @param jid the ID of the person/group who you are updating
     * @param type your presence
     */
    updatePresence: (jid: string | null, type: Presence) => Promise<string>;
    /** Request an update on the presence of a user */
    requestPresenceUpdate: (jid: string) => Promise<any>;
    /** Query the status of the person (see groupMetadata() for groups) */
    getStatus(jid?: string): Promise<{
        status: string;
    }>;
    setStatus(status: string): Promise<{
        status: number;
    }>;
    /** Updates business profile. */
    updateBusinessProfile(profile: WABusinessProfile): Promise<{
        status: any;
    }>;
    updateProfileName(name: string): Promise<{
        status: number;
        pushname: string;
    }>;
    /** Get your contacts */
    getContacts(): Promise<any>;
    /** Get the stories of your contacts */
    getStories(): Promise<{
        unread: number;
        count: number;
        messages: WAMessage[];
    }[]>;
    /** Fetch your chats */
    getChats(): Promise<any>;
    /** Query broadcast list info */
    getBroadcastListInfo(jid: string): Promise<WABroadcastListInfo>;
    /**
     * Load chats in a paginated manner + gets the profile picture
     * @param before chats before the given cursor
     * @param count number of results to return
     * @param searchString optionally search for users
     * @returns the chats & the cursor to fetch the next page
     */
    loadChats(count: number, before: string | null, options?: WALoadChatOptions): {
        chats: import("./Constants").WAChat[];
        cursor: string;
    };
    /**
     * Update the profile picture
     * @param jid
     * @param img
     */
    updateProfilePicture(jid: string, img: Buffer): Promise<WAProfilePictureChange>;
    /**
     * Add or remove user from blocklist
     * @param jid the ID of the person who you are blocking/unblocking
     * @param type type of operation
     */
    blockUser(jid: string, type?: 'add' | 'remove'): Promise<{
        status: number;
    }>;
    /**
     * Query Business Profile (Useful for VCards)
     * @param jid Business Jid
     * @returns {WABusinessProfile} profile object or undefined if not business account
     */
    getBusinessProfile(jid: string): Promise<any>;
}
