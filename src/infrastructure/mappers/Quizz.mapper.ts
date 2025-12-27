import {QuizzEntity} from '../database/entities/quizz.entity';
import {Quizz} from '../../domain/models/quizz';

export class QuizzMapper {
    static toPersistence(domain: Quizz): QuizzEntity {
        const entity = new QuizzEntity();
        entity.cardId = domain.cardId;
        entity.nextReviewDate = domain.nextReviewDate;
        return entity;
    }
}