import {Request, Response} from 'express';
import {CreateCardService} from "../../../application/services/create-card-service";
import {AnswerCardService} from "../../../application/services/answer-card-service";
import {createCardValidation} from "../validators/create-card-validator";
import {generateValidationErrorMessage} from "../validators/generate-validation-message";

export class CardHandler {
    constructor(
        private readonly createCard: CreateCardService,
        private readonly answerCard: AnswerCardService
    ) {
    }

    create = async (req: Request, res: Response) => {
        if (Array.isArray(req.body)) {
            res.status(400).json({message: 'Body must be an object'});
            return
        }
        const validationReqBody = createCardValidation.validate(req.body)

        if (validationReqBody.error) {
            res.status(400).send(generateValidationErrorMessage(validationReqBody.error.details))
            return
        }
        const card = await this.createCard.execute(validationReqBody.value);
        return res.status(201).json(card.state);

    };

    answer = async (req: Request, res: Response) => {
        const {cardId} = req.params;
        const {isValid} = req.body;

        if (typeof isValid !== 'boolean') {
            return res.status(400).json({message: 'isValid must be boolean'});
        }

        await this.answerCard.execute(cardId, isValid);
        return res.status(204).send();
    };
}
