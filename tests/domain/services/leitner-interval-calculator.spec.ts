import {calculateLeitnerInterval} from '../../../src/domain/services/leitner-interval-calculator';
import {Category} from '../../../src/domain/models/category';

describe('Leitner Interval Calculator', () => {
    it('should return 1 day for FIRST category', () => {
        expect(calculateLeitnerInterval(Category.FIRST)).toBe(1);
    });

    it('should return 2 days for SECOND category', () => {
        expect(calculateLeitnerInterval(Category.SECOND)).toBe(2);
    });

    it('should return 4 days for THIRD category', () => {
        expect(calculateLeitnerInterval(Category.THIRD)).toBe(4);
    });

    it('should return 8 days for FOURTH category', () => {
        expect(calculateLeitnerInterval(Category.FOURTH)).toBe(8);
    });

    it('should return 16 days for FIFTH category', () => {
        expect(calculateLeitnerInterval(Category.FIFTH)).toBe(16);
    });

    it('should return 32 days for SIXTH category', () => {
        expect(calculateLeitnerInterval(Category.SIXTH)).toBe(32);
    });

    it('should return 64 days for SEVENTH category', () => {
        expect(calculateLeitnerInterval(Category.SEVENTH)).toBe(64);
    });

    it('should return 0 days for DONE category', () => {
        expect(calculateLeitnerInterval(Category.DONE)).toBe(0);
    });
});