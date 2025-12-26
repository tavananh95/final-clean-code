import {CardRepository} from '../../src/application/ports/card.repository';
import {Card} from '../../src/domain/models/card';
import {Category} from "../../src/domain/models/category";
import {AnswerCardService} from "../../src/application/services/answer-card-service";


const mockCardRepo = {
    getCardById: jest.fn(),
    updateCard: jest.fn(),
} as unknown as CardRepository;

describe('AnswerCardService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })
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