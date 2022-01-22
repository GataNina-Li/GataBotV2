import { WAConnection as Base } from './6.MessagesSend';
import { WAMessageKey, MessageInfo, WAMessage, WAMessageProto, ChatModification, WAChatIndex } from './Constants';
export declare class WAConnection extends Base {
    loadAllUnreadMessages(): Promise<WAMessageProto.WebMessageInfo[]>;
    /** Get the message info, who has read it, who its been delivered to */
    messageInfo(jid: string, messageID: string): Promise<MessageInfo>;
    /**
     * Marks a chat as read/unread; updates the chat object too
     * @param jid the ID of the person/group whose message you want to mark read
     * @param unread unreads the chat, if true
     */
    chatRead(jid: string, type?: 'unread' | 'read'): Promise<void>;
    /**
     * Sends a read receipt for a given message;
     * does not update the chat do @see chatRead
     * @deprecated just use chatRead()
     * @param jid the ID of the person/group whose message you want to mark read
     * @param messageKey the key of the message
     * @param count number of messages to read, set to < 0 to unread a message
     */
    sendReadReceipt(jid: string, messageKey: WAMessageKey, count: number): Promise<{
        status: number;
    }>;
    fetchMessagesFromWA(jid: string, count: number, indexMessage?: {
        id?: string;
        fromMe?: boolean;
    }, mostRecentFirst?: boolean): Promise<WAMessageProto.WebMessageInfo[]>;
    /**
     * Load the conversation with a group or person
     * @param count the number of messages to load
     * @param cursor the data for which message to offset the query by
     * @param mostRecentFirst retrieve the most recent message first or retrieve from the converation start
     */
    loadMessages(jid: string, count: number, cursor?: {
        id?: string;
        fromMe?: boolean;
    }, mostRecentFirst?: boolean): Promise<{
        messages: WAMessageProto.WebMessageInfo[];
        cursor: {
            id?: string;
            fromMe?: boolean;
        };
    }>;
    /**
     * Load the entire friggin conversation with a group or person
     * @param onMessage callback for every message retrieved
     * @param chunkSize the number of messages to load in a single request
     * @param mostRecentFirst retrieve the most recent message first or retrieve from the converation start
     */
    loadAllMessages(jid: string, onMessage: (m: WAMessage) => Promise<void> | void, chunkSize?: number, mostRecentFirst?: boolean): Promise<void>;
    /**
     * Find a message in a given conversation
     * @param chunkSize the number of messages to load in a single request
     * @param onMessage callback for every message retrieved, if return true -- the loop will break
     */
    findMessage(jid: string, chunkSize: number, onMessage: (m: WAMessage) => boolean): Promise<void>;
    /**
     * Loads all messages sent after a specific date
     */
    messagesReceivedAfter(date: Date, onlyUnrespondedMessages?: boolean): Promise<WAMessageProto.WebMessageInfo[]>;
    /** Load a single message specified by the ID */
    loadMessage(jid: string, id: string): Promise<WAMessageProto.WebMessageInfo>;
    /**
     * Search WhatsApp messages with a given text string
     * @param txt the search string
     * @param inJid the ID of the chat to search in, set to null to search all chats
     * @param count number of results to return
     * @param page page number of results (starts from 1)
     */
    searchMessages(txt: string, inJid: string | null, count: number, page: number): Promise<{
        last: boolean;
        messages: WAMessageProto.WebMessageInfo[];
    }>;
    /**
     * Delete a message in a chat for yourself
     * @param messageKey key of the message you want to delete
     */
    clearMessage(messageKey: WAMessageKey): Promise<{
        status: number;
    }>;
    /**
     * Star or unstar a message
     * @param messageKey key of the message you want to star or unstar
     */
    starMessage(messageKey: WAMessageKey, type?: 'star' | 'unstar'): Promise<{
        status: number;
    }>;
    /**
     * Delete a message in a chat for everyone
     * @param id the person or group where you're trying to delete the message
     * @param messageKey key of the message you want to delete
     */
    deleteMessage(k: string | WAMessageKey, messageKey?: WAMessageKey): Promise<WAMessageProto.WebMessageInfo>;
    /**
     * Generate forwarded message content like WA does
     * @param message the message to forward
     * @param forceForward will show the message as forwarded even if it is from you
     */
    generateForwardMessageContent(message: WAMessage, forceForward?: boolean): WAMessageProto.IMessage;
    /**
     * Forward a message like WA
     * @param jid the chat ID to forward to
     * @param message the message to forward
     * @param forceForward will show the message as forwarded even if it is from you
     */
    forwardMessage(jid: string, message: WAMessage, forceForward?: boolean): Promise<WAMessageProto.WebMessageInfo>;
    /**
     * Clear the chat messages
     * @param jid the ID of the person/group you are modifiying
     * @param includeStarred delete starred messages, default false
     */
    modifyChat(jid: string, type: ChatModification.clear, includeStarred?: boolean): Promise<{
        status: number;
    }>;
    /**
     * Modify a given chat (archive, pin etc.)
     * @param jid the ID of the person/group you are modifiying
     * @param durationMs only for muting, how long to mute the chat for
     */
    modifyChat(jid: string, type: ChatModification.pin | ChatModification.mute, durationMs: number): Promise<{
        status: number;
    }>;
    /**
     * Modify a given chat (archive, pin etc.)
     * @param jid the ID of the person/group you are modifiying
     */
    modifyChat(jid: string, type: ChatModification | (keyof typeof ChatModification)): Promise<{
        status: number;
    }>;
    protected getChatIndex(jid: string): Promise<WAChatIndex>;
}
