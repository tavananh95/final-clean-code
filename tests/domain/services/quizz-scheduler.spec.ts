import {QuizzScheduler} from "../../../src/domain/services/quizz-scheduler";
import {Category} from "../../../src/domain/models/category";

describe('QuizzScheduler Domain Service', () => {
    const fixedDate = new Date('2024-01-30T12:00:00.000Z');

    describe('Interval calculations and Date shifting', () => {
        it('should schedule next review in 1 day for FIRST category (Month boundary check)', () => {
            // ACT
            const quizz = QuizzScheduler.scheduleNextReview('card-1', Category.FIRST, fixedDate);

            // ASSERT
            // 30 Jan + 1 jour = 31 Janvier
            const expectedDate = new Date('2024-01-31T12:00:00.000Z');
            expect(quizz.cardId).toBe('card-1');
            expect(quizz.nextReviewDate).toEqual(expectedDate);
        });

        it('should schedule next review in 2 days for SECOND category (Crossing month boundary)', () => {
            const quizz = QuizzScheduler.scheduleNextReview('card-1', Category.SECOND, fixedDate);

            // 30 Jan + 2 jours = 1er Février
            const expectedDate = new Date('2024-02-01T12:00:00.000Z');
            expect(quizz.nextReviewDate).toEqual(expectedDate);
        });

        it('should schedule next review in 4 days for THIRD category', () => {
            const quizz = QuizzScheduler.scheduleNextReview('card-1', Category.THIRD, fixedDate);

            // 30 Jan + 4 jours = 3 Février
            const expectedDate = new Date('2024-02-03T12:00:00.000Z');
            expect(quizz.nextReviewDate).toEqual(expectedDate);
        });

        it('should schedule next review in 8 days for FOURTH category', () => {
            const quizz = QuizzScheduler.scheduleNextReview('card-1', Category.FOURTH, fixedDate);

            // 30 Jan + 8 jours = 7 Février
            const expectedDate = new Date('2024-02-07T12:00:00.000Z');
            expect(quizz.nextReviewDate).toEqual(expectedDate);
        });

        it('should schedule next review in 16 days for FIFTH category', () => {
            const quizz = QuizzScheduler.scheduleNextReview('card-1', Category.FIFTH, fixedDate);

            // 30 Jan + 16 jours = 15 Février
            const expectedDate = new Date('2024-02-15T12:00:00.000Z');
            expect(quizz.nextReviewDate).toEqual(expectedDate);
        });

        it('should schedule next review in 32 days for SIXTH category (Leap year check)', () => {

            const quizz = QuizzScheduler.scheduleNextReview('card-1', Category.SIXTH, fixedDate);
            const expectedDate = new Date('2024-03-02T12:00:00.000Z');
            expect(quizz.nextReviewDate).toEqual(expectedDate);
        });

        it('should schedule next review in 0 days for Done category', () => {
            const quizz = QuizzScheduler.scheduleNextReview('card-1', Category.SEVENTH, fixedDate);
            const expectedDate = new Date('2024-04-03T12:00:00.000Z');
            expect(quizz.nextReviewDate).toEqual(expectedDate);
        });
    });

    describe('Edge Cases & Errors', () => {
        it('should throw an error if trying to schedule a DONE card', () => {
            expect(() => {
                QuizzScheduler.scheduleNextReview('card-1', Category.DONE, fixedDate);
            }).toThrow("Cannot schedule a DONE card.");
        });

        it('should use current date if no date provided (Default parameter)', () => {
            const now = new Date();
            const quizz = QuizzScheduler.scheduleNextReview('card-1', Category.FIRST);

            const expectedApprox = new Date(now);
            expectedApprox.setDate(expectedApprox.getDate() + 1);
            const diff = Math.abs(quizz.nextReviewDate.getTime() - expectedApprox.getTime());
            expect(diff).toBeLessThan(1000);
        });
    });
});