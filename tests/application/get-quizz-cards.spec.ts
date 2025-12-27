import { GetQuizzCardsService } from '../../src/application/services/get-quizz-cards-service';
import { CardRepository } from '../../src/application/ports/card.repository';
import { Card } from '../../src/domain/models/card';
import { Category } from '../../src/domain/models/category';

describe('GetQuizzCardsService', () => {
    let mockRepo: Partial<CardRepository>;
    let service: GetQuizzCardsService;

    beforeEach(() => {
        mockRepo = {
            getCardsToReview: jest.fn(),
        };
        service = new GetQuizzCardsService(mockRepo as CardRepository);
        jest.clearAllMocks();
    });

    it('should return cards from repository for a given date', async () => {
        const date = new Date('2025-12-27');
        const cards = [
            new Card({ id: '1', question: 'Q1', answer: 'A1', category: Category.FIRST }),
            new Card({ id: '2', question: 'Q2', answer: 'A2', category: Category.SECOND }),
        ];

        (mockRepo.getCardsToReview as jest.Mock).mockResolvedValue(cards);

        const result = await service.execute(date);

        expect(mockRepo.getCardsToReview).toHaveBeenCalledWith(date);
        expect(result).toEqual(cards);
    });

    it('should return empty array if repository returns no cards', async () => {
        const date = new Date();
        (mockRepo.getCardsToReview as jest.Mock).mockResolvedValue([]);

        const result = await service.execute(date);

        expect(mockRepo.getCardsToReview).toHaveBeenCalledWith(date);
        expect(result).toEqual([]);
    });
});
