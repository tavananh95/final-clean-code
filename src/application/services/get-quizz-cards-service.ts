import {CardRepository} from "../ports/card.repository";
import {Card} from "../../domain/models/card";

export class GetQuizzCardsService {
    constructor(private readonly cardRepository: CardRepository) {
    }

    async execute(date: Date): Promise<Card[]> {
        return this.cardRepository.getCardsToReview(date);
    }
}