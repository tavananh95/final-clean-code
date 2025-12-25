import {CardRepository} from "../ports/card.repository";

export class AnswerCardService {
    constructor(private readonly cardRepository: CardRepository) {}

    /**
     * Executes the use case of answering a card.
     * @param cardId - The ID of the card being answered.
     * @param isValid - Whether the user answered correctly.
     */
    async execute(cardId: string, isValid: boolean): Promise<void> {
        const card = await this.cardRepository.getCardById(cardId);

        if (!card) {
            throw new Error('Card not found');
        }

        // Apply domain logic
        card.answerQuestion(isValid);

        // Persist the state
        await this.cardRepository.updateCard(card);
    }
}