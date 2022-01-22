interface BaseOptions {
    port?: number;
    timeout?: number;
}
interface StatusOptions extends BaseOptions {
    enableSRV?: boolean;
    protocolVersion?: number;
}
interface BedrockStatusOptions extends BaseOptions {
    clientGUID?: number;
}
interface QueryOptions extends BaseOptions {
    enableSRV?: boolean;
    sessionID?: number;
}
interface RCONOptions extends BaseOptions {
    enableSRV?: boolean;
    password?: string;
}
interface ScanLANOptions {
    scanTime?: number;
}
export { StatusOptions, BedrockStatusOptions, QueryOptions, RCONOptions, ScanLANOptions, BaseOptions };
