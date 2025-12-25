import { Card } from '../models/card';

export interface CardRepository {
    /**
     * Finds a card by its unique identifier.
     * @param cardId - The ID of the card.
     * @returns The Card domain entity or undefined if not found.
     */
    getCardById(cardId: string): Promise<Card | undefined>;

    /**
     * Persists the changes made to a card.
     * @param card - The Card domain entity to update.
     */
    updateCard(card: Card): Promise<void>;
}