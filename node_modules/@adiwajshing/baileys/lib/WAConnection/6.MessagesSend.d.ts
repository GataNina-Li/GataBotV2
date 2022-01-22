/// <reference types="node" />
import { WAConnection as Base } from './5.User';
import { MessageOptions, MessageType, WALocationMessage, WAContactMessage, WAContactsArrayMessage, WAGroupInviteMessage, WAListMessage, WAButtonsMessage, WATextMessage, WAMessageContent, WAMessage, WAMessageProto, MediaConnInfo, WAMediaUpload } from './Constants';
import { Readable } from 'stream';
export declare class WAConnection extends Base {
    /**
     * Send a message to the given ID (can be group, single, or broadcast)
     * @param id the id to send to
     * @param message the message can be a buffer, plain string, location message, extended text message
     * @param type type of message
     * @param options Extra options
     */
    sendMessage(id: string, message: string | WATextMessage | WALocationMessage | WAContactMessage | WAContactsArrayMessage | WAGroupInviteMessage | WAMediaUpload | WAListMessage | WAButtonsMessage, type: MessageType, options?: MessageOptions): Promise<WAMessageProto.WebMessageInfo>;
    /**
     * Send a list message
     * @param id the id to send to
     * @param button the optional button text, title and description button
     * @param rows the rows of sections list message
     */
    sendListMessage(id: string, button: {
        buttonText?: string;
        description?: string;
        title?: string;
    }, rows?: any): Promise<WAMessageProto.WebMessageInfo>;
    /** Prepares a message for sending via sendWAMessage () */
    prepareMessage(id: string, message: string | WATextMessage | WALocationMessage | WAContactMessage | WAContactsArrayMessage | WAGroupInviteMessage | WAMediaUpload | WAListMessage | WAButtonsMessage, type: MessageType, options?: MessageOptions): Promise<WAMessageProto.WebMessageInfo>;
    /**
     * Toggles disappearing messages for the given chat
     *
     * @param jid the chat to toggle
     * @param ephemeralExpiration 0 to disable, enter any positive number to enable disappearing messages for the specified duration;
     * For the default see WA_DEFAULT_EPHEMERAL
     */
    toggleDisappearingMessages(jid: string, ephemeralExpiration?: number, opts?: {
        waitForAck: boolean;
    }): Promise<void>;
    /** Prepares the message content */
    prepareMessageContent(message: string | WATextMessage | WALocationMessage | WAContactMessage | WAContactsArrayMessage | WAGroupInviteMessage | WAMediaUpload | WAListMessage | WAButtonsMessage, type: MessageType, options: MessageOptions): Promise<WAMessageProto.Message>;
    prepareDisappearingMessageSettingContent(ephemeralExpiration?: number): WAMessageProto.Message;
    /** Prepare a media message for sending */
    prepareMessageMedia(media: WAMediaUpload, mediaType: MessageType, options?: MessageOptions): Promise<WAMessageProto.Message>;
    /** prepares a WAMessage for sending from the given content & options */
    prepareMessageFromContent(id: string, message: WAMessageContent, options: MessageOptions): WAMessageProto.WebMessageInfo;
    /** Relay (send) a WAMessage; more advanced functionality to send a built WA Message, you may want to stick with sendMessage() */
    relayWAMessage(message: WAMessage, { waitForAck }?: {
        waitForAck: boolean;
    }): Promise<void>;
    /**
     * Fetches the latest url & media key for the given message.
     * You may need to call this when the message is old & the content is deleted off of the WA servers
     * @param message
     */
    updateMediaMessage(message: WAMessage): Promise<void>;
    downloadMediaMessage(message: WAMessage): Promise<Buffer>;
    downloadMediaMessage(message: WAMessage, type: 'buffer'): Promise<Buffer>;
    downloadMediaMessage(message: WAMessage, type: 'stream'): Promise<Readable>;
    /**
     * Securely downloads the media from the message and saves to a file.
     * Renews the download url automatically, if necessary.
     * @param message the media message you want to decode
     * @param filename the name of the file where the media will be saved
     * @param attachExtension should the parsed extension be applied automatically to the file
     */
    downloadAndSaveMediaMessage(message: WAMessage, filename: string, attachExtension?: boolean): Promise<string>;
    /** Query a string to check if it has a url, if it does, return required extended text message */
    generateLinkPreview(text: string): Promise<WAMessageProto.ExtendedTextMessage>;
    protected refreshMediaConn(forceGet?: boolean): Promise<MediaConnInfo>;
    protected getNewMediaConn(): Promise<MediaConnInfo>;
}
