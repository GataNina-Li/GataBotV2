export default class BrainlyError extends Error {
    constructor(public name: string, message?: string) {
        super(message);
    }
}