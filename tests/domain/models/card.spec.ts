import {Card} from "../../../src/domain/models/card";
import {Category} from "../../../src/domain/models/category";

describe('Card Domain Entity', () => {
    it('should reset the category to FIRST when the answer is invalid', () => {
        // ARRANGE
        const card = new Card({
            id: 'uuid-123',
            question: 'What is Clean Code?',
            answer: 'A book',
            category: Category.THIRD
        });

        const isAnswerValid = false;

        // ACT
        card.answerQuestion(isAnswerValid);

        // ASSERT
        expect(card.category).toBe(Category.FIRST);
    });
});

describe('Card creation', () => {
    it('creates a card in FIRST category', () => {
        const card = Card.createNew({
            id: 'id',
            question: 'q',
            answer: 'a'
        });

        expect(card.category).toBe(Category.FIRST);
    });
});