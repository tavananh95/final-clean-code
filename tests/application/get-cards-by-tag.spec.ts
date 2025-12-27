import { CardRepository } from '../../src/application/ports/card.repository';
import { Card } from '../../src/domain/models/card';
import { Category } from '../../src/domain/models/category';
import {GetCardsByTagService} from "../../src/application/services/get-cards-by-tag-service";

const mockRepo = {
    findByTags: jest.fn(),
} as unknown as CardRepository;

describe('GetCardsByTagService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should call repository.findByTags and return cards', async () => {
        // ARRANGE
        const service = new GetCardsByTagService(mockRepo);
        const cards = [
            new Card({ id: '1', question: 'Q1', answer: 'A1', category: Category.FIRST, tag: 'learning' }),
            new Card({ id: '2', question: 'Q2', answer: 'A2', category: Category.SECOND, tag: 'learning' }),
        ];
        (mockRepo.findByTags as jest.Mock).mockResolvedValue(cards);

        // ACT
        const result = await service.execute(['learning']);

        // ASSERT
        expect(mockRepo.findByTags).toHaveBeenCalledWith(['learning']);
        expect(result).toBe(cards);
    });

    it('should return empty array when repository returns empty array', async () => {
        // ARRANGE
        const service = new GetCardsByTagService(mockRepo);
        (mockRepo.findByTags as jest.Mock).mockResolvedValue([]);

        // ACT
        const result = await service.execute(['unknown']);

        // ASSERT
        expect(mockRepo.findByTags).toHaveBeenCalledWith(['unknown']);
        expect(result).toEqual([]);
    });
});
