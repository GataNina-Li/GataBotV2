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
exports.extensionForMediaMessage = exports.decryptMediaMessageBuffer = exports.encryptedStream = exports.getGotStream = exports.generateThumbnail = exports.getStream = exports.toReadable = exports.getAudioDuration = exports.mediaMessageSHA256B64 = exports.ProxyAgent = exports.generateProfilePicture = exports.compressImage = exports.getMediaKeys = exports.decryptWA = exports.generateMessageID = exports.generateClientID = exports.generateMessageTag = exports.promiseTimeout = exports.delayCancellable = exports.delay = exports.debouncedTimeout = exports.unixTimestampSeconds = exports.randomBytes = exports.hkdf = exports.sha256 = exports.hmacSign = exports.aesEncrypWithIV = exports.aesEncrypt = exports.aesDecryptWithIV = exports.aesDecrypt = exports.shallowChanges = exports.newMessagesDB = exports.isGroupID = exports.whatsappID = exports.GET_MESSAGE_ID = exports.WA_MESSAGE_ID = exports.waMessageKey = exports.waChatKey = exports.toNumber = exports.Browsers = void 0;
const Crypto = __importStar(require("crypto"));
const stream_1 = require("stream");
const futoin_hkdf_1 = __importDefault(require("futoin-hkdf"));
const jimp_1 = __importDefault(require("jimp"));
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const os_1 = require("os");
const https_proxy_agent_1 = __importDefault(require("https-proxy-agent"));
const Constants_1 = require("./Constants");
const keyed_db_1 = __importDefault(require("@adiwajshing/keyed-db"));
const got_1 = __importDefault(require("got"));
const path_1 = require("path");
const events_1 = require("events");
const platformMap = {
    'aix': 'AIX',
    'darwin': 'Mac OS',
    'win32': 'Windows',
    'android': 'Android'
};
exports.Browsers = {
    ubuntu: browser => ['Ubuntu', browser, '18.04'],
    macOS: browser => ['Mac OS', browser, '10.15.3'],
    baileys: browser => ['Baileys', browser, '3.0'],
    /** The appropriate browser based on your OS & release */
    appropriate: browser => [platformMap[os_1.platform()] || 'Ubuntu', browser, os_1.release()]
};
const toNumber = (t) => (t['low'] || t);
exports.toNumber = toNumber;
const waChatKey = (pin) => ({
    key: (c) => (pin ? (c.pin ? '1' : '0') : '') + (c.archive === 'true' ? '0' : '1') + c.t.toString(16).padStart(8, '0') + c.jid,
    compare: (k1, k2) => k2.localeCompare(k1)
});
exports.waChatKey = waChatKey;
exports.waMessageKey = {
    key: (m) => (5000 + (m['epoch'] || 0)).toString(16).padStart(6, '0') + exports.toNumber(m.messageTimestamp).toString(16).padStart(8, '0'),
    compare: (k1, k2) => k1.localeCompare(k2)
};
const WA_MESSAGE_ID = (m) => exports.GET_MESSAGE_ID(m.key);
exports.WA_MESSAGE_ID = WA_MESSAGE_ID;
const GET_MESSAGE_ID = (key) => `${key.id}|${key.fromMe ? 1 : 0}`;
exports.GET_MESSAGE_ID = GET_MESSAGE_ID;
const whatsappID = (jid) => jid === null || jid === void 0 ? void 0 : jid.replace('@c.us', '@s.whatsapp.net');
exports.whatsappID = whatsappID;
const isGroupID = (jid) => jid === null || jid === void 0 ? void 0 : jid.endsWith('@g.us');
exports.isGroupID = isGroupID;
const newMessagesDB = (messages = []) => {
    const db = new keyed_db_1.default(exports.waMessageKey, exports.WA_MESSAGE_ID);
    messages.forEach(m => !db.get(exports.WA_MESSAGE_ID(m)) && db.insert(m));
    return db;
};
exports.newMessagesDB = newMessagesDB;
function shallowChanges(old, current, { lookForDeletedKeys }) {
    let changes = {};
    for (let key in current) {
        if (old[key] !== current[key]) {
            changes[key] = current[key] || null;
        }
    }
    if (lookForDeletedKeys) {
        for (let key in old) {
            if (!changes[key] && old[key] !== current[key]) {
                changes[key] = current[key] || null;
            }
        }
    }
    return changes;
}
exports.shallowChanges = shallowChanges;
/** decrypt AES 256 CBC; where the IV is prefixed to the buffer */
function aesDecrypt(buffer, key) {
    return aesDecryptWithIV(buffer.slice(16, buffer.length), key, buffer.slice(0, 16));
}
exports.aesDecrypt = aesDecrypt;
/** decrypt AES 256 CBC */
function aesDecryptWithIV(buffer, key, IV) {
    const aes = Crypto.createDecipheriv('aes-256-cbc', key, IV);
    return Buffer.concat([aes.update(buffer), aes.final()]);
}
exports.aesDecryptWithIV = aesDecryptWithIV;
// encrypt AES 256 CBC; where a random IV is prefixed to the buffer
function aesEncrypt(buffer, key) {
    const IV = randomBytes(16);
    const aes = Crypto.createCipheriv('aes-256-cbc', key, IV);
    return Buffer.concat([IV, aes.update(buffer), aes.final()]); // prefix IV to the buffer
}
exports.aesEncrypt = aesEncrypt;
// encrypt AES 256 CBC with a given IV
function aesEncrypWithIV(buffer, key, IV) {
    const aes = Crypto.createCipheriv('aes-256-cbc', key, IV);
    return Buffer.concat([aes.update(buffer), aes.final()]); // prefix IV to the buffer
}
exports.aesEncrypWithIV = aesEncrypWithIV;
// sign HMAC using SHA 256
function hmacSign(buffer, key) {
    return Crypto.createHmac('sha256', key).update(buffer).digest();
}
exports.hmacSign = hmacSign;
function sha256(buffer) {
    return Crypto.createHash('sha256').update(buffer).digest();
}
exports.sha256 = sha256;
// HKDF key expansion
function hkdf(buffer, expandedLength, info = null) {
    return futoin_hkdf_1.default(buffer, expandedLength, { salt: Buffer.alloc(32), info: info, hash: 'SHA-256' });
}
exports.hkdf = hkdf;
// generate a buffer with random bytes of the specified length
function randomBytes(length) {
    return Crypto.randomBytes(length);
}
exports.randomBytes = randomBytes;
/** unix timestamp of a date in seconds */
const unixTimestampSeconds = (date = new Date()) => Math.floor(date.getTime() / 1000);
exports.unixTimestampSeconds = unixTimestampSeconds;
const debouncedTimeout = (intervalMs = 1000, task = undefined) => {
    let timeout;
    return {
        start: (newIntervalMs, newTask) => {
            task = newTask || task;
            intervalMs = newIntervalMs || intervalMs;
            timeout && clearTimeout(timeout);
            timeout = setTimeout(task, intervalMs);
        },
        cancel: () => {
            timeout && clearTimeout(timeout);
            timeout = undefined;
        },
        setTask: (newTask) => task = newTask,
        setInterval: (newInterval) => intervalMs = newInterval
    };
};
exports.debouncedTimeout = debouncedTimeout;
const delay = (ms) => exports.delayCancellable(ms).delay;
exports.delay = delay;
const delayCancellable = (ms) => {
    const stack = new Error().stack;
    let timeout;
    let reject;
    const delay = new Promise((resolve, _reject) => {
        timeout = setTimeout(resolve, ms);
        reject = _reject;
    });
    const cancel = () => {
        clearTimeout(timeout);
        reject(Constants_1.CancelledError(stack));
    };
    return { delay, cancel };
};
exports.delayCancellable = delayCancellable;
async function promiseTimeout(ms, promise) {
    if (!ms)
        return new Promise(promise);
    const stack = new Error().stack;
    // Create a promise that rejects in <ms> milliseconds
    let { delay, cancel } = exports.delayCancellable(ms);
    const p = new Promise((resolve, reject) => {
        delay
            .then(() => reject(Constants_1.TimedOutError(stack)))
            .catch(err => reject(err));
        promise(resolve, reject);
    })
        .finally(cancel);
    return p;
}
exports.promiseTimeout = promiseTimeout;
// whatsapp requires a message tag for every message, we just use the timestamp as one
function generateMessageTag(epoch) {
    let tag = exports.unixTimestampSeconds().toString();
    if (epoch)
        tag += '.--' + epoch; // attach epoch if provided
    return tag;
}
exports.generateMessageTag = generateMessageTag;
// generate a random 16 byte client ID
function generateClientID() {
    return randomBytes(16).toString('base64');
}
exports.generateClientID = generateClientID;
// generate a random 16 byte ID to attach to a message
function generateMessageID() {
    return '3EB0' + randomBytes(4).toString('hex').toUpperCase();
}
exports.generateMessageID = generateMessageID;
function decryptWA(message, macKey, encKey, decoder, fromMe = false) {
    let commaIndex = message.indexOf(','); // all whatsapp messages have a tag and a comma, followed by the actual message
    if (commaIndex < 0)
        throw new Constants_1.BaileysError('invalid message', { message }); // if there was no comma, then this message must be not be valid
    if (message[commaIndex + 1] === ',')
        commaIndex += 1;
    let data = message.slice(commaIndex + 1, message.length);
    // get the message tag.
    // If a query was done, the server will respond with the same message tag we sent the query with
    const messageTag = message.slice(0, commaIndex).toString();
    let json;
    let tags;
    if (data.length > 0) {
        if (typeof data === 'string') {
            json = JSON.parse(data); // parse the JSON
        }
        else {
            if (!macKey || !encKey) {
                throw new Constants_1.BaileysError('recieved encrypted buffer when auth creds unavailable', { message });
            }
            /*
                If the data recieved was not a JSON, then it must be an encrypted message.
                Such a message can only be decrypted if we're connected successfully to the servers & have encryption keys
            */
            if (fromMe) {
                tags = [data[0], data[1]];
                data = data.slice(2, data.length);
            }
            const checksum = data.slice(0, 32); // the first 32 bytes of the buffer are the HMAC sign of the message
            data = data.slice(32, data.length); // the actual message
            const computedChecksum = hmacSign(data, macKey); // compute the sign of the message we recieved using our macKey
            if (checksum.equals(computedChecksum)) {
                // the checksum the server sent, must match the one we computed for the message to be valid
                const decrypted = aesDecrypt(data, encKey); // decrypt using AES
                json = decoder.read(decrypted); // decode the binary message into a JSON array
            }
            else {
                throw new Constants_1.BaileysError('checksum failed', {
                    received: checksum.toString('hex'),
                    computed: computedChecksum.toString('hex'),
                    data: data.slice(0, 80).toString(),
                    tag: messageTag,
                    message: message.slice(0, 80).toString()
                });
            }
        }
    }
    return [messageTag, json, tags];
}
exports.decryptWA = decryptWA;
/** generates all the keys required to encrypt/decrypt & sign a media message */
function getMediaKeys(buffer, mediaType) {
    if (typeof buffer === 'string') {
        buffer = Buffer.from(buffer.replace('data:;base64,', ''), 'base64');
    }
    // expand using HKDF to 112 bytes, also pass in the relevant app info
    const expandedMediaKey = hkdf(buffer, 112, Constants_1.HKDFInfoKeys[mediaType]);
    return {
        iv: expandedMediaKey.slice(0, 16),
        cipherKey: expandedMediaKey.slice(16, 48),
        macKey: expandedMediaKey.slice(48, 80),
    };
}
exports.getMediaKeys = getMediaKeys;
/** Extracts video thumb using FFMPEG */
const extractVideoThumb = async (path, destPath, time, size) => new Promise((resolve, reject) => {
    const cmd = `ffmpeg -ss ${time} -i ${path} -y -s ${size.width}x${size.height} -vframes 1 -f image2 ${destPath}`;
    child_process_1.exec(cmd, (err) => {
        if (err)
            reject(err);
        else
            resolve();
    });
});
const compressImage = async (bufferOrFilePath) => {
    const jimp = await jimp_1.default.read(bufferOrFilePath);
    const result = await jimp.resize(48, 48).getBufferAsync(jimp_1.default.MIME_JPEG);
    return result;
};
exports.compressImage = compressImage;
const generateProfilePicture = async (buffer) => {
    const jimp = await jimp_1.default.read(buffer);
    const min = Math.min(jimp.getWidth(), jimp.getHeight());
    const cropped = jimp.crop(0, 0, min, min);
    return {
        img: await cropped.resize(640, 640).getBufferAsync(jimp_1.default.MIME_JPEG),
        preview: await cropped.resize(96, 96).getBufferAsync(jimp_1.default.MIME_JPEG)
    };
};
exports.generateProfilePicture = generateProfilePicture;
const ProxyAgent = (host) => https_proxy_agent_1.default(host);
exports.ProxyAgent = ProxyAgent;
/** gets the SHA256 of the given media message */
const mediaMessageSHA256B64 = (message) => {
    const media = Object.values(message)[0];
    return (media === null || media === void 0 ? void 0 : media.fileSha256) && Buffer.from(media.fileSha256).toString('base64');
};
exports.mediaMessageSHA256B64 = mediaMessageSHA256B64;
async function getAudioDuration(buffer) {
    const musicMetadata = await Promise.resolve().then(() => __importStar(require('music-metadata')));
    let metadata;
    if (Buffer.isBuffer(buffer)) {
        metadata = await musicMetadata.parseBuffer(buffer, null, { duration: true });
    }
    else {
        const rStream = fs_1.createReadStream(buffer);
        metadata = await musicMetadata.parseStream(rStream, null, { duration: true });
        rStream.close();
    }
    return metadata.format.duration;
}
exports.getAudioDuration = getAudioDuration;
const toReadable = (buffer) => {
    const readable = new stream_1.Readable({ read: () => { } });
    readable.push(buffer);
    readable.push(null);
    return readable;
};
exports.toReadable = toReadable;
const getStream = async (item) => {
    if (Buffer.isBuffer(item))
        return { stream: exports.toReadable(item), type: 'buffer' };
    if (item.url.toString().startsWith('http://') || item.url.toString().startsWith('https://')) {
        return { stream: await exports.getGotStream(item.url), type: 'remote' };
    }
    return { stream: fs_1.createReadStream(item.url), type: 'file' };
};
exports.getStream = getStream;
/** generates a thumbnail for a given media, if required */
async function generateThumbnail(file, mediaType, info) {
    if ('thumbnail' in info) {
        // don't do anything if the thumbnail is already provided, or is null
        if (mediaType === Constants_1.MessageType.audio) {
            throw new Error('audio messages cannot have thumbnails');
        }
    }
    else if (mediaType === Constants_1.MessageType.image) {
        const buff = await exports.compressImage(file);
        info.thumbnail = buff.toString('base64');
    }
    else if (mediaType === Constants_1.MessageType.video) {
        const imgFilename = path_1.join(os_1.tmpdir(), generateMessageID() + '.jpg');
        try {
            await extractVideoThumb(file, imgFilename, '00:00:00', { width: 48, height: 48 });
            const buff = await fs_1.promises.readFile(imgFilename);
            info.thumbnail = buff.toString('base64');
            await fs_1.promises.unlink(imgFilename);
        }
        catch (err) {
            console.log('could not generate video thumb: ' + err);
        }
    }
}
exports.generateThumbnail = generateThumbnail;
const getGotStream = async (url, options = {}) => {
    const fetched = got_1.default.stream(url, { ...options, isStream: true });
    await new Promise((resolve, reject) => {
        fetched.once('error', reject);
        fetched.once('response', ({ statusCode: status }) => {
            if (status >= 400) {
                reject(new Constants_1.BaileysError('Invalid code (' + status + ') returned', { status }));
            }
            else {
                resolve(undefined);
            }
        });
    });
    return fetched;
};
exports.getGotStream = getGotStream;
const encryptedStream = async (media, mediaType, saveOriginalFileIfRequired = true) => {
    const { stream, type } = await exports.getStream(media);
    const mediaKey = randomBytes(32);
    const { cipherKey, iv, macKey } = getMediaKeys(mediaKey, mediaType);
    // random name
    const encBodyPath = path_1.join(os_1.tmpdir(), mediaType + generateMessageID() + '.enc');
    const encWriteStream = fs_1.createWriteStream(encBodyPath);
    let bodyPath;
    let writeStream;
    if (type === 'file') {
        bodyPath = media.url;
    }
    else if (saveOriginalFileIfRequired) {
        bodyPath = path_1.join(os_1.tmpdir(), mediaType + generateMessageID());
        writeStream = fs_1.createWriteStream(bodyPath);
    }
    let fileLength = 0;
    const aes = Crypto.createCipheriv('aes-256-cbc', cipherKey, iv);
    let hmac = Crypto.createHmac('sha256', macKey).update(iv);
    let sha256Plain = Crypto.createHash('sha256');
    let sha256Enc = Crypto.createHash('sha256');
    const onChunk = (buff) => {
        sha256Enc = sha256Enc.update(buff);
        hmac = hmac.update(buff);
        encWriteStream.write(buff);
    };
    for await (const data of stream) {
        fileLength += data.length;
        sha256Plain = sha256Plain.update(data);
        if (writeStream && !writeStream.write(data))
            await events_1.once(writeStream, 'drain');
        onChunk(aes.update(data));
    }
    onChunk(aes.final());
    const mac = hmac.digest().slice(0, 10);
    sha256Enc = sha256Enc.update(mac);
    const fileSha256 = sha256Plain.digest();
    const fileEncSha256 = sha256Enc.digest();
    encWriteStream.write(mac);
    encWriteStream.end();
    writeStream && writeStream.end();
    return {
        mediaKey,
        encBodyPath,
        bodyPath,
        mac,
        fileEncSha256,
        fileSha256,
        fileLength,
        didSaveToTmpPath: type !== 'file'
    };
};
exports.encryptedStream = encryptedStream;
/**
 * Decode a media message (video, image, document, audio) & return decrypted buffer
 * @param message the media message you want to decode
 */
