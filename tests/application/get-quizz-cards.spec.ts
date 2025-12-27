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

    it('should return cards from repository for a given date and set lastQuizzDate', async () => {
        const date = new Date('2025-12-27');
        const cards = [
            new Card({ id: '1', question: 'Q1', answer: 'A1', category: Category.FIRST }),
            new Card({ id: '2', question: 'Q2', answer: 'A2', category: Category.SECOND }),
        ];

        (mockRepo.getCardsToReview as jest.Mock).mockResolvedValue(cards);

        const result = await service.execute(date);

        expect(mockRepo.getCardsToReview).toHaveBeenCalledWith(date);
        expect(result).toHaveLength(2);

        result.forEach(card => {
            expect(card.lastQuizzDate).toBeDefined();
            expect(card.lastQuizzDate?.toDateString()).toBe(date.toDateString());
        });
    });

    it('should filter out cards that already have lastQuizzDate today', async () => {
        const today = new Date('2025-12-27');
        const card1 = new Card({ id: '1', question: 'Q1', answer: 'A1', category: Category.FIRST });
        const card2 = new Card({ id: '2', question: 'Q2', answer: 'A2', category: Category.SECOND });
        card1.setLastQuizzDate(today);

        (mockRepo.getCardsToReview as jest.Mock).mockResolvedValue([card1, card2]);

        const result = await service.execute(today);

        expect(result).toHaveLength(1);
        expect(result[0].id).toBe('2');
        expect(result[0].lastQuizzDate?.toDateString()).toBe(today.toDateString());
    });

    it('should return empty array if repository returns no cards', async () => {
        const date = new Date();
        (mockRepo.getCardsToReview as jest.Mock).mockResolvedValue([]);

        const result = await service.execute(date);

        expect(mockRepo.getCardsToReview).toHaveBeenCalledWith(date);
        expect(result).toEqual([]);
    });
});
