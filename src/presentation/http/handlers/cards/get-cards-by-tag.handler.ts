import { Request, Response } from 'express';
import {GetCardsByTagService} from "../../../../application/services/get-cards-by-tag-service";
import {handleHttpError} from "../../errors/http-error-handler";
import {GeneralRequestValidationError} from "../../errors/general-request-validation-error";

export class GetCardsByTagHandler {
    constructor(private readonly getCardsByTag: GetCardsByTagService) {}

    handle = async (req: Request, res: Response) => {
        try {
            const tags = req.query.tags;

            let tagArray: string[] | undefined;

            if (typeof tags === 'string' && tags.trim().length > 0) {
            tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
        } else if (Array.isArray(tags)) {
            tagArray = tags.map(t => String(t).trim()).filter(Boolean);
            if (tagArray.length === 0) tagArray = undefined;
        }

            const cards = await this.getCardsByTag.execute(tagArray);
            
            return res.status(200).json(
                cards.map((card) => ({
                    id: card.state.id,
                    question: card.state.question,
                    answer: card.state.answer,
                    category: card.state.category,
                    tag: card.state.tag,
                })),
            );
        } catch (error) {
            return handleHttpError(res, error)
        }

    };
}
