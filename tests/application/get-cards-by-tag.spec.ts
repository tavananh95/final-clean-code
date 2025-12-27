import {Card} from '../../src/domain/models/card';
import {Category} from '../../src/domain/models/category';
import {GetCardsByTagService} from "../../src/application/services/get-cards-by-tag-service";
import {CardReader} from "../../src/application/ports/card-reader.port";

const mockRepo = {
    findByTag: jest.fn(),
} as unknown as CardReader;

describe('GetCardsByTagService', () => {
    beforeEach(() => jest.clearAllMocks());

    it('should call repository.findByTag and return cards', async () => {
        // ARRANGE
        const service = new GetCardsByTagService(mockRepo);
        const cards = [
            new Card({id: '1', question: 'Q1', answer: 'A1', category: Category.FIRST, tag: 'learning'}),
            new Card({id: '2', question: 'Q2', answer: 'A2', category: Category.SECOND, tag: 'learning'}),
        ];
        (mockRepo.findByTag as jest.Mock).mockResolvedValue(cards);

        // ACT
        const result = await service.execute('learning');

        // ASSERT
        expect(mockRepo.findByTag).toHaveBeenCalledWith('learning');
        expect(result).toBe(cards);
    });

    it('should return empty array when repository returns empty array', async () => {
        // ARRANGE
        const service = new GetCardsByTagService(mockRepo);
        (mockRepo.findByTag as jest.Mock).mockResolvedValue([]);

        // ACT
        const result = await service.execute('unknown');

        // ASSERT
        expect(mockRepo.findByTag).toHaveBeenCalledWith('unknown');
        expect(result).toEqual([]);
    });
});
