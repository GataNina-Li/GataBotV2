class MissingAdapterError extends Error { u
    constructor() {
        super();
        this.message = 'Missing Adapter';
    }
}
module.exports = { MissingAdapterError };
