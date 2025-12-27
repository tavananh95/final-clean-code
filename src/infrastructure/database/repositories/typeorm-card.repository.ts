import {DataSource, ILike, IsNull, LessThanOrEqual, Not, Repository} from 'typeorm';
import {Card} from '../../../domain/models/card';
import {CardMapper} from "../../mappers/card.mapper";
import {CardEntity} from "../entities/card.entity";
import {CardRepository} from "../../../application/ports/card.repository";
import {Category} from "../../../domain/models/category";
import { In } from 'typeorm';

export class TypeOrmCardRepository implements CardRepository {
    private repo: Repository<CardEntity>;

    constructor(dataSource: DataSource) {
        this.repo = dataSource.getRepository(CardEntity);
    }

    async getCardsToReview(date: Date): Promise<Card[]> {
        const entities = await this.repo.find({
            where: [
                {
                    nextReviewDate: LessThanOrEqual(date),
                    category: Not(Category.DONE)
                },
                {
                    nextReviewDate: IsNull(),
                    category: Not(Category.DONE)
                }
            ],
            order: {nextReviewDate: 'ASC'},
        });
        return entities.map(CardMapper.toDomain);
    }

    async getCardById(cardId: string): Promise<Card | undefined> {
        const entity = await this.repo.findOneBy({id: cardId});
        if (!entity) {
            return undefined;
        }
        return CardMapper.toDomain(entity);
    }

    async updateCard(card: Card): Promise<void> {
        const persistenceData = CardMapper.toPersistence(card);
        await this.repo.save(persistenceData);
    }

    async createCard(card: Card): Promise<void> {
        const persistenceData = CardMapper.toPersistence(card);
        await this.repo.save(persistenceData);
    }

    async findByTags(tags?: string[]): Promise<Card[]> {
    const where = tags && tags.length > 0
        ? { tag: In(tags) }
        : {};

    const entities = await this.repo.find({
        where,
        order: { category: 'ASC' },
    });

    return entities.map(CardMapper.toDomain);
}
}