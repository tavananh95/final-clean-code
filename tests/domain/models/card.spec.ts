import {Card} from "../../../src/domain/models/card";
import {Category} from "../../../src/domain/models/category";

describe('Card Domain Entity', () => {
    const fixedDate = new Date('2024-01-01T10:00:00.000Z');
    describe('Card creation', () => {
        it('creates a card in FIRST category', () => {
            const card = Card.createNew({
                id: 'id',
                question: 'q',
                answer: 'a'
            });

            expect(card.category).toBe(Category.FIRST);
            expect(card.nextReviewDate).toBeUndefined();
        });
    });
    describe('Answering Questions (Leitner Logic)', () => {

        it('should reset to FIRST category and schedule for next day (1 day delay) when answer is INVALID', () => {
            // ARRANGE
            const card = new Card({
                id: 'uuid-1',
                question: 'Q',
                answer: 'A',
                category: Category.THIRD,
                nextReviewDate: new Date('2023-12-31')
            });

            // ACT
            card.answerQuestion(false, fixedDate);

            // ASSERT
            expect(card.category).toBe(Category.FIRST);

            // FIRST = 1 jour d'intervalle. 1er Janvier + 1 jour = 2 Janvier
            const expectedDate = new Date('2024-01-02T10:00:00.000Z');
            expect(card.nextReviewDate).toEqual(expectedDate);
        });

        it('should promote to SECOND category and schedule for 2 days later when answer is VALID', () => {
            // ARRANGE
            const card = new Card({
                id: 'uuid-2',
                question: 'Q',
                answer: 'A',
                category: Category.FIRST
            });

            // ACT
            card.answerQuestion(true, fixedDate);

            // ASSERT
            expect(card.category).toBe(Category.SECOND);

            // SECOND = 2 jours d'intervalle. 1er Jan + 2 jours = 3 Jan.
            const expectedDate = new Date('2024-01-03T10:00:00.000Z');
            expect(card.nextReviewDate).toEqual(expectedDate);
        });

        it('should promote from SECOND to THIRD (4 days delay)', () => {
            // ARRANGE
            const card = new Card({id: 'u', question: 'q', answer: 'a', category: Category.SECOND});
            // ACT
            card.answerQuestion(true, fixedDate);
            // ASSERT
            expect(card.category).toBe(Category.THIRD);
            // THIRD = 4 jours. 1er Jan + 4 = 5 Jan.
            expect(card.nextReviewDate).toEqual(new Date('2024-01-05T10:00:00.000Z'));
        });
        it('should promote from THIRD to FOURTH (8 days delay)', () => {
            const card = new Card({id: 'u', question: 'q', answer: 'a', category: Category.THIRD});

            card.answerQuestion(true, fixedDate);

            expect(card.category).toBe(Category.FOURTH);
            // FOURTH = 8 jours. 1er Jan + 8 = 9 Jan.
            expect(card.nextReviewDate).toEqual(new Date('2024-01-09T10:00:00.000Z'));
        });

        it('should promote from SEVENTH to DONE and clear the review date', () => {
            // ARRANGE
            const card = new Card({
                id: 'uuid-3',
                question: 'Q',
                answer: 'A',
                category: Category.SEVENTH,
                nextReviewDate: fixedDate
            });

            // ACT
            card.answerQuestion(true, fixedDate);

            // ASSERT
            expect(card.category).toBe(Category.DONE);
            expect(card.nextReviewDate).toBeUndefined(); // Plus jamais proposée
        });

        it('should stay in DONE state if answered correctly again', () => {
            const card = new Card({
                id: '1', question: 'Q', answer: 'A', category: Category.DONE
            });

            card.answerQuestion(true, fixedDate);

            expect(card.category).toBe(Category.DONE);
            expect(card.nextReviewDate).toBeUndefined();
        });

        it('should update the tag correctly', () => {
            const card = Card.createNew({
                id: '1',
                question: 'What is TypeScript?',
                answer: 'A superset of JavaScript',
            });

            expect(card.state.tag).toBeUndefined();

            card.updateTag('programming');

            expect(card.state.tag).toBe('programming');

            card.updateTag(undefined);
            expect(card.state.tag).toBeUndefined();
        });
    });
});