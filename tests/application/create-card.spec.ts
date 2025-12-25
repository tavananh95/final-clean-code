import { CreateCardService } from '../../src/application/services/createCardService';
import { CardRepository } from '../../src/application/ports/card.repository';
import { Category } from '../../src/domain/models/category';

const mockCardRepo = {
    createCard: jest.fn(),
} as unknown as CardRepository;

describe('CreateCardService', () => {
    it('should create a card in FIRST category and persist it', async () => {
        // Arrange
        const service = new CreateCardService(mockCardRepo);
        const command = { question: 'What is SOLID?', answer: 'Design principles', tag: 'architecture' };

        // Act
        const card = await service.execute(command);

        // Assert
        expect(card.category).toBe(Category.FIRST);
        expect(card.state.question).toBe(command.question);
        expect(card.state.answer).toBe(command.answer);
        expect(card.state.tag).toBe(command.tag);

        expect(mockCardRepo.createCard).toHaveBeenCalledWith(card);
    });
});
