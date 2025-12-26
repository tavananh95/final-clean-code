import { CardRepository } from '../../src/application/ports/card.repository';
import { Card } from '../../src/domain/models/card';
import {Category} from "../../src/domain/models/category";
import {AnswerCardService} from "../../src/application/services/answer-card-service";


const mockCardRepo = {
    getCardById: jest.fn(),
    updateCard: jest.fn(),
} as unknown as CardRepository;

describe('AnswerCardService', () => {
    it('should retrieve the card, apply the rule, and save it', async () => {
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
        await service.execute('123', false); // User answers incorrectly

        // ASSERT
        expect(mockCardRepo.getCardById).toHaveBeenCalledWith('123');

        expect(mockCardRepo.updateCard).toHaveBeenCalledWith(
            expect.objectContaining({
                category: Category.FIRST
            })
        );
    });

    it('should throw an error if the card is not found', async () => {
        // ARRANGE
        const service = new AnswerCardService(mockCardRepo);
        (mockCardRepo.getCardById as jest.Mock).mockResolvedValue(undefined);

        // ACT & ASSERT
        await expect(service.execute('999', false))
            .rejects
            .toThrow('Card not found');
    });
});