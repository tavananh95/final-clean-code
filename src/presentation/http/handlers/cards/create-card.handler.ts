// src/presentation/http/handlers/create-card.handler.ts
import { Request, Response } from 'express';
import {CreateCardService} from "../../../../application/services/create-card-service";
import {createCardValidation} from "../../validators/create-card-validator";
import {generateValidationErrorMessage} from "../../validators/generate-validation-message";

export class CreateCardHandler {
    constructor(private readonly createCard: CreateCardService) {}

    handle = async (req: Request, res: Response) => {
        if (Array.isArray(req.body)) {
            return res.status(400).json({ message: 'Body must be an object' });
        }

        const { error, value } = createCardValidation.validate(req.body);

        if (error) {
            return res.status(400).send(generateValidationErrorMessage(error.details));
        }

        const card = await this.createCard.execute(value);
        return res.status(201).json(card.state);
    };
}
