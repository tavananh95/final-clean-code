import {Request, Response} from 'express';
import {AnswerCardService} from "../../../../application/services/answer-card-service";
import {CardNotFoundError} from "../../../../domain/errors/card-not-found-error";
import {isUUID} from "class-validator";
import {handleHttpError} from "../../errors/http-error-handler";
import {GeneralRequestValidationError} from "../../errors/general-request-validation-error";

export class AnswerCardHandler {
    constructor(private readonly answerCard: AnswerCardService) {}

    handle = async (req: Request, res: Response) => {
        const {cardId} = req.params;
        try {
            const {userAnswer} = req.body;

            if (!userAnswer || typeof userAnswer !== 'string') {
                throw new GeneralRequestValidationError("userAnswer must be a non-empty string");
            }

            if (!isUUID(cardId)) {
                throw new GeneralRequestValidationError('Invalid cardId format');
            }

            const card = await this.answerCard.executeWithComparison(cardId, userAnswer);

            if (card.state.answer !== userAnswer) {
                return res.status(200).json({
                    message: 'Incorrect answer',
                    correctAnswer: card.state.answer
                });
            }

            return res.status(204).send();
        } catch (error) {
            return handleHttpError(res, error);
        }
    };
}
