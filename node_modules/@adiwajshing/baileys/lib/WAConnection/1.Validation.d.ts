import { WAConnection as Base } from './0.Base';
import { WAInitResponse, WAOpenResult } from './Constants';
export declare class WAConnection extends Base {
    /** Authenticate the connection */
    protected authenticate(reconnect?: string): Promise<WAOpenResult>;
    /**
     * Refresh QR Code
     * @returns the new ref
     */
    requestNewQRCodeRef(): Promise<WAInitResponse>;
    /**
     * Once the QR code is scanned and we can validate our connection, or we resolved the challenge when logging back in
     * @private
     * @param {object} json
     */
    private validateNewConnection;
    /**
     * When logging back in (restoring a previously closed session), WhatsApp may challenge one to check if one still has the encryption keys
     * WhatsApp does that by asking for us to sign a string it sends with our macKey
     */
    protected respondToChallenge(challenge: string): Promise<any>;
    /** When starting a new session, generate a QR code by generating a private/public key pair & the keys the server sends */
    protected generateKeysForAuth(ref: string, ttl?: number): void;
}
