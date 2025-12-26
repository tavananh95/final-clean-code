import { UpdateCardTagService } from '../../src/application/services/update-card-tag-service';
import { CardRepository } from '../../src/application/ports/card.repository';
import { Card } from '../../src/domain/models/card';
import { Category } from '../../src/domain/models/category';

const mockRepo = {
    getCardById: jest.fn(),
    updateCard: jest.fn(),
} as unknown as CardRepository;

describe('UpdateCardTagService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should set the tag and persist the card', async () => {
        // ARRANGE
        const service = new UpdateCardTagService(mockRepo);

        const card = new Card({
            id: '123',
            question: 'Q',
            answer: 'A',
            category: Category.FIRST,
            tag: 'old',
        });

        (mockRepo.getCardById as jest.Mock).mockResolvedValue(card);

        // ACT
        await service.execute({ cardId: '123', tag: 'learning' });

        // ASSERT
        expect(mockRepo.getCardById).toHaveBeenCalledWith('123');
        expect(mockRepo.updateCard).toHaveBeenCalledTimes(1);

        const updatedCardArg = (mockRepo.updateCard as jest.Mock).mock.calls[0][0] as Card;
        expect(updatedCardArg.state.tag).toBe('learning');
    });

    it('should remove the tag when tag is null', async () => {
        // ARRANGE
        const service = new UpdateCardTagService(mockRepo);

        const card = new Card({
            id: '123',
            question: 'Q',
            answer: 'A',
            category: Category.FIRST,
            tag: 'old',
        });

        (mockRepo.getCardById as jest.Mock).mockResolvedValue(card);

        // ACT
        const req = {
            params: { cardId: '123' },
            body: { tag: null },
        } as unknown as Request;

        await service.execute({ cardId: '123', tag: null });

        // ASSERT
        const updatedCardArg = (mockRepo.updateCard as jest.Mock).mock.calls[0][0] as Card;
        expect(updatedCardArg.state.tag).toBeUndefined();
    });

    it('should throw if card does not exist', async () => {
        // ARRANGE
        const service = new UpdateCardTagService(mockRepo);
        (mockRepo.getCardById as jest.Mock).mockResolvedValue(undefined);

        // ACT & ASSERT
        await expect(service.execute({ cardId: 'missing', tag: 'learning' }))
            .rejects
            .toThrow('Card not found');

        expect(mockRepo.updateCard).not.toHaveBeenCalled();
    });
});
