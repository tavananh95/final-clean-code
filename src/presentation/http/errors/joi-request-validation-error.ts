import {ValidationError} from "../validators/generate-validation-message";

export class JoiRequestValidationError extends Error {
    constructor(public readonly details: ValidationError) {
        super('Request validation failed');
        this.name = 'RequestValidationError';
    }
}