async function decryptMediaMessageBuffer(message) {
    var _a;
    /*
        One can infer media type from the key in the message
        it is usually written as [mediaType]Message. Eg. imageMessage, audioMessage etc.
    */
    const type = Object.keys(message)[0];
    if (!type) {
        throw new Constants_1.BaileysError('unknown message type', message);
    }
    if (type === Constants_1.MessageType.text || type === Constants_1.MessageType.extendedText) {
        throw new Constants_1.BaileysError('cannot decode text message', message);
    }
    if (type === Constants_1.MessageType.location || type === Constants_1.MessageType.liveLocation) {
        const buffer = Buffer.from(message[type].jpegThumbnail);
        const readable = new stream_1.Readable({ read: () => { } });
        readable.push(buffer);
        readable.push(null);
        return readable;
    }
    let messageContent;
    if (message.productMessage) {
        const product = (_a = message.productMessage.product) === null || _a === void 0 ? void 0 : _a.productImage;
        if (!product)
            throw new Constants_1.BaileysError('product has no image', message);
        messageContent = product;
    }
    else {
        messageContent = message[type];
    }
    // download the message
    const fetched = await exports.getGotStream(messageContent.url, {
        headers: { Origin: Constants_1.DEFAULT_ORIGIN }
    });
    let remainingBytes = Buffer.from([]);
    const { cipherKey, iv } = getMediaKeys(messageContent.mediaKey, type);
    const aes = Crypto.createDecipheriv("aes-256-cbc", cipherKey, iv);
    const output = new stream_1.Transform({
        transform(chunk, _, callback) {
            let data = Buffer.concat([remainingBytes, chunk]);
            const decryptLength = Math.floor(data.length / 16) * 16;
            remainingBytes = data.slice(decryptLength);
            data = data.slice(0, decryptLength);
            try {
                this.push(aes.update(data));
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
        final(callback) {
            try {
                this.push(aes.final());
                callback();
            }
            catch (error) {
                callback(error);
            }
        },
    });
    return fetched.pipe(output, { end: true });
}
exports.decryptMediaMessageBuffer = decryptMediaMessageBuffer;
function extensionForMediaMessage(message) {
    const getExtension = (mimetype) => mimetype.split(';')[0].split('/')[1];
    const type = Object.keys(message)[0];
    let extension;
    if (type === Constants_1.MessageType.location || type === Constants_1.MessageType.liveLocation || type === Constants_1.MessageType.product) {
        extension = '.jpeg';
    }
    else {
        const messageContent = message[type];
        extension = getExtension(messageContent.mimetype);
    }
    return extension;
}
exports.extensionForMediaMessage = extensionForMediaMessage;
