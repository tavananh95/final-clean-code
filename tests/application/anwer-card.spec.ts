import {Card} from '../../src/domain/models/card';
import {Category} from "../../src/domain/models/category";
import {AnswerCardService} from "../../src/application/services/answer-card-service";
import {QuizzRepository} from "../../src/application/ports/quizz.repository";
import {CardReader} from "../../src/application/ports/card-reader.port";
import {CardWriter} from "../../src/application/ports/card-writer.port";

describe('AnswerCardService', () => {
    const mockCardReader = {
        getById: jest.fn(),
    } as unknown as CardReader;

    const mockCardWriter = {
        update: jest.fn(),
    } as unknown as CardWriter;

    const mockQuizzRepo = {
        save: jest.fn(),
        delete: jest.fn(),
    } as unknown as QuizzRepository;

    beforeEach(() => {
        jest.clearAllMocks();
    })
    it('should update category in CardRepo and save date in QuizzRepo', async () => {
        // ARRANGE
        const service = new AnswerCardService(mockCardReader, mockCardWriter, mockQuizzRepo);
        const card = new Card({id: '1', question: 'Q', answer: 'A', category: Category.FIRST});

        (mockCardReader.getById as jest.Mock).mockResolvedValue(card);

        const fixedNow = new Date('2024-01-01T12:00:00Z');
        jest.useFakeTimers().setSystemTime(fixedNow);

        // ACT
        await service.execute('1', true);

        // ASSERT

        expect(mockCardWriter.update).toHaveBeenCalledWith(
            expect.objectContaining({category: Category.SECOND})
        );

        const expectedDate = new Date('2024-01-03T12:00:00Z');
        expect(mockQuizzRepo.save).toHaveBeenCalledWith({
            cardId: '1',
            nextReviewDate: expectedDate
        });

        jest.useRealTimers();
    });

    it('should delete quizz entry if category becomes DONE', async () => {
        // ARRANGE
        const service = new AnswerCardService(mockCardReader, mockCardWriter, mockQuizzRepo);
        const card = new Card({id: '1', question: 'Q', answer: 'A', category: Category.SEVENTH});
        (mockCardReader.getById as jest.Mock).mockResolvedValue(card);

        // ACT
        await service.execute('1', true); // Passage à DONE

        // ASSERT
        expect(mockCardWriter.update).toHaveBeenCalledWith(
            expect.objectContaining({category: Category.DONE})
        );
        expect(mockQuizzRepo.delete).toHaveBeenCalledWith('1');
    });

    it('should throw an error if the card is not found', async () => {
        const service = new AnswerCardService(mockCardReader, mockCardWriter, mockQuizzRepo);
        (mockCardReader.getById as jest.Mock).mockResolvedValue(undefined);

        await expect(service.execute('999', false))
            .rejects
            .toThrow('Card not found');
    });
});