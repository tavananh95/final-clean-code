import {CreateCardService} from '../../src/application/services/create-card-service';
import {Category} from '../../src/domain/models/category';
import {QuizzRepository} from "../../src/application/ports/quizz.repository";
import {CardWriter} from "../../src/application/ports/card-writer.port";

const mockCardWriter = {
    save: jest.fn(),
} as unknown as CardWriter;

const mockQuizzRepo = {
    save: jest.fn(),
    delete: jest.fn()
} as unknown as QuizzRepository;

describe('CreateCardService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a card in FIRST category and schedule it immediately in Quizz', async () => {
        const service = new CreateCardService(mockCardWriter, mockQuizzRepo);
        const command = {question: 'Q', answer: 'A', tag: 'tag'};

        const now = new Date('2024-01-01T12:00:00Z');
        jest.useFakeTimers().setSystemTime(now);

        // Act
        const card = await service.execute(command);

        // Assert
        expect(mockQuizzRepo.save).toHaveBeenCalledWith(
            expect.objectContaining({
                cardId: card.id,
                nextReviewDate: now
            })
        );

        jest.useRealTimers();
    });
});
