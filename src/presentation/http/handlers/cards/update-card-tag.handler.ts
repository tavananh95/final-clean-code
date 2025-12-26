import {Request, Response} from "express";
import {UpdateCardTagService} from "../../../../application/services/update-card-tag-service";
import {updateCardTagValidation} from "../../validators/update-card-tag-validator";
import {generateValidationErrorMessage} from "../../validators/generate-validation-message";
import {handleHttpError} from "../../errors/http-error-handler";

export class UpdateCardTagHandler {
    constructor(private readonly updateCardTag: UpdateCardTagService) {
    }

    handle = async (req: Request, res: Response) => {
        try {
            if (Array.isArray(req.body)) {
                return res.status(400).json({message: 'Body must be an object'});
            }

            const {cardId} = req.params;

            if (cardId.trim().length === 0) {
                return res.status(400).json({message: 'cardId is required'});
            }
            const {error, value} = updateCardTagValidation.validate(req.body);
            if (error) {
                res.status(400)
                    .json(generateValidationErrorMessage(error.details));
                return
            }
            const command = {
                cardId,
                tag: typeof value.tag === 'string' ? value.tag.trim() : undefined,
            };

            await this.updateCardTag.execute(command);

            return res.status(204).send();
        } catch (error) {
            return handleHttpError(res, error)
        }
    }
}
