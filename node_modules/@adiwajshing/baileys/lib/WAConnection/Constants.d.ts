/// <reference types="node" />
import { WA } from '../Binary/Constants';
import { proto } from '../../WAMessage/WAMessage';
import { Agent } from 'https';
import KeyedDB from '@adiwajshing/keyed-db';
import { URL } from 'url';
export declare const WS_URL = "wss://web.whatsapp.com/ws";
export declare const DEFAULT_ORIGIN = "https://web.whatsapp.com";
export declare const KEEP_ALIVE_INTERVAL_MS: number;
export declare const WA_DEFAULT_EPHEMERAL: number;
export { proto as WAMessageProto };
export declare type WANode = WA.Node;
export declare type WAMessage = proto.WebMessageInfo;
export declare type WAMessageContent = proto.IMessage;
export declare type WAContactMessage = proto.ContactMessage;
export declare type WAContactsArrayMessage = proto.ContactsArrayMessage;
export declare type WAGroupInviteMessage = proto.GroupInviteMessage;
export declare type WAListMessage = proto.ListMessage;
export declare type WAButtonsMessage = proto.ButtonsMessage;
export declare type WAMessageKey = proto.IMessageKey;
export declare type WATextMessage = proto.ExtendedTextMessage;
export declare type WAContextInfo = proto.IContextInfo;
export declare type WAGenericMediaMessage = proto.IVideoMessage | proto.IImageMessage | proto.IAudioMessage | proto.IDocumentMessage | proto.IStickerMessage;
export import WA_MESSAGE_STUB_TYPE = proto.WebMessageInfo.WebMessageInfoStubType;
export import WA_MESSAGE_STATUS_TYPE = proto.WebMessageInfo.WebMessageInfoStatus;
export declare type WAInitResponse = {
    ref: string;
    ttl: number;
    status: 200;
};
export interface WABusinessProfile {
    description: string;
    email: string;
    business_hours: WABusinessHours;
    website: string[];
    categories: WABusinessCategories[];
    wid?: string;
}
export declare type WABusinessCategories = {
    id: string;
    localized_display_name: string;
};
export declare type WABusinessHours = {
    timezone: string;
    config?: WABusinessHoursConfig[];
    business_config?: WABusinessHoursConfig[];
};
export declare type WABusinessHoursConfig = {
    day_of_week: string;
    mode: string;
    open_time?: number;
    close_time?: number;
};
export interface WALocationMessage {
    degreesLatitude: number;
    degreesLongitude: number;
    address?: string;
}
/** Reverse stub type dictionary */
export declare const WA_MESSAGE_STUB_TYPES: Record<number, string>;
export declare class BaileysError extends Error {
    status?: number;
    context: any;
    constructor(message: string, context: any, stack?: string);
}
export declare const TimedOutError: (stack?: string) => BaileysError;
export declare const CancelledError: (stack?: string) => BaileysError;
export interface WAQuery {
    json: any[] | WANode;
    binaryTags?: WATag;
    timeoutMs?: number;
    tag?: string;
    expect200?: boolean;
    waitForOpen?: boolean;
    longTag?: boolean;
    requiresPhoneConnection?: boolean;
    startDebouncedTimeout?: boolean;
    maxRetries?: number;
}
export declare type WAMediaUpload = Buffer | {
    url: URL | string;
};
export declare enum ReconnectMode {
    /** does not reconnect */
    off = 0,
    /** reconnects only when the connection is 'lost' or 'close' */
    onConnectionLost = 1,
    /** reconnects on all disconnects, including take overs */
    onAllErrors = 2
}
export declare type WALoadChatOptions = {
    searchString?: string;
    custom?: (c: WAChat) => boolean;
};
export declare type WAConnectOptions = {
    /** fails the connection if no data is received for X seconds */
    maxIdleTimeMs?: number;
    /** maximum attempts to connect */
    maxRetries?: number;
    /** max time for the phone to respond to a connectivity test */
    phoneResponseTime?: number;
    connectCooldownMs?: number;
    /** agent used for WS connections */
    agent?: Agent;
    /** agent used for fetch requests -- uploading/downloading media */
    fetchAgent?: Agent;
    /** Always uses takeover for connections */
    alwaysUseTakeover?: boolean;
    /**
     * Sometimes WA does not send the chats,
     * this keeps pinging the phone to send the chats over
     * */
    queryChatsTillReceived?: boolean;
    /** max time for the phone to respond to a query */
    maxQueryResponseTime?: number;
    /** Log QR to terminal or not */
    logQR?: boolean;
};
/** from: https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url */
export declare const URL_REGEX: RegExp;
export declare type WAConnectionState = 'open' | 'connecting' | 'close';
export declare const UNAUTHORIZED_CODES: number[];
/** Types of Disconnect Reasons */
export declare enum DisconnectReason {
    /** The connection was closed intentionally */
    intentional = "intentional",
    /** The connection was terminated either by the client or server */
    close = "close",
    /** The connection was lost, called when the server stops responding to requests */
    lost = "lost",
    /** When WA Web is opened elsewhere & this session is disconnected */
    replaced = "replaced",
    /** The credentials for the session have been invalidated, i.e. logged out either from the phone or WA Web */
    invalidSession = "invalid_session",
    /** Received a 500 result in a query -- something has gone very wrong */
    badSession = "bad_session",
    /** No idea, can be a sign of log out too */
    unknown = "unknown",
    /** Well, the connection timed out */
    timedOut = "timed out"
}
export interface MediaConnInfo {
    auth: string;
    ttl: number;
    hosts: {
        hostname: string;
    }[];
    fetchDate: Date;
}
export interface AuthenticationCredentials {
    clientID: string;
    serverToken: string;
    clientToken: string;
    encKey: Buffer;
    macKey: Buffer;
}
export interface AuthenticationCredentialsBase64 {
    clientID: string;
    serverToken: string;
    clientToken: string;
    encKey: string;
    macKey: string;
}
export interface AuthenticationCredentialsBrowser {
    WABrowserId: string;
    WASecretBundle: {
        encKey: string;
        macKey: string;
    } | string;
    WAToken1: string;
    WAToken2: string;
}
export declare type AnyAuthenticationCredentials = AuthenticationCredentialsBrowser | AuthenticationCredentialsBase64 | AuthenticationCredentials;
export interface WAGroupCreateResponse {
    status: number;
    gid?: string;
    participants?: [{
        [key: string]: any;
    }];
}
export declare type WAGroupParticipant = (WAContact & {
    isAdmin: boolean;
    isSuperAdmin: boolean;
});
export interface WAGroupMetadata {
    id: string;
    owner: string;
    subject: string;
    creation: number;
    desc?: string;
    descOwner?: string;
    descId?: string;
    /** is set when the group only allows admins to change group settings */
    restrict?: 'true' | 'false';
    /** is set when the group only allows admins to write messages */
    announce?: 'true' | 'false';
    participants: WAGroupParticipant[];
}
export interface WAGroupModification {
    status: number;
    participants?: {
        [key: string]: any;
    };
}
export interface WAPresenceData {
    lastKnownPresence?: Presence;
    lastSeen?: number;
    name?: string;
}
export interface WAContact {
    verify?: string;
    /** name of the contact, the contact has set on their own on WA */
    notify?: string;
    jid: string;
    /** I have no idea */
    vname?: string;
    /** name of the contact, you have saved on your WA */
    name?: string;
    index?: string;
    /** short name for the contact */
    short?: string;
    imgUrl?: string;
}
export interface WAUser extends WAContact {
    phone: any;
}
export declare type WAContactUpdate = Partial<WAContact> & {
    jid: string;
    status?: string;
};
export interface WAChat {
    jid: string;
    t: number;
    /** number of unread messages, is < 0 if the chat is manually marked unread */
    count: number;
    archive?: 'true' | 'false';
    clear?: 'true' | 'false';
    read_only?: 'true' | 'false';
    mute?: string;
    pin?: string;
    spam?: 'false' | 'true';
    modify_tag?: string;
    name?: string;
    /** when ephemeral messages were toggled on */
    eph_setting_ts?: string;
    /** how long each message lasts for */
    ephemeral?: string;
    messages: KeyedDB<WAMessage, string>;
    imgUrl?: string;
    presences?: {
        [k: string]: WAPresenceData;
    };
    metadata?: WAGroupMetadata;
}
export declare type WAChatIndex = {
    index: string;
    owner: 'true' | 'false';
    participant?: string;
};
export declare type WAChatUpdate = Partial<WAChat> & {
    jid: string;
    hasNewMessage?: boolean;
};
export declare enum WAMetric {
    debugLog = 1,
    queryResume = 2,
    liveLocation = 3,
    queryMedia = 4,
    queryChat = 5,
    queryContact = 6,
    queryMessages = 7,
    presence = 8,
    presenceSubscribe = 9,
    group = 10,
    read = 11,
    chat = 12,
    received = 13,
    picture = 14,
    status = 15,
    message = 16,
    queryActions = 17,
    block = 18,
    queryGroup = 19,
    queryPreview = 20,
    queryEmoji = 21,
    queryRead = 22,
    queryVCard = 29,
    queryStatus = 30,
    queryStatusUpdate = 31,
    queryLiveLocation = 33,
    queryLabel = 36,
    queryQuickReply = 39
}
export declare const STORIES_JID = "status@broadcast";
export declare enum WAFlag {
    available = 160,
    other = 136,
    ignore = 128,
    acknowledge = 64,
    unavailable = 16,
    expires = 8,
    composing = 4,
    recording = 4,
    paused = 4
}
/** Tag used with binary queries */
export declare type WATag = [WAMetric, WAFlag];
/** set of statuses visible to other people; see updatePresence() in WhatsAppWeb.Send */
export declare enum Presence {
    unavailable = "unavailable",
    available = "available",
    composing = "composing",
    recording = "recording",
    paused = "paused"
}
/** Set of message types that are supported by the library */
export declare enum MessageType {
    text = "conversation",
    extendedText = "extendedTextMessage",
    contact = "contactMessage",
    contactsArray = "contactsArrayMessage",
    groupInviteMessage = "groupInviteMessage",
    listMessage = "listMessage",
    buttonsMessage = "buttonsMessage",
    location = "locationMessage",
    liveLocation = "liveLocationMessage",
    image = "imageMessage",
    video = "videoMessage",
    sticker = "stickerMessage",
    document = "documentMessage",
    audio = "audioMessage",
    product = "productMessage"
}
export declare const MessageTypeProto: {
    imageMessage: typeof proto.ImageMessage;
    videoMessage: typeof proto.VideoMessage;
    audioMessage: typeof proto.AudioMessage;
    stickerMessage: typeof proto.StickerMessage;
    documentMessage: typeof proto.DocumentMessage;
};
export declare enum ChatModification {
    archive = "archive",
    unarchive = "unarchive",
    pin = "pin",
    unpin = "unpin",
    mute = "mute",
    unmute = "unmute",
    delete = "delete",
    clear = "clear"
}
export declare const HKDFInfoKeys: {
    imageMessage: string;
    audioMessage: string;
    videoMessage: string;
    documentMessage: string;
    stickerMessage: string;
};
export declare enum Mimetype {
    jpeg = "image/jpeg",
    png = "image/png",
    mp4 = "video/mp4",
    gif = "video/gif",
    pdf = "application/pdf",
    ogg = "audio/ogg; codecs=opus",
    mp4Audio = "audio/mp4",
    /** for stickers */
    webp = "image/webp"
}
export interface MessageOptions {
    /** the message you want to quote */
    quoted?: WAMessage;
    /** some random context info (can show a forwarded message with this too) */
    contextInfo?: WAContextInfo;
    /** optional, if you want to manually set the timestamp of the message */
    timestamp?: Date;
    /** (for media messages) the caption to send with the media (cannot be sent with stickers though) */
    caption?: string;
    /**
     * For location & media messages -- has to be a base 64 encoded JPEG if you want to send a custom thumb,
     * or set to null if you don't want to send a thumbnail.
     * Do not enter this field if you want to automatically generate a thumb
     * */
    thumbnail?: string;
    /** (for media messages) specify the type of media (optional for all media types except documents) */
    mimetype?: Mimetype | string;
    /** (for media messages) file name for the media */
    filename?: string;
    /** For audio messages, if set to true, will send as a `voice note` */
    ptt?: boolean;
    /** For image or video messages, if set to true, will send as a `viewOnceMessage` */
    viewOnce?: boolean;
    /** Optional agent for media uploads */
    uploadAgent?: Agent;
    /** If set to true (default), automatically detects if you're sending a link & attaches the preview*/
    detectLinks?: boolean;
    /** Optionally specify the duration of the media (audio/video) in seconds */
    duration?: number;
    /** Fetches new media options for every media file */
    forceNewMediaOptions?: boolean;
    /** Wait for the message to be sent to the server (default true) */
    waitForAck?: boolean;
    /** Should it send as a disappearing messages.
     * By default 'chat' -- which follows the setting of the chat */
    sendEphemeral?: 'chat' | boolean;
    /** Force message id */
    messageId?: string;
    /** For sticker messages, if set to true, will considered as animated sticker  */
    isAnimated?: boolean;
}
export interface WABroadcastListInfo {
    status: number;
    name: string;
    recipients?: {
        id: string;
    }[];
}
export interface WAUrlInfo {
    'canonical-url': string;
    'matched-text': string;
    title: string;
    description: string;
    jpegThumbnail?: Buffer;
}
export interface WAProfilePictureChange {
    status: number;
    tag: string;
    eurl: string;
}
export interface MessageInfo {
    reads: {
        jid: string;
        t: string;
    }[];
    deliveries: {
        jid: string;
        t: string;
    }[];
}
export interface WAMessageStatusUpdate {
    from: string;
    to: string;
    /** Which participant caused the update (only for groups) */
    participant?: string;
    timestamp: Date;
    /** Message IDs read/delivered */
    ids: string[];
    /** Status of the Message IDs */
    type: WA_MESSAGE_STATUS_TYPE;
}
export interface WAOpenResult {
    /** Was this connection opened via a QR scan */
    newConnection?: true;
    user: WAUser;
    isNewUser?: true;
    auth: AuthenticationCredentials;
}
export declare enum GroupSettingChange {
    messageSend = "announcement",
    settingsChange = "locked"
}
export interface PresenceUpdate {
    id: string;
    participant?: string;
    t?: string;
    type?: Presence;
    deny?: boolean;
}
export interface BlocklistUpdate {
    added?: string[];
    removed?: string[];
}
export declare const MediaPathMap: {
    imageMessage: string;
    videoMessage: string;
    documentMessage: string;
    audioMessage: string;
    stickerMessage: string;
};
export declare const MimetypeMap: {
    imageMessage: Mimetype;
    videoMessage: Mimetype;
    documentMessage: Mimetype;
    audioMessage: Mimetype;
    stickerMessage: Mimetype;
};
export declare type WAParticipantAction = 'add' | 'remove' | 'promote' | 'demote';
export declare type BaileysEvent = 'open' | 'connecting' | 'close' | 'ws-close' | 'qr' | 'connection-phone-change' | 'contacts-received' | 'chats-received' | 'initial-data-received' | 'chat-new' | 'chat-update' | 'group-participants-update' | 'group-update' | 'received-pong' | 'blocklist-update' | 'contact-update';
