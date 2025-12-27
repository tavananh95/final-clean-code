import {CardRepository} from "../ports/card.repository";
import {CardNotFoundError} from "../../domain/errors/card-not-found-error";
import { calculateLeitnerInterval } from "../../domain/services/leitner-interval-calculator";

export class AnswerCardService {
    constructor(private readonly cardRepository: CardRepository) {
    }

    /**
     * Executes the use case of answering a card.
     * @param cardId - The ID of the card being answered.
     * @param isValid - Whether the user answered correctly.
     */
    async execute(cardId: string, isValid: boolean): Promise<void> {
        const card = await this.cardRepository.getCardById(cardId);

        if (!card) {
            throw new CardNotFoundError();
        }

        card.answerQuestion(isValid);

        console.log("category after answer:", card.state.category);
        console.log("interval:", calculateLeitnerInterval(card.state.category));
        console.log("nextReviewDate:", card.state.nextReviewDate);
        await this.cardRepository.updateCard(card);
    }
}