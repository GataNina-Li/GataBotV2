/// <reference types="node" />
import { EventEmitter } from 'events';
import { RCONOptions } from '../model/Options';
interface RCONEvents {
    on(event: 'output', listener: (output: string) => void): void;
    on(event: 'warning', listener: (message: string) => void): void;
}
/**
 * A utility class for executing commands remotely on a Minecraft server.
 * @class
 * @extends {EventEmitter}
 * @implements {RCONEvents}
 */
declare class RCON extends EventEmitter implements RCONEvents {
    private host;
    private isLoggedIn;
    private options;
    private socket;
    private requestID;
    private decoder;
    /**
     * Creates a new RCON class with the host and options
     * @param {string} host The host of the server
     * @param {RCONOptions} [options] The options for the RCON client
     * @constructor
     */
    constructor(host: string, options?: RCONOptions);
    /**
     * Connects to the server using TCP and sends the correct login packets.
     * @returns {Promise<void>} A Promise that resolves when it has successfully logged in
     * @async
     */
    connect(): Promise<void>;
    /**
     * Waits for the next incoming packet from the stream and parses it.
     * @returns {Promise<void>}
     * @async
     * @private
     */
    _readPacket(): Promise<void>;
    /**
     * Executes commands on the server after it has successfully logged in
     * @param {string} command The command to execute
     * @returns {Promise<void>} The Promise that resolves whenever the command has executed
     * @async
     */
    run(command: string): Promise<void>;
    /**
     * Executes commands on the server after it has successfully logged in and waits for the result of command execution
     * @param command The command to execute
     * @param timeout Maximum waiting time. Default: 5000
     * @returns
     */
    exec(command: string, timeout?: number): Promise<string>;
    /**
     * Closes the connection to the server
     * @returns {Promise<void>} A Promise that resolves when the connection has closed
     * @async
     */
    close(): Promise<void>;
}
export default RCON;
