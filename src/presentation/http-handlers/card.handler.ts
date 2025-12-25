import { Request, Response } from 'express';
import { CreateCardService } from "../../application/services/createCardService";
import {AnswerCardService} from "../../application/services/answerCardService";

export class CardHandler {
    constructor(
        private readonly createCard: CreateCardService,
        private readonly answerCard: AnswerCardService
    ) {}

    create = async (req: Request, res: Response) => {
        const { question, answer, tag } = req.body;

        if (!question || !answer) {
            return res.status(400).json({ message: "Invalid body" });
        }

        const card = await this.createCard.execute({ question, answer, tag });
        return res.status(201).json(card.state);
    };

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
