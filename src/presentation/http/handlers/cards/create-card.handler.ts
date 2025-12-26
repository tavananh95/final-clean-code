// src/presentation/http/handlers/create-card.handler.ts
import { Request, Response } from 'express';
import {CreateCardService} from "../../../../application/services/create-card-service";
import {createCardValidation} from "../../validators/create-card-validator";
import {generateValidationErrorMessage,} from "../../validators/generate-validation-message";
import {handleHttpError} from "../../errors/http-error-handler";
import {JoiRequestValidationError} from "../../errors/joi-request-validation-error";

export class CreateCardHandler {
    constructor(private readonly createCard: CreateCardService) {}

    handle = async (req: Request, res: Response) => {
        try {
            if (Array.isArray(req.body)) {
                return res.status(400).json({ message: 'Body must be an object' });
            }

            const { error, value } = createCardValidation.validate(req.body);

            if (error) {
                throw new JoiRequestValidationError(generateValidationErrorMessage(error.details))
            }
            const card = await this.createCard.execute(value);
            return res.status(201).json(card.state);
        } catch (error) {
            return handleHttpError(res, error);
        }

    };
}
