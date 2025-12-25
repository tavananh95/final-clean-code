import { Request, Response } from 'express';
import {AnswerCardService} from "../../application/services/answerCardService";

export class CardHandler {
    constructor(private readonly answerCard: AnswerCardService) {}

    answer = async (req: Request, res: Response) => {
        const { cardId } = req.params;
        const { isValid } = req.body;

        if (typeof isValid !== 'boolean') {
            return res.status(400).json({ message: 'isValid must be boolean' });
        }

        await this.answerCard.execute(cardId, isValid);
        return res.status(204).send();
    };
}
