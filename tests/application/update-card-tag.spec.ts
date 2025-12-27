import { UpdateCardTagService, UpdateCardTagCommand } from '../../src/application/services/update-card-tag-service';
import { CardRepository } from '../../src/application/ports/card.repository';
import { Card } from '../../src/domain/models/card';
import { CardNotFoundError } from '../../src/domain/errors/card-not-found-error';
import { Category } from '../../src/domain/models/category';

const mockRepo = {
  getCardById: jest.fn(),
  updateCard: jest.fn(),
} as unknown as CardRepository;

describe('UpdateCardTagService', () => {
  beforeEach(() => jest.clearAllMocks());

  it('should update the tag of an existing card', async () => {
    const service = new UpdateCardTagService(mockRepo);
    const card = new Card({ id: '1', question: 'Q', answer: 'A', category: Category.FIRST });
    mockRepo.getCardById = jest.fn().mockResolvedValue(card);

    const command: UpdateCardTagCommand = { cardId: '1', tag: 'new-tag' };
    await service.execute(command);

    expect(card.state.tag).toBe('new-tag');
    expect(mockRepo.updateCard).toHaveBeenCalledWith(card);
  });

  it('should throw CardNotFoundError if card does not exist', async () => {
    const service = new UpdateCardTagService(mockRepo);
    mockRepo.getCardById = jest.fn().mockResolvedValue(undefined);

    const command: UpdateCardTagCommand = { cardId: '999', tag: 'x' };
    await expect(service.execute(command)).rejects.toThrow(CardNotFoundError);
    expect(mockRepo.updateCard).not.toHaveBeenCalled();
    });

  it('should allow removing the tag (undefined)', async () => {
    const service = new UpdateCardTagService(mockRepo);
    const card = new Card({ id: '2', question: 'Q', answer: 'A', category: Category.FIRST, tag: 'old' });
    mockRepo.getCardById = jest.fn().mockResolvedValue(card);

    const command: UpdateCardTagCommand = { cardId: '2', tag: undefined };
    await service.execute(command);

    expect(card.state.tag).toBeUndefined();
    expect(mockRepo.updateCard).toHaveBeenCalledWith(card);
  });
});
