import {GetQuizzCardsService} from "../../../../application/services/get-quizz-cards-service";
import {Request, Response} from 'express';

export class GetQuizzCardsHandler {
    constructor(private readonly service: GetQuizzCardsService) {
    }

    handle = async (req: Request, res: Response) => {
        const dateParam = req.query.date as string;
        const quizzDate = dateParam ? new Date(dateParam) : new Date();

        if (isNaN(quizzDate.getTime())) {
            return res.status(400).json({message: 'Invalid date format'});
        }

        const cards = await this.service.execute(quizzDate);

        const response = cards.map(card => ({
            id: card.id,
            category: card.category,
            question: card.state.question,
            answer: card.state.answer,
            tag: card.state.tag
        }));

        return res.status(200).json(response);
    };
}