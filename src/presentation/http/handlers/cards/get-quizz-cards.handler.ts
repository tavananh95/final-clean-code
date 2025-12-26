import {GetQuizzCardsService} from "../../../../application/services/get-quizz-cards-service";
import {Request, Response} from 'express';
import {GeneralRequestValidationError} from "../../errors/general-request-validation-error";
import {handleHttpError} from "../../errors/http-error-handler";

export class GetQuizzCardsHandler {
    constructor(private readonly service: GetQuizzCardsService) {
    }

    handle = async (req: Request, res: Response) => {
        try {
            const dateParam = req.query.date as string;
            const quizzDate = dateParam ? new Date(dateParam) : new Date();

            if (isNaN(quizzDate.getTime())) {
                throw new GeneralRequestValidationError("Invalid date format")
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
        } catch (error) {
            return handleHttpError(res, error)
        }

    };
}