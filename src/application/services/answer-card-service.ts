import { CardRepository } from "../ports/card.repository";
import { CardNotFoundError } from "../../domain/errors/card-not-found-error";

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

        await this.cardRepository.updateCard(card);
    }

    async executeWithComparison(cardId: string, userAnswer: string, force: boolean = false) {
        const card = await this.cardRepository.getCardById(cardId);
        if (!card) throw new CardNotFoundError();

        const isValid = force || card.state.answer.trim().toLowerCase() === userAnswer.trim().toLowerCase();
        card.answerQuestion(isValid);

        await this.cardRepository.updateCard(card);

        return card;
    }
}