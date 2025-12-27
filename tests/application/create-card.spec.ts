import { CreateCardService } from '../../src/application/services/create-card-service';
import { CardRepository } from '../../src/application/ports/card.repository';
import { Category } from '../../src/domain/models/category';

const mockCardRepo = {
    createCard: jest.fn(),
} as unknown as CardRepository;

describe('CreateCardService', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create a card in FIRST category and persist it', async () => {
        const service = new CreateCardService(mockCardRepo);
        const command = {
            question: 'la réponse de l univers?',
            answer: '42',
            tag: 'architecture'
        };

        const card = await service.execute(command);

        expect(card.category).toBe(Category.FIRST);
        expect(card.state.question).toBe(command.question);
        expect(card.state.answer).toBe(command.answer);
        expect(card.state.tag).toBe(command.tag);

        expect(mockCardRepo.createCard).toHaveBeenCalledWith(card);
    });

    it('should throw an error if question is empty', async () => {
        const service = new CreateCardService(mockCardRepo);
        const command = {
            question: '',
            answer: 'Some answer',
            tag: 'test'
        };

        await expect(service.execute(command))
            .rejects
            .toThrow('Question is required');

        expect(mockCardRepo.createCard).not.toHaveBeenCalled();
    });

    it('should throw an error if answer is empty', async () => {
        const service = new CreateCardService(mockCardRepo);
        const command = {
            question: 'Some question',
            answer: '',
            tag: 'test'
        };

        await expect(service.execute(command))
            .rejects
            .toThrow('Answer is required');

        expect(mockCardRepo.createCard).not.toHaveBeenCalled();
    });

    it('should create a card without tag when question and answer are provided', async () => {
        const service = new CreateCardService(mockCardRepo);
        const command = {
            question: 'Some question',
            answer: 'Some answer'
        };

        const card = await service.execute(command);

        expect(card.category).toBe(Category.FIRST);
        expect(card.state.question).toBe(command.question);
        expect(card.state.answer).toBe(command.answer);
        expect(card.state.tag).toBeUndefined();

        expect(mockCardRepo.createCard).toHaveBeenCalledWith(card);
    });
});
