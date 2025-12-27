import {Request, Response} from 'express';
import {AnswerCardService} from "../../../../application/services/answer-card-service";
import {CardNotFoundError} from "../../../../domain/errors/card-not-found-error";
import {isUUID} from "class-validator";
import {handleHttpError} from "../../errors/http-error-handler";
import {GeneralRequestValidationError} from "../../errors/general-request-validation-error";


export class AnswerCardHandler {
    constructor(private readonly answerCard: AnswerCardService) {
    }

    handle = async (req: Request, res: Response) => {
        const {cardId} = req.params;
        try {
            const {isValid} = req.body;


            if (typeof isValid !== 'boolean') {
                throw new GeneralRequestValidationError("isValid must be boolean")
            }
            if (!isUUID(cardId)) {
                throw new GeneralRequestValidationError('Invalid cardId format')
            }
            await this.answerCard.execute(cardId, isValid);
            return res.status(204).send();
        } catch (error) {
            return handleHttpError(res, error);
        }
    };
}
