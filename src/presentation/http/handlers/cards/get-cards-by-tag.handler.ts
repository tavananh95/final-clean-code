// src/presentation/http/handlers/get-cards-by-tag.handler.ts
import { Request, Response } from 'express';
import {GetCardsByTagService} from "../../../../application/services/get-cards-by-tag-service";

export class GetCardsByTagHandler {
    constructor(private readonly getCardsByTag: GetCardsByTagService) {}

    handle = async (req: Request, res: Response) => {
        const { tag } = req.query;

        if (typeof tag !== 'string' || tag.trim().length === 0) {
            return res.status(400).json({ message: 'tag query parameter is required' });
        }

        const cards = await this.getCardsByTag.execute(tag.trim());

        return res.status(200).json(
            cards.map((card) => ({
                id: card.state.id,
                question: card.state.question,
                answer: card.state.answer,
                category: card.state.category,
                tag: card.state.tag,
            })),
        );
    };
}
