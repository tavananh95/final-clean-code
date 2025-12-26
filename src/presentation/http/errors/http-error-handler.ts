// src/presentation/http/errors/http-error-handler.ts
import { Response } from 'express';
import { CardNotFoundError } from '../../../domain/errors/card-not-found-error';
import {GeneralRequestValidationError} from "./general-request-validation-error";
import {JoiRequestValidationError} from "./joi-request-validation-error";

type ErrorShape = { message: string; code?: string; details?: unknown };

export function handleHttpError(res: Response, err: unknown): Response {
    // Domain / application errors
    if (err instanceof CardNotFoundError) {
        return res.status(404).json({ message: err.message });
    }

    if (err instanceof GeneralRequestValidationError) {
        return res.status(400).json({ message: err.message });
    }

    if (err instanceof JoiRequestValidationError) {
        return res.status(400).json({ message: err.details });
    }

    if (err instanceof Error) {
        const body: ErrorShape = { message: 'internal error' };
        return res.status(500).json(body);
    }

    return res.status(500).json({ message: 'internal error' });
}
