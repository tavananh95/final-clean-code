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
    describe('Answering Questions', () => {
        it('should reset to FIRST category when answer is INVALID', () => {
            const card = new Card({
                id: '1', question: 'Q', answer: 'A', category: Category.THIRD
            });

            card.answerQuestion(false);

            expect(card.category).toBe(Category.FIRST);
        });

        it('should promote to SECOND category when answer is VALID', () => {
            const card = new Card({
                id: '1', question: 'Q', answer: 'A', category: Category.FIRST
            });

            card.answerQuestion(true);

            expect(card.category).toBe(Category.SECOND);
        });

        it('should promote to SECOND category when answer is VALID', () => {
            const card = new Card({
                id: '1', question: 'Q', answer: 'A', category: Category.FIRST
            });

            card.answerQuestion(true);

            expect(card.category).toBe(Category.SECOND);
        });

        it('should promote to THIRD category when answer is VALID', () => {
            const card = new Card({
                id: '1', question: 'Q', answer: 'A', category: Category.SECOND
            });
            card.answerQuestion(true);

            expect(card.category).toBe(Category.THIRD);
        });

        it('should promote to FOURTH category when answer is VALID', () => {
            const card = new Card({
                id: '1', question: 'Q', answer: 'A', category: Category.THIRD
            });
            card.answerQuestion(true);

            expect(card.category).toBe(Category.FOURTH);
        });

        it('should promote to FIFTH category when answer is VALID', () => {
            const card = new Card({
                id: '1', question: 'Q', answer: 'A', category: Category.FOURTH
            });
            card.answerQuestion(true);

            expect(card.category).toBe(Category.FIFTH);
        });

        it('should promote to SIXTH category when answer is VALID', () => {
            const card = new Card({
                id: '1', question: 'Q', answer: 'A', category: Category.FIFTH
            });
            card.answerQuestion(true);

            expect(card.category).toBe(Category.SIXTH);
        });

        it('should promote to SEVENTH category when answer is VALID', () => {
            const card = new Card({
                id: '1', question: 'Q', answer: 'A', category: Category.SIXTH
            });
            card.answerQuestion(true);

            expect(card.category).toBe(Category.SEVENTH);
        });

        it('should promote to DONE category when answer is VALID', () => {
            const card = new Card({
                id: '1', question: 'Q', answer: 'A', category: Category.SEVENTH
            });
            card.answerQuestion(true);

            expect(card.category).toBe(Category.DONE);
        });
    });
});