import {Card} from "../../../src/domain/models/card";
import {Category} from "../../../src/domain/models/category";

describe('Card Domain Entity', () => {
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

    it('should promote the card to the next category when the answer is valid', () => {
        // ARRANGE
        const card = new Card({
            id: 'uuid-1',
            question: 'Q',
            answer: 'A',
            category: Category.FIRST
        });

        // ACT
        card.answerQuestion(true);

        // ASSERT
        expect(card.category).toBe(Category.SECOND);
    });
    it('should promote to DONE category after SEVENTH', () => {
        // ARRANGE
        const card = new Card({
            id: 'uuid-3',
            question: 'Q',
            answer: 'A',
            category: Category.SEVENTH
        });

        // ACT
        card.answerQuestion(true);

        // ASSERT
        expect(card.category).toBe(Category.DONE);
    });

    it('should not go beyond DONE category', () => {
        // ARRANGE
        const card = new Card({
            id: 'uuid-2',
            question: 'Q',
            answer: 'A',
            category: Category.DONE
        });

        // ACT
        card.answerQuestion(true);

        // ASSERT
        expect(card.category).toBe(Category.DONE);
    });
});