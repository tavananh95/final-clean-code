import {DataSource, ILike, IsNull, LessThanOrEqual, Not, Repository} from 'typeorm';
import {Card} from '../../../domain/models/card';
import {CardMapper} from "../../mappers/card.mapper";
import {CardEntity} from "../entities/card.entity";
import {CardRepository} from "../../../application/ports/card.repository";

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
                    category: Not('Done')
                },
                {
                    nextReviewDate: IsNull(),
                    category: Not('Done')
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

    async findByTag(tag: string): Promise<Card[]> {
        const entities = await this.repo.find({
            where: {tag: ILike(tag)},
            order: {category: 'ASC'},
        });

        return entities.map(CardMapper.toDomain);
    }
}