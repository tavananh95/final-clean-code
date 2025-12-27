import {CardRepository} from '../../src/application/ports/card.repository';
import {Card} from '../../src/domain/models/card';
import {Category} from "../../src/domain/models/category";
import {AnswerCardService} from "../../src/application/services/answer-card-service";
import { CardNotFoundError } from '../../src/domain/errors/card-not-found-error';

const mockCardRepo = {
    getCardById: jest.fn(),
    updateCard: jest.fn(),
} as unknown as CardRepository;

describe('AnswerCardService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
    it('should return original answer when user answer is wrong', async () => {
        const service = new AnswerCardService(mockCardRepo);
        const existingCard = new Card({
            id: '123',
            question: 'Q',
            answer: 'CorrectAnswer',
            category: Category.SECOND
        });

        (mockCardRepo.getCardById as jest.Mock).mockResolvedValue(existingCard);

        const result = await service.executeWithComparison('123', 'WrongAnswer');

        expect(result.state.answer).toBe('CorrectAnswer'); // réponse originale
        expect(existingCard.category).toBe(Category.FIRST); // catégorie reset
        expect(mockCardRepo.updateCard).toHaveBeenCalledWith(existingCard);
    });
    
    it('should calculate next review date and save the card when answer is valid', async () => {
        // ARRANGE
        const service = new AnswerCardService(mockCardRepo);
        const existingCard = new Card({
            id: '123',
            question: 'Q',
            answer: 'A',
            category: Category.FIRST
        });

        (mockCardRepo.getCardById as jest.Mock).mockResolvedValue(existingCard);

        // ACT
        await service.execute('123', true);

        // ASSERT
        expect(mockCardRepo.getCardById).toHaveBeenCalledWith('123');
        expect(mockCardRepo.updateCard).toHaveBeenCalledWith(
            expect.objectContaining({
                category: Category.SECOND,
                nextReviewDate: expect.any(Date)
            })
        );
    });

    it('should throw CardNotFoundError if card does not exist', async () => {
        (mockCardRepo.getCardById as jest.Mock).mockResolvedValue(undefined);
        const service = new AnswerCardService(mockCardRepo);
        await expect(service.executeWithComparison('non-existent-id', 'answer'))
            .rejects
            .toThrow(CardNotFoundError);

        expect(mockCardRepo.getCardById).toHaveBeenCalledWith('non-existent-id');
        expect(mockCardRepo.updateCard).not.toHaveBeenCalled();
    });

    it('should mark the card as correct when force is true even if answer is wrong', async () => {
        const service = new AnswerCardService(mockCardRepo);
        const card = new Card({ id: '1', question: 'Q', answer: 'Correct', category: Category.FIRST });
        mockCardRepo.getCardById = jest.fn().mockResolvedValue(card);

        await service.executeWithComparison('1', 'Wrong answer', true);

        expect(card.category).toBe(Category.SECOND);
        expect(mockCardRepo.updateCard).toHaveBeenCalledWith(card);
    });

    it('should reset category and update date when answer is invalid', async () => {
        // ARRANGE
        const service = new AnswerCardService(mockCardRepo);
        const existingCard = new Card({
            id: '123',
            question: 'Q',
            answer: 'A',
            category: Category.THIRD
        });

        (mockCardRepo.getCardById as jest.Mock).mockResolvedValue(existingCard);

        // ACT
        await service.execute('123', false);

        // ASSERT
        expect(mockCardRepo.updateCard).toHaveBeenCalledWith(
            expect.objectContaining({
                category: Category.FIRST,
                nextReviewDate: expect.any(Date)
            })
        );
    });

    it('should throw an error if the card is not found', async () => {
        const service = new AnswerCardService(mockCardRepo);
        (mockCardRepo.getCardById as jest.Mock).mockResolvedValue(undefined);

        await expect(service.execute('999', false))
            .rejects
            .toThrow('Card not found');
    });
});