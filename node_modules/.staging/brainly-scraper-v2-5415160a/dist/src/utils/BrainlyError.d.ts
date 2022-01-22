export default class BrainlyError extends Error {
    name: string;
    constructor(name: string, message?: string);
}
