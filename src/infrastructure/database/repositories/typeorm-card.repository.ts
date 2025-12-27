import {DataSource, ILike, IsNull, LessThanOrEqual, Not, Repository} from 'typeorm';
import {Card} from '../../../domain/models/card';
import {CardMapper} from "../../mappers/card.mapper";
import {CardEntity} from "../entities/card.entity";
import {QuizzEntity} from "../entities/quizz.entity";
import {CardReader} from "../../../application/ports/card-reader.port";
import {QuizzSource} from "../../../application/ports/quizz-source.port";
import {CardWriter} from "../../../application/ports/card-writer.port";

export class TypeOrmCardRepository implements CardWriter, CardReader, QuizzSource {
    private repo: Repository<CardEntity>;

    constructor(dataSource: DataSource) {
        this.repo = dataSource.getRepository(CardEntity);
    }

    // --- Implémentation de CardWriter ---
    async save(card: Card): Promise<void> {
        const persistenceData = CardMapper.toPersistence(card);
        await this.repo.save(persistenceData);
    }

    async update(card: Card): Promise<void> { // Renommé updateCard -> update pour matcher l'interface
        const persistenceData = CardMapper.toPersistence(card);
        await this.repo.save(persistenceData);
    }

    // --- Implémentation de CardReader ---
    async getById(cardId: string): Promise<Card | undefined> { // Renommé getCardById -> getById
        const entity = await this.repo.findOneBy({id: cardId});
        if (!entity) return undefined;
        return CardMapper.toDomain(entity);
    }

    async findByTag(tag: string): Promise<Card[]> {
        const entities = await this.repo.find({
            where: {tag: ILike(tag)},
            order: {category: 'ASC'},
        });
        return entities.map(CardMapper.toDomain);
    }

    // --- Implémentation de QuizzSource ---
    async getCardsToReview(date: Date): Promise<Card[]> {
        const qb = this.repo.createQueryBuilder('card');
        const cards = await qb
            .leftJoinAndSelect(QuizzEntity, 'quizz', 'quizz.cardId = card.id')
            .where('card.category != :done', {done: 'DONE'})
            .andWhere('(quizz.nextReviewDate <= :date)', {date})
            .orderBy('quizz.nextReviewDate', 'ASC')
            .getMany();

        return cards.map(CardMapper.toDomain);
    }
}