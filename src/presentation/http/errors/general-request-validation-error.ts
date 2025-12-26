
export class GeneralRequestValidationError extends Error {
    constructor(message: string) {
        super();
        this.message = message;
        this.name = 'RequestValidationError';
    }
}