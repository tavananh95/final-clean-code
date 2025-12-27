import { Request, Response } from 'express';
import {GetCardsByTagService} from "../../../../application/services/get-cards-by-tag-service";
import {handleHttpError} from "../../errors/http-error-handler";
import {GeneralRequestValidationError} from "../../errors/general-request-validation-error";

export class GetCardsByTagHandler {
    constructor(private readonly getCardsByTag: GetCardsByTagService) {}

    handle = async (req: Request, res: Response) => {
        try {
            const tagsQuery = req.query.tags;

            let tags: string[] | undefined;

            if (typeof tagsQuery === 'string') {
                tags = [tagsQuery];
            } else if (Array.isArray(tagsQuery)) {
                tags = tagsQuery.filter(t => typeof t === 'string');
            }

            const cards = await this.getCardsByTag.execute(tags);
            
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
