import {CardRepository} from "../ports/card.repository";
import {Card} from "../../domain/models/card";

export class GetQuizzCardsService {
    constructor(private readonly cardRepository: CardRepository) {
    }

    async execute(date: Date): Promise<Card[]> {
    const cards = await this.cardRepository.getCardsToReview(date);

    const today = date.toDateString();
    const cardsToReturn = cards.filter(card =>
        !card.lastQuizzDate || card.lastQuizzDate.toDateString() !== today
    );

    cardsToReturn.forEach(card => card.setLastQuizzDate(date));

    return cardsToReturn;
}
}