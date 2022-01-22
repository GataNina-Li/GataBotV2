import { WAConnection as Base } from './7.MessagesExtra';
import { WANode, WAGroupMetadata, WAGroupCreateResponse, WAGroupModification } from '../WAConnection/Constants';
import { GroupSettingChange } from './Constants';
export declare class WAConnection extends Base {
    /** Generic function for group queries */
    groupQuery(type: string, jid?: string, subject?: string, participants?: string[], additionalNodes?: WANode[]): Promise<{
        status: number;
    }>;
    /**
     * Get the metadata of the group
     * Baileys automatically caches & maintains this state
     */
    groupMetadata(jid: string): Promise<WAGroupMetadata>;
    /** Get the metadata of the group from WA */
    fetchGroupMetadataFromWA: (jid: string) => Promise<WAGroupMetadata>;
    /** Get the metadata (works after you've left the group also) */
    groupMetadataMinimal: (jid: string) => Promise<WAGroupMetadata>;
    /**
     * Create a group
     * @param title like, the title of the group
     * @param participants people to include in the group
     */
    groupCreate: (title: string, participants: string[]) => Promise<WAGroupCreateResponse>;
    /**
     * Leave a group
     * @param jid the ID of the group
     */
    groupLeave: (jid: string) => Promise<{
        status: number;
    }>;
    /**
     * Update the subject of the group
     * @param {string} jid the ID of the group
     * @param {string} title the new title of the group
     */
    groupUpdateSubject: (jid: string, title: string) => Promise<{
        status: number;
    }>;
    /**
     * Update the group description
     * @param {string} jid the ID of the group
     * @param {string} title the new title of the group
     */
    groupUpdateDescription: (jid: string, description: string) => Promise<{
        status: number;
    }>;
    /**
     * Add somebody to the group
     * @param jid the ID of the group
     * @param participants the people to add
     */
    groupAdd: (jid: string, participants: string[]) => Promise<WAGroupModification>;
    /**
     * Remove somebody from the group
     * @param jid the ID of the group
     * @param participants the people to remove
     */
    groupRemove: (jid: string, participants: string[]) => Promise<WAGroupModification>;
    /**
     * Make someone admin on the group
     * @param jid the ID of the group
     * @param participants the people to make admin
     */
    groupMakeAdmin: (jid: string, participants: string[]) => Promise<WAGroupModification>;
    /**
     * Make demote an admin on the group
     * @param jid the ID of the group
     * @param participants the people to make admin
     */
    groupDemoteAdmin: (jid: string, participants: string[]) => Promise<WAGroupModification>;
    /**
     * Make demote an admin on the group
     * @param jid the ID of the group
     * @param participants the people to make admin
     */
    groupSettingChange: (jid: string, setting: GroupSettingChange, onlyAdmins: boolean) => Promise<{
        status: number;
    }>;
    /**
     * Get the invite link of the given group
     * @param jid the ID of the group
     * @returns invite code
     */
    groupInviteCode(jid: string): Promise<string>;
    /**
     * Join group via invite code
     * @param code the invite code
     * @returns Object containing gid
     */
    acceptInvite(code: string): Promise<any>;
    /**
     * Revokes the current invite link for a group chat
     * @param jid the ID of the group
     */
    revokeInvite(jid: string): Promise<any>;
}
