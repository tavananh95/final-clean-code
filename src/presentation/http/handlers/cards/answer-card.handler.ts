// src/presentation/http/handlers/answer-card.handler.ts
import {Request, Response} from 'express';
import {AnswerCardService} from "../../../../application/services/answer-card-service";
import {CardNotFoundError} from "../../../../domain/errors/card-not-found-error";
import {isUUID} from "class-validator";


export class AnswerCardHandler {
    constructor(private readonly answerCard: AnswerCardService) {
    }

    handle = async (req: Request, res: Response) => {
        const {cardId} = req.params;
        const {isValid} = req.body;


        if (typeof isValid !== 'boolean') {
            return res.status(400).json({message: 'isValid must be boolean'});
        }
        if (!isUUID(cardId)) {
            return res.status(400).json({message: 'Invalid cardId format'});
        }
        try {
            await this.answerCard.execute(cardId, isValid);
            return res.status(204).send();
        } catch (error: any) {
            if (error instanceof CardNotFoundError) {
                return res.status(404).json({message: 'Card not found'});
            }
            return res.status(500).json({message: 'Internal server error'});
        }
    };
}
